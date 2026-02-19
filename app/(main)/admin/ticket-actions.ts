'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type TicketType = {
    name: string
    price: number
    total_tickets: number
    drinks_included: number
}

export type TicketTypeForUpdate = {
    id?: string           // present = existing row; absent = new row
    name: string
    price: number
    total_tickets: number
    drinks_included: number
}

// ─── CREATE ────────────────────────────────────────────────────────────────

export async function createEventWithTicketTypes(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const endsAtInput = formData.get('ends_at') as string
    const salesEndsAtInput = formData.get('sales_ends_at') as string | null
    const imageFile = formData.get('event_image') as File | null
    const ticketTypesRaw = formData.get('ticket_types') as string

    let ticketTypes: TicketType[] = []
    try {
        ticketTypes = JSON.parse(ticketTypesRaw)
    } catch (e) {
        throw new Error('Invalid ticket types format')
    }

    if (!title || !description || !date || !time || !endsAtInput) {
        throw new Error('Missing required fields')
    }
    if (ticketTypes.length === 0) {
        throw new Error('At least one ticket type is required')
    }

    const eventDate = new Date(`${date}T${time}`)
    const endsAt = new Date(endsAtInput)
    const now = new Date()

    if (eventDate < now) throw new Error('Event date cannot be in the past')
    if (endsAt <= eventDate) throw new Error('Event end time must be after start time')

    const eventDateISO = eventDate.toISOString()
    const endsAtISO = endsAt.toISOString()
    let salesEndsAtISO: string | null = null

    if (salesEndsAtInput) {
        const salesEndsAt = new Date(salesEndsAtInput)
        if (salesEndsAt < now) throw new Error('Sales end time cannot be in the past')
        salesEndsAtISO = salesEndsAt.toISOString()
    }

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('You must be logged in to create events')

        const { data: userVenue, error: venueError } = await supabase
            .from('venues')
            .select('id')
            .eq('owner_id', user.id)
            .maybeSingle()

        if (venueError || !userVenue) throw new Error('No venue assigned to your account')

        const venueId = userVenue.id
        let imageUrl: string | null = null

        if (imageFile && imageFile.size > 0) {
            try {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `${user.id}/${fileName}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('event-images')
                    .upload(filePath, imageFile, { cacheControl: '3600', upsert: false })
                if (uploadError) {
                    console.error('❌ Error uploading image:', uploadError)
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('event-images').getPublicUrl(uploadData.path)
                    imageUrl = publicUrl
                }
            } catch (imageError) {
                console.error('❌ Image upload failed:', imageError)
            }
        }

        const { data: newEvent, error: eventError } = await supabase
            .from('events')
            .insert({
                title, description,
                event_date: eventDateISO,
                ends_at: endsAtISO,
                sales_ends_at: salesEndsAtISO,
                venue_id: venueId,
                status: 'active',
                image_url: imageUrl,
            })
            .select('id')
            .single()

        if (eventError || !newEvent) {
            console.error('❌ Error creating event:', eventError)
            if (imageUrl) {
                const pathToDelete = imageUrl.split('/event-images/')[1]
                if (pathToDelete) await supabase.storage.from('event-images').remove([pathToDelete])
            }
            throw new Error('Failed to create event')
        }

        const eventId = newEvent.id

        const ticketTypeInserts = ticketTypes.map(tt => ({
            event_id: eventId,
            name: tt.name,
            price: tt.price,
            total_tickets: tt.total_tickets,
            sold_tickets: 0,
            drinks_included: tt.drinks_included || 0,
        }))

        const { error: ticketTypesError } = await supabase
            .from('ticket_types')
            .insert(ticketTypeInserts)

        if (ticketTypesError) {
            console.error('❌ Error creating ticket types:', ticketTypesError)
            await supabase.from('events').delete().eq('id', eventId)
            if (imageUrl) {
                const pathToDelete = imageUrl.split('/event-images/')[1]
                if (pathToDelete) await supabase.storage.from('event-images').remove([pathToDelete])
            }
            throw new Error('Failed to create ticket types')
        }

        console.log('✅ Event created successfully:', eventId)
        revalidatePath('/admin/events')
        revalidatePath('/')
    } catch (error) {
        console.error('❌ Unexpected error in createEventWithTicketTypes:', error)
        throw error
    }

    redirect('/admin/events?success=true')
}

// ─── UPDATE ────────────────────────────────────────────────────────────────

export async function updateEventWithTicketTypes(
    eventId: string,
    formData: FormData,
    ticketTypes: TicketTypeForUpdate[]
) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const endsAtInput = formData.get('ends_at') as string
    const salesEndsAtInput = formData.get('sales_ends_at') as string | null
    const imageFile = formData.get('event_image') as File | null
    const imageDeleted = formData.get('image_deleted') === 'true'

    if (!title || !description || !date || !time || !endsAtInput) {
        throw new Error('Missing required fields')
    }
    if (ticketTypes.length === 0) {
        throw new Error('At least one ticket type is required')
    }

    const eventDate = new Date(`${date}T${time}`)
    const endsAt = new Date(endsAtInput)
    if (endsAt <= eventDate) throw new Error('Event end time must be after start time')

    let salesEndsAtISO: string | null = null
    if (salesEndsAtInput) salesEndsAtISO = new Date(salesEndsAtInput).toISOString()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Fetch current event image
    const { data: currentEvent } = await supabase
        .from('events').select('image_url').eq('id', eventId).single()

    let imageUrl: string | null = currentEvent?.image_url ?? null

    if (imageDeleted) imageUrl = null

    if (imageFile && imageFile.size > 0) {
        try {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `${user.id}/${fileName}`
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(filePath, imageFile, { cacheControl: '3600', upsert: false })
            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('event-images').getPublicUrl(uploadData.path)
                imageUrl = publicUrl
            } else {
                console.error('❌ Image upload failed:', uploadError)
            }
        } catch (e) {
            console.error('❌ Image upload exception:', e)
        }
    }

    // ── Update event row ──────────────────────────────────────────────────
    const { error: eventError } = await supabase
        .from('events')
        .update({
            title, description,
            event_date: eventDate.toISOString(),
            ends_at: endsAt.toISOString(),
            sales_ends_at: salesEndsAtISO,
            image_url: imageUrl,
        })
        .eq('id', eventId)

    if (eventError) {
        console.error('❌ Error updating event:', eventError)
        throw new Error('Failed to update event')
    }

    // ── Sync ticket types (admin client bypasses RLS on ticket_types) ──
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const toUpdate = ticketTypes.filter(tt => tt.id)
    const toInsert = ticketTypes.filter(tt => !tt.id)

    // Update existing ticket types
    for (const tt of toUpdate) {
        const { error: updateError } = await supabaseAdmin
            .from('ticket_types')
            .update({
                name: tt.name,
                price: tt.price,
                total_tickets: tt.total_tickets,
                drinks_included: tt.drinks_included,
            })
            .eq('id', tt.id!)
        if (updateError) {
            console.error(`❌ Error updating ticket type ${tt.id}:`, updateError)
        } else {
            console.log(`🎫 Updated ticket type ${tt.id}: total_tickets=${tt.total_tickets}`)
        }
    }

    // Insert new ticket types
    if (toInsert.length > 0) {
        const { error: insertError } = await supabaseAdmin
            .from('ticket_types')
            .insert(toInsert.map(tt => ({
                event_id: eventId,
                name: tt.name,
                price: tt.price,
                total_tickets: tt.total_tickets,
                sold_tickets: 0,
                drinks_included: tt.drinks_included,
            })))
        if (insertError) console.error('❌ Failed to insert new ticket types:', insertError)
        else console.log(`➕ Inserted ${toInsert.length} new ticket type(s)`)
    }

    // Soft-close removed types (set total_tickets = sold_tickets → 0 available)
    const submittedIds = toUpdate.map(tt => tt.id!)
    const { data: allTypes } = await supabaseAdmin
        .from('ticket_types').select('id, sold_tickets').eq('event_id', eventId)

    const removedTypes = (allTypes ?? []).filter((t: { id: string; sold_tickets: number }) => !submittedIds.includes(t.id))
    for (const rt of removedTypes) {
        const { error: closeError } = await supabaseAdmin
            .from('ticket_types')
            .update({ total_tickets: rt.sold_tickets })
            .eq('id', rt.id)
        if (closeError) console.error(`❌ Failed to soft-close ticket type ${rt.id}:`, closeError)
        else console.log(`🔒 Soft-closed ticket type ${rt.id}`)
    }

    console.log(`✅ Event ${eventId} updated successfully`)
    revalidatePath('/')
    revalidatePath('/admin/events')
    revalidatePath(`/admin/events/${eventId}/edit`)
    revalidatePath(`/events/${eventId}`)

    redirect('/admin/events?updated=true')
}
