import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image' // <--- IMPORTANTE: Importamos Image
import { ArrowRight, CalendarDays, MapPin, Ticket } from 'lucide-react'
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*, venues(name, city)')
    .order('event_date', { ascending: true })
    .limit(6)

  const formatPrice = (price: number | string | null) => {
    if (!price) return 'Gratis'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return 'Gratis'
    return `$${Math.round(numPrice).toLocaleString('es-CO')}`
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-sky-500/30 font-sans overflow-x-hidden">
      
      {/* --- FONDO AMBIENTAL "PRO" --- */}
      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* 1. LA IMAGEN DE FONDO (background.png) */}
        <div className="absolute inset-0 w-full h-full">
            <Image 
                src="/background.png" 
                alt="Background Vouncer"
                fill
                priority
                className="object-cover opacity-50 mix-blend-luminosity"                // opacity-60: Para que no brille mucho y se lea el texto
                // mix-blend-luminosity: (Opcional) Hace que la foto sea blanco y negro azulado, queda muy elegante. Si la quieres a color, quita esta clase.
            />
        </div>

        {/* 2. CAPA DE DEGRADADO (Para que el texto se lea bien) */}
        {/* Esto oscurece la imagen un poco arriba y la funde a negro total abajo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#050505]/80 to-[#050505]" />

        {/* 3. TUS ORBES DE LUZ (Los mantengo porque dan profundidad encima de la foto) */}
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-sky-600/10 rounded-full blur-[180px] mix-blend-overlay opacity-50" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-zinc-600/10 rounded-full blur-[180px] mix-blend-overlay opacity-30" />
      </div>


      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="max-w-6xl mx-auto text-center space-y-10">
            
            {/* Texto Flip */}
            <div className="py-2">
                <LayoutTextFlip 
                    text="Entradas al momento para"
                    words={["Theatron", "Kaputt", "Baum", "Octava", "Video Club", "Clandestino"]} 
                />
            </div>
            
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
              La plataforma oficial de los mejores eventos de Bogotá. <br className="hidden md:block" />
              Sin filas, sin efectivo, directo a la fiesta.
            </p>

            <div className="pt-6">
               <a href="#eventos" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-base transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                 Ver Próximas Fiestas
                 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
               </a>
            </div>
          </div>
        </section>

        {/* EVENTS GRID */}
        {/* Nota: Aquí añadimos backdrop-blur-md para que el grid "borre" la foto de fondo al pasar por encima */}
        <section id="eventos" className="py-24 px-6 relative border-t border-white/5 bg-[#050505]/80 backdrop-blur-xl">
           <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Cartelera Semanal</h2>
                  <p className="text-zinc-400">Eventos verificados y disponibles ahora.</p>
                </div>
              </div>

              {error ? (
                <div className="text-center py-20 border border-red-500/20 bg-red-500/5 rounded-3xl">
                  <p className="text-red-400">Error cargando eventos: {error.message}</p>
                </div>
              ) : !events || events.length === 0 ? (
                <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[2rem] bg-zinc-900/20">
                  <Ticket className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 text-lg">No hay eventos disponibles por ahora.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event) => {
                    const venue = event.venues as { name: string; city: string } | null
                    const locationText = venue ? `${venue.name}, ${venue.city}` : 'Ubicación secreta'
                    const eventDate = event.event_date ? new Date(event.event_date) : null
                    const day = eventDate ? eventDate.toLocaleDateString('es-ES', { day: 'numeric' }) : '?'
                    const month = eventDate ? eventDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '') : ''
                    const time = eventDate ? eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'
                    
                    return (
                      <Link 
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="group relative flex flex-col bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-sky-500/30"
                      >
                        <div className="h-64 bg-gradient-to-b from-zinc-800 via-zinc-900/80 to-black/50 w-full relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110 text-sky-200">
                            <Ticket className="w-28 h-28" />
                          </div>
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
                              <MapPin className="w-4 h-4 text-zinc-500" /> 
                              <span className="truncate">{locationText}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-zinc-500" /> 
                              <span>{time}h</span>
                            </span>
                          </div>
                          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between z-10 relative">
                            <div>
                              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Entrada</p>
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
              )}
           </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black/40 relative z-10 text-center text-zinc-600 text-sm">
        <p>© 2026 Vouncer Inc. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}