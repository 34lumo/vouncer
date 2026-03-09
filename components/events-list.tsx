import { createPublicClient } from '@/utils/supabase/public'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays, MapPin, Ticket } from 'lucide-react'

export async function EventsList() {
    const supabase = createPublicClient()

    // Optimized query: JOIN with venues, fetch lifecycle data including address
    // Filter: Show events until 12 hours AFTER they end
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()

    const { data: events, error } = await supabase
        .from('events')
        .select('*, venues(name, city, address), ticket_types(*)')
        .gt('ends_at', twelveHoursAgo)  // Hide events 12 hours after they finish
        .order('event_date', { ascending: true })
        .limit(6)

    // Derive price display from ticket_types (ignoring legacy event.price)
    const getPriceLabel = (ticketTypes: Array<{ price: number }> | null | undefined): string => {
        if (!ticketTypes || ticketTypes.length === 0) return 'Próximamente'
        const minPrice = Math.min(...ticketTypes.map(t => t.price))
        if (minPrice === 0) return 'Gratis'
        return `Desde ${new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(minPrice)}`
    }

    if (error) {
        console.error('Error fetching events:', error)
        return (
            <div className="text-center py-12">
                <p className="text-zinc-400">Error al cargar los eventos. Por favor, inténtalo más tarde.</p>
            </div>
        )
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-zinc-400">No hay eventos próximos en este momento. ¡Vuelve pronto!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
                // 1. Extract Venue Data safely (Handle Array or Object)
                const rawVenue = event.venues
                const venue = Array.isArray(rawVenue) ? rawVenue[0] : rawVenue

                // 2. Calculate Location Text (Strict Priority)
                let locationText = 'Ubicación por confirmar'

                if (venue) {
                    if (venue.address && venue.address.trim() !== '') {
                        locationText = `${venue.name}, ${venue.address}` // Priority 1: Address
                    } else if (venue.city) {
                        locationText = `${venue.name}, ${venue.city}`    // Priority 2: City
                    } else {
                        locationText = venue.name                        // Priority 3: Name
                    }
                }

                // Use local timezone for date formatting
                const eventDate = event.event_date ? new Date(event.event_date) : null
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

                const day = eventDate ? new Intl.DateTimeFormat('es-ES', {
                    day: 'numeric',
                    timeZone: userTimeZone
                }).format(eventDate) : '?'

                const month = eventDate ? new Intl.DateTimeFormat('es-ES', {
                    month: 'short',
                    timeZone: userTimeZone
                }).format(eventDate).toUpperCase().replace('.', '') : ''

                const time = eventDate ? new Intl.DateTimeFormat('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: userTimeZone
                }).format(eventDate) : '--:--'

                const imageUrl = (event as any).image_url

                // Event lifecycle state logic - STRICT PRIORITY HIERARCHY
                const now = new Date()
                const ticketTypes = (event as any).ticket_types as Array<{ price: number; total_tickets: number; sold_tickets: number }> | null
                const endsAt = (event as any).ends_at ? new Date((event as any).ends_at) : null
                const salesEndsAt = (event as any).sales_ends_at ? new Date((event as any).sales_ends_at) : null

                // SOLD OUT: all ticket types exhausted (or no types at all but had tickets before)
                const isSoldOut = ticketTypes != null && ticketTypes.length > 0 &&
                    ticketTypes.every(tt => tt.sold_tickets >= tt.total_tickets)

                // PRIORITY 2: FINISHED (now > ends_at)
                const isFinished = !isSoldOut && endsAt && now > endsAt

                // PRIORITY 3: SALES CLOSED (sales_ends_at exists AND now > sales_ends_at)
                const isSalesClosed = !isSoldOut && !isFinished && salesEndsAt && now > salesEndsAt

                // PRIORITY 4: ACTIVE (default)
                const isAvailable = !isSoldOut && !isFinished && !isSalesClosed

                return (
                    <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className={`group relative flex flex-col bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-sky-500/30 ${!isAvailable ? 'opacity-75 pointer-events-none' : ''}`}
                    >
                        <div className="h-64 bg-gradient-to-b from-zinc-800 via-zinc-900/80 to-black/50 w-full relative overflow-hidden">
                            {imageUrl ? (
                                <>
                                    <Image
                                        src={imageUrl}
                                        alt={event.title || 'Event'}
                                        fill
                                        quality={65}
                                        className={`object-cover group-hover:scale-110 transition-transform duration-700 ${!isAvailable ? 'opacity-80 grayscale' : ''}`}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[1]" />
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110 text-sky-200">
                                    <Ticket className="w-28 h-28" />
                                </div>
                            )}
                            <div className="absolute top-5 left-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 min-w-[64px] text-center z-10">
                                <span className="block text-2xl font-extrabold text-white leading-none">{day}</span>
                                <span className="block text-[11px] text-sky-300 font-bold tracking-wider mt-1">{month}</span>
                            </div>

                            {/* Status Badges - STRICT PRIORITY HIERARCHY */}
                            {/* PRIORITY 1: SOLD OUT - Red Badge */}
                            {isSoldOut && (
                                <div className="absolute top-5 right-5 bg-red-600 text-white font-bold py-2 px-4 rounded-full text-center uppercase tracking-wide z-10">
                                    <span className="text-xs">AGOTADO</span>
                                </div>
                            )}

                            {/* PRIORITY 2: FINISHED - Black/Dark Zinc Badge */}
                            {isFinished && (
                                <div className="absolute top-5 right-5 bg-zinc-900 text-zinc-400 font-bold py-2 px-4 rounded-full text-center uppercase tracking-wide z-10">
                                    <span className="text-xs">FINALIZADO</span>
                                </div>
                            )}

                            {/* PRIORITY 3: SALES CLOSED - Gray/Zinc Badge */}
                            {isSalesClosed && (
                                <div className="absolute top-5 right-5 bg-zinc-800 text-zinc-400 font-bold py-2 px-4 rounded-full text-center uppercase tracking-wide z-10">
                                    <span className="text-xs">VENTA CERRADA</span>
                                </div>
                            )}
                        </div>

                        <div className="p-8 flex flex-col flex-grow relative">
                            <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 z-10 group-hover:text-sky-100 transition-colors">
                                {event.title}
                            </h3>
                            <div className="flex flex-col gap-2 text-zinc-400 text-sm mb-8 z-10">
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-zinc-400" />
                                    <span className="truncate">{locationText}</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-zinc-400" />
                                    <span>{time}h</span>
                                </span>
                            </div>
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between z-10 relative">
                                <div>
                                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">
                                        {isSoldOut ? 'Agotado' : isSalesClosed ? 'Venta Cerrada' : isFinished ? 'Finalizado' : 'Entrada'}
                                    </p>
                                    <p className="text-xl font-bold text-white">{getPriceLabel(ticketTypes)}</p>
                                </div>
                                {isAvailable ? (
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500 group-hover:border-sky-500 transition-all duration-300 group-hover:scale-110">
                                        <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-zinc-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
