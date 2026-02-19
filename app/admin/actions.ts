'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
    const supabase = await createClient()

    // Extract form data (no venue fields anymore)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const priceInput = formData.get('price') as string
    const totalTicketsInput = formData.get('total_tickets') as string
    const imageFile = formData.get('event_image') as File | null

    // Parse as integers (price is int4 in database)
    const price = parseInt(priceInput, 10)
    const totalTickets = parseInt(totalTicketsInput, 10)

    // 🛡️ VALIDATION 1: Negative or Zero Prices
    if (isNaN(price) || price < 0) {
        throw new Error('Price must be a positive number. Free events should use 0.')
    }

    // 🛡️ VALIDATION 2: Negative or Zero Tickets
    if (isNaN(totalTickets) || totalTickets <= 0) {
        throw new Error('Total tickets must be at least 1.')
    }

    // 🛡️ VALIDATION 3: Past Event Dates
    const eventDate = new Date(`${date}T${time}`)
    const now = new Date()

    if (eventDate < now) {
        throw new Error('Event date cannot be in the past. Check your date and time.')
    }

    const eventDateISO = eventDate.toISOString()

    // 🛡️ VALIDATION 4: Duplicate Event Prevention (Idempotency)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString()
    const { data: recentDuplicate } = await supabase
        .from('events')
        .select('id')
        .eq('title', title)
        .eq('event_date', eventDateISO)
        .eq('price', price)
        .gte('created_at', fiveMinutesAgo)
        .maybeSingle()

    if (recentDuplicate) {
        console.log('Duplicate event detected, redirecting to list')
        redirect('/admin/events?success=true')
    }

    try {
        // 🔐 Get authenticated user's venue via RLS
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('You must be logged in to create events.')
        }

        // Query the venue that belongs to this user (owner_id = user.id)
        const { data: userVenue, error: venueError } = await supabase
            .from('venues')
            .select('id')
            .eq('owner_id', user.id)
            .maybeSingle()

        if (venueError) {
            console.error('❌ Error fetching user venue:', venueError)
            throw new Error('Failed to fetch your venue. Please try again.')
        }

        if (!userVenue) {
            throw new Error('No venue assigned to your account. Please contact support to set up your venue.')
        }

        const venueId = userVenue.id
        console.log('✅ Using venue:', venueId, 'for user:', user.id)

        // 📸 HANDLE IMAGE UPLOAD (if provided)
        let imageUrl: string | null = null

        if (imageFile && imageFile.size > 0) {
            try {
                // Generate unique filename
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                console.log('📤 Uploading image:', filePath)

                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('event-images')
                    .upload(filePath, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    })

                if (uploadError) {
                    console.error('❌ Error uploading image:', uploadError)
                    throw new Error('Failed to upload image. Please try again.')
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('event-images')
                    .getPublicUrl(uploadData.path)

                imageUrl = publicUrl
                console.log('✅ Image uploaded successfully:', imageUrl)
            } catch (imageError) {
                console.error('❌ Image upload failed:', imageError)
                // Continue without image rather than failing the entire event creation
                console.log('⚠️ Continuing event creation without image')
            }
        }

        // Create the event with stock = total_tickets
        const { error: eventError } = await supabase
            .from('events')
            .insert({
                title,
                description,
                event_date: eventDateISO,
                price, // int4
                total_tickets: totalTickets, // int4
                stock: totalTickets, // 🔥 CRITICAL: stock must equal total_tickets for new events
                venue_id: venueId,
                status: 'active',
                image_url: imageUrl, // 📸 Add image URL
            })

        if (eventError) {
            console.error('❌ Error creating event:', eventError)

            // If event creation fails and we uploaded an image, clean it up
            if (imageUrl) {
                const pathToDelete = imageUrl.split('/event-images/')[1]
                if (pathToDelete) {
                    await supabase.storage.from('event-images').remove([pathToDelete])
                    console.log('🗑️ Cleaned up uploaded image after event creation failure')
                }
            }

            throw new Error('Failed to create event. Please try again.')
        }

        console.log('✅ Event created successfully')

        // Success! Revalidate and redirect
        revalidatePath('/admin/events')
    } catch (error) {
        console.error('Unexpected error in createEvent:', error)
        throw error
    }

    // Redirect with success parameter
    redirect('/admin/events?success=true')
}

export async function updateEvent(formData: FormData) {
    const supabase = await createClient()

    // Extract form data
    const eventId = formData.get('event_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const priceInput = formData.get('price') as string
    const totalTicketsInput = formData.get('total_tickets') as string
    const imageFile = formData.get('event_image') as File | null
    const imageDeletedFlag = formData.get('image_deleted') as string

    if (!eventId) {
        throw new Error('Event ID is required')
    }

    // Parse as integers
    const price = parseInt(priceInput, 10)
    const totalTickets = parseInt(totalTicketsInput, 10)

    // 🛡️ VALIDATION 1: Negative or Zero Prices
    if (isNaN(price) || price < 0) {
        throw new Error('Price must be a positive number. Free events should use 0.')
    }

    // 🛡️ VALIDATION 2: Negative or Zero Tickets
    if (isNaN(totalTickets) || totalTickets <= 0) {
        throw new Error('Total tickets must be at least 1.')
    }

    // 🛡️ VALIDATION 3: Past Event Dates
    const eventDate = new Date(`${date}T${time}`)
    const now = new Date()

    if (eventDate < now) {
        throw new Error('Event date cannot be in the past. Check your date and time.')
    }

    const eventDateISO = eventDate.toISOString()

    try {
        // 🔐 Security: Get authenticated user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('You must be logged in to update events.')
        }

        // 🔐 Security: Verify user owns the venue associated with this event
        const { data: existingEvent, error: fetchError } = await supabase
            .from('events')
            .select(`
                id,
                image_url,
                venue_id,
                venues!inner (
                    owner_id
                )
            `)
            .eq('id', eventId)
            .single()

        if (fetchError || !existingEvent) {
            throw new Error('Event not found.')
        }

        const venue = existingEvent.venues as any
        if (venue.owner_id !== user.id) {
            throw new Error('You do not have permission to edit this event.')
        }

        // 📸 HANDLE IMAGE UPDATE
        let imageUrl: string | null = existingEvent.image_url

        // Case 1: User uploaded a new image
        if (imageFile && imageFile.size > 0) {
            try {
                // Generate unique filename
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                console.log('📤 Uploading new image:', filePath)

                // Upload new image to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('event-images')
                    .upload(filePath, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    })

                if (uploadError) {
                    console.error('❌ Error uploading new image:', uploadError)
                    throw new Error('Failed to upload new image. Please try again.')
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('event-images')
                    .getPublicUrl(uploadData.path)

                imageUrl = publicUrl
                console.log('✅ New image uploaded successfully:', imageUrl)

                // Delete old image from storage if it exists
                if (existingEvent.image_url) {
                    const oldPathToDelete = existingEvent.image_url.split('/event-images/')[1]
                    if (oldPathToDelete) {
                        await supabase.storage.from('event-images').remove([oldPathToDelete])
                        console.log('🗑️ Deleted old image:', oldPathToDelete)
                    }
                }
            } catch (imageError) {
                console.error('❌ Image update failed:', imageError)
                throw new Error('Failed to update image. Please try again.')
            }
        }
        // Case 2: User explicitly deleted the image (clicked X button)
        else if (imageDeletedFlag === 'true') {
            console.log('🗑️ User requested image deletion')

            // Delete old image from storage if it exists
            if (existingEvent.image_url) {
                const oldPathToDelete = existingEvent.image_url.split('/event-images/')[1]
                if (oldPathToDelete) {
                    await supabase.storage.from('event-images').remove([oldPathToDelete])
                    console.log('🗑️ Deleted image from storage:', oldPathToDelete)
                }
            }

            // Set image_url to null in database
            imageUrl = null
        }
        // Case 3: No changes to image (keep existing)
        // imageUrl remains as existingEvent.image_url

        // Update the event
        const { error: updateError } = await supabase
            .from('events')
            .update({
                title,
                description,
                event_date: eventDateISO,
                price,
                total_tickets: totalTickets,
                image_url: imageUrl,
            })
            .eq('id', eventId)

        if (updateError) {
            console.error('❌ Error updating event:', updateError)
            throw new Error('Failed to update event. Please try again.')
        }

        console.log('✅ Event updated successfully:', eventId)

        // Revalidate paths
        revalidatePath('/admin/events')
        revalidatePath('/')
        revalidatePath(`/events/${eventId}`)
    } catch (error) {
        console.error('❌ Unexpected error in updateEvent:', error)
        throw error
    }

    // Redirect with success parameter
    redirect('/admin/events?updated=true')
}

export async function deleteEvent(formData: FormData) {
    const supabase = await createClient()
    const eventId = formData.get('id') as string

    if (!eventId) {
        throw new Error('Event ID is required')
    }

    try {
        // Get event details to delete associated image
        const { data: event } = await supabase
            .from('events')
            .select('image_url')
            .eq('id', eventId)
            .single()

        // Delete the event
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId)

        if (error) {
            console.error('❌ Error deleting event:', error)
            throw new Error('Failed to delete event. Please try again.')
        }

        // Delete associated image from storage if it exists
        if (event?.image_url) {
            const pathToDelete = event.image_url.split('/event-images/')[1]
            if (pathToDelete) {
                await supabase.storage.from('event-images').remove([pathToDelete])
                console.log('🗑️ Deleted associated image:', pathToDelete)
            }
        }

        console.log('✅ Event deleted successfully:', eventId)

        // Revalidate the events list
        revalidatePath('/admin/events')
    } catch (error) {
        console.error('❌ Unexpected error in deleteEvent:', error)
        throw error
    }
}