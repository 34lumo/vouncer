// app/admin/events/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { Plus, Calendar, MapPin, Ticket, DollarSign, Pencil } from 'lucide-react'
import DeleteButton from './delete-button'

interface Event {
    id: string
    title: string
    description: string
    event_date: string
    price: number
    stock: number
    total_tickets: number
    status: string
    image_url: string | null
    venues: {
        name: string
        city: string
        country: string
    }
}

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; updated?: string }>
}) {
    const { success, updated } = await searchParams
    const supabase = await createClient()

    // 1. OBTENER USUARIO ACTUAL
    const { data: { user } } = await supabase.auth.getUser()

    // 2. BUSCAR EL VENUE PROPIO (Para saber qué filtrar)
    const { data: myVenue } = await supabase
        .from('venues')
        .select('id')
        .eq('owner_id', user?.id)
        .single()

    // 3. OBTENER EVENTOS (Aplicando el filtro de seguridad por código)
    // Si tienes venue, traemos TUS eventos. Si no, devolvemos array vacío.
    const { data: events, error } = myVenue
        ? await supabase
            .from('events')
            .select(`
            id, title, description, event_date, price, stock, total_tickets, status, image_url,
            venues ( name, city, country )
        `)

            .eq('venue_id', myVenue.id) // <--- 🔒 EL CANDADO: Solo eventos de TU local
            .order('event_date', { ascending: false })
        : { data: [], error: null }

    if (error) console.error('Error fetching events:', error)

    const eventsList = (events as unknown as Event[]) || []

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-32">
            <div className="max-w-6xl mx-auto">

                {/* Header Interno de la página */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Event Management</h1>
                        <p className="text-zinc-400">Manage all your events in one place</p>
                    </div>

                    {/* Botón condicional: Solo sale si tienes Venue (para evitar errores) */}
                    {myVenue ? (
                        <Link
                            href="/admin/events/new"
                            className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl w-fit"
                        >
                            <Plus className="w-5 h-5" />
                            Create Event
                        </Link>
                    ) : (
                        <div className="text-red-400 text-sm border border-red-500/50 bg-red-500/10 px-4 py-2 rounded-lg">
                            ⚠️ No tienes un Local asociado. Contacta con soporte.
                        </div>
                    )}
                </div>

                {/* Success Alert */}
                {(success || updated) && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-green-400 font-medium">
                            ✅ Event {updated ? 'updated' : 'created'} successfully!
                        </p>
                    </div>
                )}

                {/* Events List */}
                {eventsList.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                        <Ticket className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-zinc-400 mb-2">No events found</h3>
                        <p className="text-zinc-500 mb-6">
                            {myVenue
                                ? "You haven't created any events yet."
                                : "You need a venue assigned to create events."}
                        </p>

                        {myVenue && (
                            <Link
                                href="/admin/events/new"
                                className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Create First Event
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {eventsList.map((event) => {
                            const eventDate = new Date(event.event_date)
                            const formattedDate = eventDate.toLocaleDateString('es-ES', {
                                weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
                            })
                            const formattedTime = eventDate.toLocaleTimeString('es-ES', {
                                hour: '2-digit', minute: '2-digit',
                            })

                            const venue = Array.isArray(event.venues) ? event.venues[0] : event.venues
                            const soldTickets = event.total_tickets - event.stock
                            const soldPercentage = Math.max(0, (soldTickets / event.total_tickets) * 100)

                            return (
                                <div
                                    key={event.id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Event Image or Fallback */}
                                        <div className="relative w-full md:w-64 h-48 md:h-auto bg-gradient-to-br from-zinc-800 to-zinc-900 flex-shrink-0">
                                            {event.image_url ? (
                                                <Image
                                                    src={event.image_url}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 256px"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Ticket className="w-16 h-16 text-zinc-700" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Event Details */}
                                        <div className="flex-1 p-6 flex flex-col">
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-white group-hover:text-zinc-100 flex-1">
                                                            {event.title}
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'active'
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                                                            : 'bg-zinc-700/50 text-zinc-400 border border-zinc-700'
                                                            }`}>
                                                            {event.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-400 text-sm line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/events/${event.id}/edit`}
                                                        className="p-3 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/50 hover:border-sky-500 transition-all group/btn"
                                                        title="Edit event"
                                                    >
                                                        <Pencil className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                                    </Link>
                                                    <DeleteButton eventId={event.id} eventTitle={event.title} />
                                                </div>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                                    <div>
                                                        <p className="text-zinc-500 text-xs">Date</p>
                                                        <p className="text-white font-medium">{formattedDate}</p>
                                                        <p className="text-zinc-400 text-xs">{formattedTime}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4 text-zinc-500" />
                                                    <div>
                                                        <p className="text-zinc-500 text-xs">Venue</p>
                                                        <p className="text-white font-medium">{venue?.name}</p>
                                                        <p className="text-zinc-400 text-xs">{venue?.city}, {venue?.country}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <DollarSign className="w-4 h-4 text-zinc-500" />
                                                    <div>
                                                        <p className="text-zinc-500 text-xs">Price</p>
                                                        <p className="text-white font-medium">${event.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Ticket className="w-4 h-4 text-zinc-500" />
                                                    <div>
                                                        <p className="text-zinc-500 text-xs">Tickets</p>
                                                        <p className="text-white font-medium">{soldTickets} / {event.total_tickets}</p>
                                                        <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1">
                                                            <div
                                                                className="bg-green-500 h-1.5 rounded-full transition-all"
                                                                style={{ width: `${soldPercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}