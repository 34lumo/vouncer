import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CalendarDays, Clock, MapPin, Lock, Ticket, CheckCircle2 } from 'lucide-react'

// Forzamos que la página sea dinámica
export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Consulta a Supabase - incluye image_url, address, and ticket_types
  const { data: event, error } = await supabase
    .from('events')
    .select('*, venues(name, city, address), ticket_types(*)')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Fetch ticket types (with backward compatibility)
  const ticketTypes = event.ticket_types as Array<{
    id: string
    name: string
    price: number
    total_tickets: number
    sold_tickets: number
    drinks_included: number
  }> | null

  // Preparación de datos
  const venue = event.venues as { name: string; city: string; address?: string | null } | null

  // Location display with priority: address > city > fallback
  let locationName = 'Ubicación por confirmar'
  let fullAddress = ''
  if (venue) {
    if (venue.address) {
      locationName = `${venue.name}, ${venue.address}`
      fullAddress = `${venue.name}, ${venue.address}, ${venue.city}`
    } else if (venue.city) {
      locationName = `${venue.name}, ${venue.city}`
      fullAddress = `${venue.name}, ${venue.city}`
    } else {
      locationName = venue.name
      fullAddress = venue.name
    }
  }

  // Google Maps URL
  const mapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null

  const eventDate = event.event_date ? new Date(event.event_date) : null
  const dateStr = eventDate
    ? eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Fecha por confirmar'
  const timeStr = eventDate
    ? eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : '--:--'

  // Min price derived exclusively from ticket_types (legacy event.price ignored)
  const minPrice = ticketTypes && ticketTypes.length > 0
    ? Math.min(...ticketTypes.map(t => t.price))
    : null
  const minPriceFormatted = minPrice !== null
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(minPrice)
    : null

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-sky-500/30 pb-32 lg:pb-0">

      {/* --- 1. NAVBAR LIMPIO (Sin Logo, solo botón Volver) --- */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl h-16 flex items-center px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Volver a eventos</span>
        </Link>
      </nav>

      {/* --- FONDO AMBIENTAL --- */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-zinc-500/10 blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12">

        {/* --- 2. HEADER DEL EVENTO --- */}
        <div className="mb-12 flex flex-col gap-6 md:items-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">Venta Activa</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-sky-100 to-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-zinc-400 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-sky-400" />
              <span className="capitalize">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors underline decoration-dotted underline-offset-4"
                >
                  {locationName}
                </a>
              ) : (
                <span>{locationName}</span>
              )}
            </div>
          </div>
        </div>

        {/* --- 3. LAYOUT PRINCIPAL --- */}
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* COLUMNA IZQUIERDA: Info */}
          <div className="space-y-10">
            {/* Imagen Principal del Evento */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 group">
              {event.image_url ? (
                <>
                  <Image
                    src={event.image_url}
                    alt={event.title || 'Event poster'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-105 transition-transform duration-700">
                    <Ticket className="w-32 h-32 text-white" />
                  </div>
                </>
              )}
            </div>

            {/* Descripción */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-white mb-4">Sobre el evento</h3>
              <p className="text-zinc-400 leading-relaxed text-lg">
                {event.description || `Vive la experiencia definitiva en ${locationName}. Una noche diseñada para los amantes de la buena música y el ambiente exclusivo. Tu entrada incluye acceso preferente con Vouncer.`}
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: Ticket Box (Desktop Only) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl shadow-black/50">

              {/* Ticket Types or Legacy Price */}
              {ticketTypes && ticketTypes.length > 0 ? (
                <>
                  <div className="flex flex-col gap-1 mb-2">
                    <span className="text-sm text-zinc-500 font-medium uppercase tracking-wide">Tipos de Entrada</span>
                  </div>

                  <div className="space-y-3">
                    {ticketTypes.map((ticketType) => {
                      const isSoldOut = ticketType.sold_tickets >= ticketType.total_tickets
                      const availability = ticketType.total_tickets - ticketType.sold_tickets
                      const ttPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(ticketType.price)

                      return (
                        <div key={ticketType.id} className={`border rounded-xl p-4 transition-all ${isSoldOut ? 'border-zinc-800 bg-zinc-900/50 opacity-60' : 'border-white/10 bg-zinc-800/50 hover:border-sky-500/50'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-white text-lg">{ticketType.name}</h4>
                              {ticketType.drinks_included > 0 && (
                                <p className="text-xs text-sky-400 mt-1">Incluye {ticketType.drinks_included} {ticketType.drinks_included === 1 ? 'consumición' : 'consumiciones'}</p>
                              )}
                            </div>
                            <span className="text-xl font-bold text-white">{ttPrice}</span>
                          </div>

                          {isSoldOut ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center">
                              <span className="text-sm font-bold text-red-400">AGOTADO</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 mb-3">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">{availability} disponibles</span>
                              </div>
                              <Link href={`/checkout/${id}?ticket_type_id=${ticketType.id}`} className="block w-full rounded-lg bg-white px-4 py-2.5 text-center text-sm font-bold text-black transition-all hover:bg-zinc-200">
                                Comprar
                              </Link>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                // No ticket types configured — safe neutral state, NO checkout link
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                  <Ticket className="w-10 h-10 text-zinc-600" />
                  <div>
                    <p className="font-semibold text-zinc-300">Entradas próximamente</p>
                    <p className="text-xs text-zinc-500 mt-1">Los tipos de entrada aún no están configurados.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-zinc-500 border-t border-white/10 pt-4">
                <Lock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Pago procesado de forma segura</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- 4. BARRA MÓVIL (Fixed Bottom) --- */}
      {/* SECURITY: uses ONLY ticket_types data — legacy event.price is never read here */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/90 px-4 py-4 backdrop-blur-xl lg:hidden">
        <div className="max-w-md mx-auto">
          {ticketTypes && ticketTypes.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">
                {minPriceFormatted ? `Desde ${minPriceFormatted}` : 'Tipos de Entrada'}
              </p>
              {ticketTypes.map((ticketType) => {
                const isSoldOut = ticketType.sold_tickets >= ticketType.total_tickets
                const ttPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(ticketType.price)
                const availability = ticketType.total_tickets - ticketType.sold_tickets

                return (
                  <div key={ticketType.id} className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 border transition-all ${isSoldOut
                    ? 'border-zinc-800 bg-zinc-900/60 opacity-60'
                    : 'border-white/10 bg-zinc-900/80 hover:border-sky-500/40'
                    }`}>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{ticketType.name}</p>
                      {ticketType.drinks_included > 0 && (
                        <p className="text-xs text-sky-400">{ticketType.drinks_included} consumición{ticketType.drinks_included > 1 ? 'es' : ''}</p>
                      )}
                      {!isSoldOut && (
                        <p className="text-xs text-emerald-400">{availability} disponibles</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-white">{ttPrice}</span>
                      {isSoldOut ? (
                        <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg">AGOTADO</span>
                      ) : (
                        <Link
                          href={`/checkout/${id}?ticket_type_id=${ticketType.id}`}
                          className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-zinc-200 transition-colors"
                        >
                          Comprar
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // No ticket types configured yet — show a neutral message, NO checkout link
            <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-4">
              <Ticket className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-400 font-medium">Entradas próximamente</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}