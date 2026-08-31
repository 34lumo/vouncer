import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LayoutTextFlip } from "@/components/ui/layout-text-flip"
import { EventsList } from '@/components/events-list'
import { EventsGridSkeleton } from '@/components/skeletons/events-grid-skeleton'
import { Suspense } from 'react'

export const revalidate = 60

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-sky-500/30 font-sans overflow-x-hidden">

      <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/background.png"
          alt=""
          fill
          priority
          quality={50}
          className="object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#050505]/80 to-[#050505]" />
      </div>

      <main className="relative z-10">

        <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="max-w-5xl mx-auto text-center space-y-10">

            <Link
              href="/business"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
                ¿Tienes un venue?
              </span>
              <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">
                Usa Vouncer
              </span>
            </Link>

            <div className="py-2">
              <LayoutTextFlip
                text="Entradas al momento para"
                words={["Theatron", "Kaputt", "Baum", "Octava", "Video Club", "Clandestino"]}
              />
            </div>

            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
              La plataforma oficial de los mejores eventos de Bogotá. <br className="hidden md:block" />
              Sin filas, sin efectivo, directo a la fiesta.
            </p>

            <div className="pt-6">
              <a href="#eventos" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-base transition-transform hover:scale-[1.02]">
                Ver Próximas Fiestas
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>

        <section id="eventos" className="py-24 px-6 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Cartelera Semanal</h2>
                <p className="text-zinc-400">Eventos verificados y disponibles ahora.</p>
              </div>
            </div>

            <Suspense fallback={<EventsGridSkeleton />}>
              <EventsList />
            </Suspense>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 relative z-10 text-center text-zinc-600 text-sm">
        <p>&copy; 2026 Vouncer Inc. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
