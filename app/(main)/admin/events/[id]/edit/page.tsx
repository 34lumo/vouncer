import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditEventForm from './EditEventForm'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch event with venue ownership check AND ticket_types
    const { data: event, error } = await supabase
        .from('events')
        .select(`
            id,
            title,
            description,
            event_date,
            ends_at,
            sales_ends_at,
            image_url,
            venue_id,
            venues!inner ( owner_id ),
            ticket_types (
                id,
                name,
                price,
                total_tickets,
                sold_tickets,
                drinks_included
            )
        `)
        .eq('id', id)
        .single()

    if (error || !event) notFound()

    // Security: verify user owns the venue
    const venue = event.venues as any
    if (venue.owner_id !== user.id) notFound()

    const ticketTypes = (event.ticket_types as Array<{
        id: string
        name: string
        price: number
        total_tickets: number
        sold_tickets: number
        drinks_included: number
    }> | null) ?? []

    const eventData = {
        id: event.id,
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        ends_at: event.ends_at,
        sales_ends_at: event.sales_ends_at,
        image_url: event.image_url,
    }

    return <EditEventForm event={eventData} ticketTypes={ticketTypes} />
}
