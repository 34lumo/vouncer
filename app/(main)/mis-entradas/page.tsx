import { createClient as createAdminClient } from '@supabase/supabase-js'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { Ticket, Calendar, MapPin, ArrowLeft, AlertTriangle } from 'lucide-react'

// Prevent Next.js from caching a stale empty result
export const dynamic = 'force-dynamic'

interface SearchParams {
    ids?: string
}

export default async function MisEntradasPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    // ── No auth gate — guest magic link via ?ids=uuid1,uuid2,... ──────────
    const { ids } = await searchParams

    if (!ids || ids.trim() === '') {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-7 h-7 text-amber-400" />
                </div>
                <h1 className="text-xl font-bold mb-2">Enlace inválido</h1>
                <p className="text-zinc-500 text-sm">
                    Usa el botón del correo de confirmación para acceder a tus entradas.
                </p>
            </div>
        )
    }

    // Safe parse — trim whitespace from each UUID
    const idsArray = ids.split(',').map(s => s.trim()).filter(Boolean)
    console.log('🎟️ mis-entradas: idsArray =', idsArray)

    // Use Service Role to bypass RLS — UUIDs are unguessable, act as auth
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: tickets, error } = await supabaseAdmin
        .from('tickets')
        .select('*')
        .in('id', idsArray)

    console.log('🎟️ mis-entradas: tickets =', JSON.stringify(tickets))
    if (error) console.error('❌ Error real:', error?.message, '|', error?.details, '|', error?.hint)

    const hasTickets = tickets && tickets.length > 0

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-zinc-900 px-4 py-4 flex items-center gap-3">
                <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-lg font-bold">Mis Entradas</h1>
                {hasTickets && (
                    <span className="ml-auto text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full">
                        {tickets.length} {tickets.length === 1 ? 'entrada' : 'entradas'}
                    </span>
                )}
            </header>

            <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
                {!hasTickets ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                            <Ticket className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Sin entradas</h2>
                        <p className="text-zinc-500 text-sm mb-6">
                            No encontramos entradas para este enlace.
                        </p>
                        <Link
                            href="/"
                            className="bg-white text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-zinc-100 transition-colors"
                        >
                            Ver Eventos
                        </Link>
                    </div>
                ) : (
                    tickets.map((ticket) => {
                        // ⚠️ STATIC QR VALUE — always use qr_token ?? id.
                        // Never generate new strings at render time.
                        const qrValue = (ticket.qr_token ?? ticket.id) as string

                        const event = ticket.events as unknown as {
                            id: string
                            title: string
                            event_date: string | null
                            venues: { name: string; city: string } | null
                        } | null
                        const ticketType = ticket.ticket_types as unknown as {
                            name: string
                            drinks_included: number
                        } | null

                        const eventTitle = event?.title ?? 'Evento'
                        const venue = event?.venues
                        const venueLine = venue ? `${venue.name}, ${venue.city}` : ''
                        const eventDate = event?.event_date
                            ? new Date(event.event_date).toLocaleDateString('es-ES', {
                                weekday: 'long', day: 'numeric', month: 'long',
                            })
                            : ''
                        const isUsed = ticket.status === 'used'
                        const displayId = `VNC-${ticket.id.slice(0, 6).toUpperCase()}`

                        return (
                            <div
                                key={ticket.id}
                                className={`relative bg-white text-black rounded-3xl overflow-hidden shadow-2xl shadow-black/60 ${isUsed ? 'opacity-50 grayscale' : ''}`}
                            >
                                {isUsed && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                        <span className="rotate-[-20deg] border-4 border-red-500 text-red-500 font-black text-3xl px-4 py-1 rounded-lg opacity-80">
                                            USADO
                                        </span>
                                    </div>
                                )}

                                {/* Notch decorations */}
                                <div className="absolute top-[65%] -left-3 w-6 h-6 bg-[#050505] rounded-full" />
                                <div className="absolute top-[65%] -right-3 w-6 h-6 bg-[#050505] rounded-full" />

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="flex-1 min-w-0 pr-3">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                VOUNCER PASS
                                            </p>
                                            <h2 className="text-lg font-black mt-0.5 uppercase truncate">
                                                {eventTitle}
                                            </h2>
                                            {ticketType && (
                                                <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                                                    {ticketType.name}
                                                    {ticketType.drinks_included > 0 && (
                                                        <span className="ml-2 text-sky-600">
                                                            🍹 ×{ticketType.drinks_included}
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <Ticket className="w-5 h-5 text-zinc-300 flex-shrink-0 mt-1" />
                                    </div>

                                    {/* QR — static value from DB */}
                                    <div className="flex flex-col items-center py-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <div className="bg-white p-2 rounded-lg shadow">
                                            <QRCode
                                                value={qrValue}
                                                size={160}
                                                viewBox="0 0 256 256"
                                                fgColor="#000000"
                                                bgColor="#ffffff"
                                            />
                                        </div>
                                        <p className="text-[10px] font-mono text-zinc-400 mt-2 tracking-widest">
                                            {displayId}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 pt-4 border-t border-dashed border-zinc-200 space-y-1.5">
                                        {eventDate && (
                                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                <Calendar className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                                                <span className="capitalize">{eventDate}</span>
                                            </div>
                                        )}
                                        {venueLine && (
                                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                                                <span>{venueLine}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-[10px] uppercase text-zinc-400 font-bold">Estado</span>
                                            {isUsed ? (
                                                <span className="text-xs font-bold text-red-500">USADO</span>
                                            ) : (
                                                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    ACTIVO
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </main>
        </div>
    )
}
