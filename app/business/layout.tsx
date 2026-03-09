import Link from 'next/link'
import Image from 'next/image'

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Business Navbar - Fixed with proper z-index */}
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo - Far Left */}
                    <Link href="/business" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Vouncer"
                            width={120}
                            height={40}
                            className="h-8 w-auto"
                        />
                    </Link>

                    {/* Center Navigation - Hidden on mobile, shown on desktop */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/business#features"
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Producto
                        </Link>
                        <Link
                            href="/business#security"
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Seguridad
                        </Link>
                        <Link
                            href="/business/about"
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            Nosotros
                        </Link>
                    </nav>

                    {/* Right CTAs */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2"
                        >
                            Acceso
                        </Link>
                        <Link
                            href="/business/demo"
                            className="text-sm bg-white text-black font-semibold px-5 py-2 rounded-lg hover:bg-zinc-200 transition-all"
                        >
                            Reservar Demo
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-zinc-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="mb-3">
                                <Image
                                    src="/logo.png"
                                    alt="Vouncer"
                                    width={120}
                                    height={40}
                                    className="h-8 w-auto"
                                />
                            </div>
                            <p className="text-zinc-400 text-sm max-w-md">
                                El sistema operativo de la noche. Ticketing seguro, analítica en tiempo real y prevención de fraude para venues modernos.
                            </p>
                        </div>

                        {/* Producto */}
                        <div>
                            <h4 className="font-semibold mb-3 text-sm">Producto</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li>
                                    <Link href="/business#features" className="hover:text-white transition-colors">
                                        Características
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/business/demo" className="hover:text-white transition-colors">
                                        Solicitar Demo
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="hover:text-white transition-colors">
                                        Acceso Clientes
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Empresa */}
                        <div>
                            <h4 className="font-semibold mb-3 text-sm">Empresa</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li>
                                    <Link href="/business/about" className="hover:text-white transition-colors">
                                        Nosotros
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
                        <p>© 2026 Vouncer. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-white transition-colors">
                                Privacidad
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                Términos
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
