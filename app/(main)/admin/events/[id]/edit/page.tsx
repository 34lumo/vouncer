import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditEventForm from './EditEventForm'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch event with venue information
    const { data: event, error } = await supabase
        .from('events')
        .select(`
            id,
            title,
            description,
            event_date,
            price,
            total_tickets,
            image_url,
            venue_id,
            venues!inner (
                owner_id
            )
        `)
        .eq('id', id)
        .single()

    // If event doesn't exist or error occurred
    if (error || !event) {
        notFound()
    }

    // Security check: Verify the user owns the venue
    const venue = event.venues as any
    if (venue.owner_id !== user.id) {
        notFound()
    }

    // Prepare event data for the form (remove venue info)
    const eventData = {
        id: event.id,
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        price: event.price,
        total_tickets: event.total_tickets,
        image_url: event.image_url,
    }

    return <EditEventForm event={eventData} />
}
