import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Ticket, Calendar } from 'lucide-react'

interface SearchParams {
    event_id?: string
    quantity?: string
    email?: string
}

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const { event_id, quantity: quantityParam, email } = await searchParams
    const userEmail = email || 'tu correo'
    const quantity = parseInt(quantityParam ?? '1', 10) || 1

    // Fetch event info for the summary card
    let eventTitle = 'Tu Evento'
    let eventDate = ''
    let venueName = ''

    if (event_id) {
        const supabase = await createClient()
        const { data: event } = await supabase
            .from('events')
            .select('title, event_date, venues(name, city)')
            .eq('id', event_id)
            .single()

        if (event) {
            eventTitle = event.title ?? eventTitle
            const venue = event.venues as unknown as { name: string; city: string } | null
            venueName = venue ? `${venue.name}, ${venue.city}` : ''
            if (event.event_date) {
                const d = new Date(event.event_date)
                eventDate = d.toLocaleDateString('es-ES', {
                    weekday: 'long', day: 'numeric', month: 'long',
                })
            }
        }
    }

    const entradaLabel = quantity === 1 ? 'entrada' : 'entradas'

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Ambient background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in duration-500">

                {/* ── Header ── */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4 ring-1 ring-green-500/50">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">¡Pago Confirmado!</h1>
                    <p className="text-zinc-400 text-sm">
                        Hemos enviado un resumen a{' '}
                        <span className="text-white font-medium">{userEmail}</span>.
                    </p>
                </div>

                {/* ── Purchase Summary Card ── */}
                <div className="w-full bg-white text-black rounded-3xl p-6 shadow-2xl shadow-green-900/20 relative overflow-hidden mb-4">
                    {/* Ticket notch decorations */}
                    <div className="absolute top-2/3 -left-3 w-6 h-6 bg-[#050505] rounded-full" />
                    <div className="absolute top-2/3 -right-3 w-6 h-6 bg-[#050505] rounded-full" />

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">VOUNCER PASS</p>
                            <h2 className="text-xl font-black mt-1 uppercase truncate max-w-[220px]">{eventTitle}</h2>
                        </div>
                        <Ticket className="w-6 h-6 text-zinc-300 flex-shrink-0" />
                    </div>

                    {/* Quantity — the star of the summary */}
                    <div className="flex flex-col items-center justify-center py-6 bg-zinc-50 rounded-2xl border border-zinc-100 mb-6">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Entradas Compradas</p>
                        <p className="text-6xl font-black text-black leading-none">×{quantity}</p>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mt-1">
                            {entradaLabel}
                        </p>
                    </div>

                    {/* Event details */}
                    <div className="border-t border-dashed border-zinc-200 pt-4 space-y-2">
                        {eventDate && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                                <span className="text-zinc-600 capitalize">{eventDate}</span>
                            </div>
                        )}
                        {venueName && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-zinc-400">📍</span>
                                <span className="text-zinc-600">{venueName}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-2">
                            <p className="text-[10px] uppercase text-zinc-400 font-bold">Estado</p>
                            <p className="font-bold text-sm text-green-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                ACTIVO
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Info note ── */}
                <p className="text-zinc-500 text-xs text-center mb-6 px-4">
                    Recibirás el QR de cada entrada en el email. Preséntalo en la puerta el día del evento.
                </p>

                {/* ── Actions ── */}
                <div className="w-full space-y-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-100 transition-colors text-sm"
                    >
                        Ver más eventos <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}