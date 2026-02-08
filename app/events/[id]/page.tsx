import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, MapPin, Lock, Ticket, CheckCircle2 } from 'lucide-react'

// Forzamos que la página sea dinámica
export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Consulta a Supabase
  const { data: event, error } = await supabase
    .from('events')
    .select('*, venues(*)')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Preparación de datos
  const venue = event.venues as { name: string; city: string } | null
  const locationName = venue ? `${venue.name}, ${venue.city}` : 'Ubicación secreta'
  
  const eventDate = event.event_date ? new Date(event.event_date) : null
  const dateStr = eventDate
    ? eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Fecha por confirmar'
  const timeStr = eventDate
    ? eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : '--:--'

  const priceFormatted = event.price 
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(event.price)
    : 'Gratis'

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
              <span>{locationName}</span>
            </div>
          </div>
        </div>

        {/* --- 3. LAYOUT PRINCIPAL --- */}
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          
          {/* COLUMNA IZQUIERDA: Info */}
          <div className="space-y-10">
            {/* Imagen Principal (Ticket Icono Placeholder) */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-105 transition-transform duration-700">
                <Ticket className="w-32 h-32 text-white" />
              </div>
            </div>

            {/* Descripción */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-white mb-4">Sobre el evento</h3>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Vive la experiencia definitiva en <strong>{locationName}</strong>. 
                Una noche diseñada para los amantes de la buena música y el ambiente exclusivo. 
                Tu entrada incluye acceso preferente con Vouncer.
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: Ticket Box (Desktop Only) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl shadow-black/50">
              
              {/* Precio */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-zinc-500 font-medium uppercase tracking-wide">Precio Entrada</span>
                <span className="text-4xl font-bold tracking-tight text-white">
                  {priceFormatted}
                </span>
              </div>

              {/* Disponibilidad */}
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Entradas Disponibles</span>
              </div>

              {/* BOTÓN DE COMPRA */}
              <Link
                href={`/checkout/${id}`}
                className="group w-full rounded-xl bg-white px-6 py-4 text-center text-base font-bold text-black transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Comprar Entradas
              </Link>

              <div className="flex items-center justify-center gap-2 text-zinc-500 border-t border-white/10 pt-4">
                <Lock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Pago procesado de forma segura</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- 4. BARRA MÓVIL (Fixed Bottom) --- */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/80 px-6 py-4 backdrop-blur-xl lg:hidden safe-area-bottom">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 font-medium uppercase">Total</span>
            <span className="text-xl font-bold text-white">
              {priceFormatted}
            </span>
          </div>
          <Link
            href={`/checkout/${id}`}
            className="flex-1 rounded-xl bg-white px-6 py-3 text-center text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
          >
            Comprar Ahora
          </Link>
        </div>
      </div>

    </div>
  )
}