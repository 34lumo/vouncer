import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">

            {/* Ambient Background */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-zinc-500/10 blur-[100px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center">

                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-2xl" />
                        <SearchX className="w-24 h-24 text-sky-400 relative z-10" strokeWidth={1.5} />
                    </div>
                </div>

                {/* 404 Typography */}
                <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter mb-6 bg-gradient-to-r from-zinc-200 via-sky-100 to-white bg-clip-text text-transparent leading-none">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Parece que te has perdido en la fiesta
                </h2>

                <p className="text-zinc-400 text-lg mb-12 max-w-md mx-auto">
                    La página que buscas no existe o ha sido movida.
                </p>

                {/* Primary Action */}
                <Link
                    href="/"
                    className="inline-block bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-8"
                >
                    Volver al Inicio
                </Link>

                {/* Support Link */}
                <p className="text-zinc-500 text-sm">
                    ¿Crees que es un error?{' '}
                    <a
                        href="mailto:soporte@vouncer.com"
                        className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-4 transition-colors"
                    >
                        Contáctanos en soporte@vouncer.com
                    </a>
                </p>
            </div>
        </div>
    )
}
