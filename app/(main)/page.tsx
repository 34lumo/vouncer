import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { LayoutTextFlip } from "@/components/ui/layout-text-flip"
import { EventsList } from '@/components/events-list'
import { EventsGridSkeleton } from '@/components/skeletons/events-grid-skeleton'
import { Suspense } from 'react'

export const revalidate = 0

export default function Home() {
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
            className="object-cover opacity-50 mix-blend-luminosity"
          />
        </div>

        {/* 2. CAPA DE DEGRADADO (Para que el texto se lea bien) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#050505]/80 to-[#050505]" />

        {/* 3. ORBES DE LUZ */}
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-sky-600/10 rounded-full blur-[180px] mix-blend-overlay opacity-50" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-zinc-600/10 rounded-full blur-[180px] mix-blend-overlay opacity-30" />
      </div>


      <main className="relative z-10">

        {/* HERO SECTION - Renders immediately */}
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

        {/* EVENTS GRID - Streams in with Suspense */}
        <section id="eventos" className="py-24 px-6 relative border-t border-white/5 bg-[#050505]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Cartelera Semanal</h2>
                <p className="text-zinc-400">Eventos verificados y disponibles ahora.</p>
              </div>
            </div>

            {/* Suspense Boundary: Shows skeleton immediately, streams EventsList */}
            <Suspense fallback={<EventsGridSkeleton />}>
              <EventsList />
            </Suspense>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black/40 relative z-10 text-center text-zinc-600 text-sm">
        <p>© 2026 Vouncer Inc. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}