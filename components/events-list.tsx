import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays, MapPin, Ticket } from 'lucide-react'

export async function EventsList() {
    const supabase = await createClient()

    // Optimized query: only fetch necessary fields
    const { data: events, error } = await supabase
        .from('events')
        .select('id, title, event_date, image_url, price, venues(name, city)')
        .order('event_date', { ascending: true })
        .limit(6)

    const formatPrice = (price: number | string | null) => {
        if (!price) return 'Gratis'
        const numPrice = typeof price === 'string' ? parseFloat(price) : price
        if (isNaN(numPrice)) return 'Gratis'
        return `$${Math.round(numPrice).toLocaleString('es-CO')}`
    }

    if (error) {
        return (
            <div className="text-center py-20 border border-red-500/20 bg-red-500/5 rounded-3xl">
                <p className="text-red-400">Error cargando eventos: {error.message}</p>
            </div>
        )
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[2rem] bg-zinc-900/20">
                <Ticket className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 text-lg">No hay eventos disponibles por ahora.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
                const venuesArray = event.venues as { name: string; city: string }[] | null
                const venue = venuesArray && venuesArray.length > 0 ? venuesArray[0] : null
                const locationText = venue ? `${venue.name}, ${venue.city}` : 'Ubicación secreta'
                const eventDate = event.event_date ? new Date(event.event_date) : null
                const day = eventDate ? eventDate.toLocaleDateString('es-ES', { day: 'numeric' }) : '?'
                const month = eventDate ? eventDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '') : ''
                const time = eventDate ? eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'
                const imageUrl = (event as any).image_url

                return (
                    <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="group relative flex flex-col bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-sky-500/30"
                    >
                        <div className="h-64 bg-gradient-to-b from-zinc-800 via-zinc-900/80 to-black/50 w-full relative overflow-hidden">
                            {imageUrl ? (
                                <>
                                    <Image
                                        src={imageUrl}
                                        alt={event.title || 'Event'}
                                        fill
                                        quality={65}
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
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
                                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Entrada</p>
                                    <p className="text-xl font-bold text-white">{formatPrice(event.price)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500 group-hover:border-sky-500 transition-all duration-300 group-hover:scale-110">
                                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
