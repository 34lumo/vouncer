import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CalendarDays, Clock, MapPin, Lock, Ticket, CheckCircle2 } from 'lucide-react'

export const revalidate = 60

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*, venues(name, city, address), ticket_types(*)')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  const ticketTypes = event.ticket_types as Array<{
    id: string
    name: string
    price: number
    total_tickets: number
    sold_tickets: number
    drinks_included: number
  }> | null

  const venue = event.venues as { name: string; city: string; address?: string | null } | null

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

  const mapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null

  const eventDate = event.event_date ? new Date(event.event_date) : null
  const dateStr = eventDate
    ? eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Fecha por confirmar'
  const timeStr = eventDate
    ? eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : '--:--'

  const minPrice = ticketTypes && ticketTypes.length > 0
    ? Math.min(...ticketTypes.map(t => t.price))
    : null
  const minPriceFormatted = minPrice !== null
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(minPrice)
    : null

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-sky-500/30 pb-32 lg:pb-0">

      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/80 backdrop-blur-md h-14 flex items-center px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white px-2 py-1 rounded-md group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium">Volver</span>
        </Link>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-12">

        <div className="mb-10 flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 w-fit">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">Venta Activa</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-5 text-zinc-400 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-sky-400" />
              <span className="capitalize">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
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

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

          <div className="space-y-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900 group">
              {event.image_url ? (
                <>
                  <Image
                    src={event.image_url}
                    alt={event.title || 'Event poster'}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <Ticket className="w-28 h-28" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Sobre el evento</h3>
              <p className="text-zinc-400 leading-relaxed">
                {event.description || `Vive la experiencia definitiva en ${locationName}. Una noche diseñada para los amantes de la buena música y el ambiente exclusivo. Tu entrada incluye acceso preferente con Vouncer.`}
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-5 rounded-xl border border-white/[0.06] bg-zinc-900/50 p-5">

              {ticketTypes && ticketTypes.length > 0 ? (
                <>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Tipos de Entrada</p>

                  <div className="space-y-2.5">
                    {ticketTypes.map((ticketType) => {
                      const isSoldOut = ticketType.sold_tickets >= ticketType.total_tickets
                      const availability = ticketType.total_tickets - ticketType.sold_tickets
                      const ttPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(ticketType.price)

                      return (
                        <div key={ticketType.id} className={`border rounded-lg p-4 transition-colors ${isSoldOut ? 'border-zinc-800 bg-zinc-900/50 opacity-50' : 'border-white/[0.06] bg-zinc-800/30 hover:border-white/[0.12]'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-white">{ticketType.name}</h4>
                              {ticketType.drinks_included > 0 && (
                                <p className="text-xs text-sky-400 mt-0.5">Incluye {ticketType.drinks_included} {ticketType.drinks_included === 1 ? 'consumición' : 'consumiciones'}</p>
                              )}
                            </div>
                            <span className="text-lg font-bold text-white">{ttPrice}</span>
                          </div>

                          {isSoldOut ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-md px-3 py-1.5 text-center">
                              <span className="text-xs font-bold text-red-400">AGOTADO</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-2.5">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{availability} disponibles</span>
                              </div>
                              <Link href={`/checkout/${id}?ticket_type_id=${ticketType.id}`} className="block w-full rounded-md bg-white px-4 py-2 text-center text-sm font-semibold text-black transition-colors hover:bg-zinc-200">
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
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <Ticket className="w-8 h-8 text-zinc-600" />
                  <p className="font-medium text-zinc-300 text-sm">Entradas próximamente</p>
                  <p className="text-xs text-zinc-500">Los tipos de entrada aún no están configurados.</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 text-zinc-500 border-t border-white/5 pt-4">
                <Lock className="h-3 w-3" />
                <span className="text-[11px]">Pago seguro</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.06] bg-black/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="max-w-md mx-auto">
          {ticketTypes && ticketTypes.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide mb-1.5">
                {minPriceFormatted ? `Desde ${minPriceFormatted}` : 'Tipos de Entrada'}
              </p>
              {ticketTypes.map((ticketType) => {
                const isSoldOut = ticketType.sold_tickets >= ticketType.total_tickets
                const ttPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(ticketType.price)
                const availability = ticketType.total_tickets - ticketType.sold_tickets

                return (
                  <div key={ticketType.id} className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 border transition-colors ${isSoldOut
                    ? 'border-zinc-800 bg-zinc-900/60 opacity-50'
                    : 'border-white/[0.06] bg-zinc-900/80'
                    }`}>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{ticketType.name}</p>
                      {ticketType.drinks_included > 0 && (
                        <p className="text-[11px] text-sky-400">{ticketType.drinks_included} consumición{ticketType.drinks_included > 1 ? 'es' : ''}</p>
                      )}
                      {!isSoldOut && (
                        <p className="text-[11px] text-emerald-400">{availability} disponibles</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-white">{ttPrice}</span>
                      {isSoldOut ? (
                        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md">AGOTADO</span>
                      ) : (
                        <Link
                          href={`/checkout/${id}?ticket_type_id=${ticketType.id}`}
                          className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors"
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
            <div className="flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-zinc-900/80 px-4 py-3">
              <Ticket className="w-4 h-4 text-zinc-500" />
              <span className="text-sm text-zinc-400">Entradas próximamente</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
