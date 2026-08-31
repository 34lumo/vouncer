import Link from 'next/link'
import { EncryptedText } from '@/components/ui/encrypted-text'
import { NoiseBackground } from '@/components/ui/noise-background'
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards'

export default function BusinessLandingPage() {
    const businessFeatures = [
        {
            name: "Sincronización Cloud",
            title: "Tiempo Real",
            quote: "Base de datos en vivo. Si vendes una entrada, el aforo se actualiza instantáneamente en todos los dispositivos.",
        },
        {
            name: "Entradas QR Únicas",
            title: "Seguridad",
            quote: "Cada ticket genera un código único vinculado al usuario. Imposible de falsificar con capturas o fotocopias.",
        },
        {
            name: "Gestión de Aforo",
            title: "Stock Automático",
            quote: "El sistema bloquea las ventas automáticamente cuando se alcanza la capacidad máxima de la sala.",
        },
        {
            name: "Panel de Control",
            title: "Gestión Total",
            quote: "Sube carteles en HD, modifica precios y gestiona fechas desde tu dashboard de administrador.",
        },
        {
            name: "Digital First",
            title: "Sin Papel",
            quote: "Experiencia 100% móvil. Tus clientes compran en la web y entran enseñando su teléfono.",
        },
    ]

    const features = [
        { title: "Control Total", desc: "Gestiona aforo, listas y staff desde tu panel de mando centralizado." },
        { title: "Acceso Veloz", desc: "Escanea 1,000 entradas en 10 minutos. Sin colas, sin errores humanos." },
        { title: "Ingresos en Vivo", desc: "Datos financieros y reportes automáticos al instante." },
    ]

    return (
        <div className="relative bg-black text-white">
            <div className="fixed inset-0 -z-10">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{ backgroundImage: 'url(/background.png)' }}
                />
                <div className="absolute inset-0 bg-black/80" />
            </div>

            <section className="relative min-h-screen flex items-center justify-center">
                <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
                    <h1 className="mb-6">
                        <EncryptedText
                            text="El Sistema Operativo de la Noche"
                            encryptedClassName="text-zinc-500"
                            revealedClassName="text-white font-bold text-3xl md:text-6xl tracking-tight"
                            revealDelayMs={50}
                        />
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Controla el aforo, evita el fraude y maximiza tus ingresos con infraestructura de ticketing en tiempo real.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <NoiseBackground
                            containerClassName="w-fit p-1 rounded-full"
                            gradientColors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                        >
                            <Link
                                href="/business/demo"
                                className="block rounded-full bg-black px-8 py-3 text-white font-medium hover:bg-zinc-900 transition-colors"
                            >
                                Reservar Demo &rarr;
                            </Link>
                        </NoiseBackground>

                        <Link
                            href="/login"
                            className="border border-white/15 text-white font-medium px-8 py-3 rounded-full hover:bg-white/5 transition-colors"
                        >
                            Acceso Clientes
                        </Link>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 border-t border-white/[0.06]">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Diseñado para Escalar</h2>
                        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                            Todo lo que necesitas para operar un venue profesional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <div key={f.title} className="border border-white/[0.06] rounded-xl p-8 bg-zinc-900/30 hover:border-white/[0.12] transition-colors">
                                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative py-24 border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Tecnología Empresarial</h2>
                        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                            Características diseñadas para la industria nocturna.
                        </p>
                    </div>

                    <div className="h-[28rem] rounded-md flex flex-col items-center justify-center relative overflow-hidden">
                        <InfiniteMovingCards
                            items={businessFeatures}
                            direction="right"
                            speed="slow"
                        />
                    </div>
                </div>
            </section>

            <section className="py-24 border-t border-white/[0.06]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        ¿Listo para modernizar tu venue?
                    </h2>
                    <p className="text-lg text-zinc-400 mb-8">
                        Únete a los venues que ya usan Vouncer.
                    </p>

                    <NoiseBackground
                        containerClassName="w-fit p-1 rounded-full mx-auto"
                        gradientColors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                    >
                        <Link
                            href="/business/demo"
                            className="block rounded-full bg-black px-8 py-3 text-white font-medium hover:bg-zinc-900 transition-colors"
                        >
                            Reservar Demo &rarr;
                        </Link>
                    </NoiseBackground>
                </div>
            </section>
        </div>
    )
}
