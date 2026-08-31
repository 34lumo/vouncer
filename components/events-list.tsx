import { createPublicClient } from '@/utils/supabase/public'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays, MapPin, Ticket } from 'lucide-react'

export async function EventsList() {
    const supabase = createPublicClient()

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()

    const { data: events, error } = await supabase
        .from('events')
        .select('*, venues(name, city, address), ticket_types(*)')
        .gt('ends_at', twelveHoursAgo)
        .order('event_date', { ascending: true })
        .limit(6)

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
                const rawVenue = event.venues
                const venue = Array.isArray(rawVenue) ? rawVenue[0] : rawVenue

                let locationText = 'Ubicación por confirmar'
                if (venue) {
                    if (venue.address && venue.address.trim() !== '') {
                        locationText = `${venue.name}, ${venue.address}`
                    } else if (venue.city) {
                        locationText = `${venue.name}, ${venue.city}`
                    } else {
                        locationText = venue.name
                    }
                }

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
                const now = new Date()
                const ticketTypes = (event as any).ticket_types as Array<{ price: number; total_tickets: number; sold_tickets: number }> | null
                const endsAt = (event as any).ends_at ? new Date((event as any).ends_at) : null
                const salesEndsAt = (event as any).sales_ends_at ? new Date((event as any).sales_ends_at) : null

                const isSoldOut = ticketTypes != null && ticketTypes.length > 0 &&
                    ticketTypes.every(tt => tt.sold_tickets >= tt.total_tickets)
                const isFinished = !isSoldOut && endsAt && now > endsAt
                const isSalesClosed = !isSoldOut && !isFinished && salesEndsAt && now > salesEndsAt
                const isAvailable = !isSoldOut && !isFinished && !isSalesClosed

                return (
                    <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className={`group flex flex-col bg-zinc-900/60 border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] ${!isAvailable ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                        <div className="h-56 bg-zinc-900 w-full relative overflow-hidden">
                            {imageUrl ? (
                                <>
                                    <Image
                                        src={imageUrl}
                                        alt={event.title || 'Event'}
                                        fill
                                        quality={65}
                                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${!isAvailable ? 'grayscale' : ''}`}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <Ticket className="w-24 h-24" />
                                </div>
                            )}

                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 min-w-[56px] text-center">
                                <span className="block text-xl font-bold text-white leading-none">{day}</span>
                                <span className="block text-[10px] text-sky-300 font-semibold tracking-wider mt-0.5">{month}</span>
                            </div>

                            {isSoldOut && (
                                <div className="absolute top-4 right-4 bg-red-600 text-white font-bold py-1.5 px-3 rounded-full text-[10px] uppercase tracking-wide">
                                    AGOTADO
                                </div>
                            )}
                            {isFinished && (
                                <div className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 font-bold py-1.5 px-3 rounded-full text-[10px] uppercase tracking-wide">
                                    FINALIZADO
                                </div>
                            )}
                            {isSalesClosed && (
                                <div className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 font-bold py-1.5 px-3 rounded-full text-[10px] uppercase tracking-wide">
                                    VENTA CERRADA
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-sky-100 transition-colors">
                                {event.title}
                            </h3>
                            <div className="flex flex-col gap-1.5 text-zinc-500 text-sm mb-6">
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">{locationText}</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    <span>{time}h</span>
                                </span>
                            </div>
                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-0.5">
                                        {isSoldOut ? 'Agotado' : isSalesClosed ? 'Venta Cerrada' : isFinished ? 'Finalizado' : 'Entrada'}
                                    </p>
                                    <p className="text-base font-bold text-white">{getPriceLabel(ticketTypes)}</p>
                                </div>
                                {isAvailable ? (
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-zinc-600" />
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
