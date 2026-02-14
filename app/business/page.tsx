import Link from 'next/link'
import { EncryptedText } from '@/components/ui/encrypted-text'
import { NoiseBackground } from '@/components/ui/noise-background'
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'

export default function BusinessLandingPage() {
    // Real implemented features of Vouncer
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

    return (
        <div className="relative bg-black text-white">
            {/* Fixed Background Image with Overlay */}
            <div className="fixed inset-0 -z-10">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url(/background.png)' }}
                />
                <div className="absolute inset-0 bg-black/80" />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Additional gradient effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
                    <h1 className="mb-6">
                        <EncryptedText
                            text="El Sistema Operativo de la Noche"
                            encryptedClassName="text-zinc-500"
                            revealedClassName="text-white font-bold text-4xl md:text-7xl tracking-tight"
                            revealDelayMs={50}
                        />
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Controla el aforo, evita el fraude y maximiza tus ingresos con infraestructura de ticketing en tiempo real diseñada para venues modernos.
                    </p>

                    {/* CTA with NoiseBackground */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <NoiseBackground
                            containerClassName="w-fit p-1 rounded-full"
                            gradientColors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                        >
                            <Link
                                href="/business/demo"
                                className="block rounded-full bg-black px-8 py-3 text-white font-medium hover:bg-zinc-900 transition-all"
                            >
                                Reservar Demo &rarr;
                            </Link>
                        </NoiseBackground>

                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/5 transition-all"
                        >
                            Acceso Clientes
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3D Product Cards Section */}
            <section id="features" className="py-24 border-t border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Diseñado para Escalar</h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Todo lo que necesitas para operar un venue profesional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 - Control Total */}
                        <CardContainer className="inter-var">
                            <CardBody className="bg-zinc-950 relative group/card dark:hover:shadow-2xl dark:hover:shadow-sky-500/[0.1] dark:bg-zinc-950 dark:border-white/[0.2] border-white/[0.1] w-auto sm:w-[30rem] rounded-xl p-10 border">
                                <CardItem
                                    translateZ="50"
                                    className="text-3xl font-bold text-white mb-4"
                                >
                                    Control Total
                                </CardItem>
                                <CardItem
                                    as="p"
                                    translateZ="60"
                                    className="text-zinc-400 text-base leading-relaxed"
                                >
                                    Gestiona aforo, listas y staff desde tu panel de mando centralizado. Todo bajo control en un solo clic.
                                </CardItem>
                            </CardBody>
                        </CardContainer>

                        {/* Card 2 - Acceso Veloz */}
                        <CardContainer className="inter-var">
                            <CardBody className="bg-zinc-950 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-zinc-950 dark:border-white/[0.2] border-white/[0.1] w-auto sm:w-[30rem] rounded-xl p-10 border">
                                <CardItem
                                    translateZ="50"
                                    className="text-3xl font-bold text-white mb-4"
                                >
                                    Acceso Veloz
                                </CardItem>
                                <CardItem
                                    as="p"
                                    translateZ="60"
                                    className="text-zinc-400 text-base leading-relaxed"
                                >
                                    Escanea 1,000 entradas en 10 minutos. Tecnología optimizada para eliminar colas y errores humanos.
                                </CardItem>
                            </CardBody>
                        </CardContainer>

                        {/* Card 3 - Ingresos en Vivo */}
                        <CardContainer className="inter-var">
                            <CardBody className="bg-zinc-950 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-zinc-950 dark:border-white/[0.2] border-white/[0.1] w-auto sm:w-[30rem] rounded-xl p-10 border">
                                <CardItem
                                    translateZ="50"
                                    className="text-3xl font-bold text-white mb-4"
                                >
                                    Ingresos en Vivo
                                </CardItem>
                                <CardItem
                                    as="p"
                                    translateZ="60"
                                    className="text-zinc-400 text-base leading-relaxed"
                                >
                                    Mira cómo crece la caja en tiempo real. Datos financieros y reportes automáticos al instante.
                                </CardItem>
                            </CardBody>
                        </CardContainer>
                    </div>
                </div>
            </section>

            {/* Value Propositions - Moving Cards */}
            <section id="security" className="relative py-24 border-t border-white/10">
                {/* Background Image with 50% opacity */}
                <div className="absolute inset-0 -z-10">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                        style={{ backgroundImage: 'url(/background.png)' }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Tecnología Empresarial</h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Características diseñadas para la realidad de la industria nocturna.
                        </p>
                    </div>

                    <div className="h-[30rem] rounded-md flex flex-col antialiased bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                        <InfiniteMovingCards
                            items={businessFeatures}
                            direction="right"
                            speed="slow"
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 border-t border-white/10 bg-black/60 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        ¿Listo para modernizar tu venue?
                    </h2>
                    <p className="text-xl text-zinc-400 mb-8">
                        Únete a los venues que ya usan Vouncer para optimizar operaciones y aumentar ingresos.
                    </p>

                    <NoiseBackground
                        containerClassName="w-fit p-1 rounded-full mx-auto"
                        gradientColors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                    >
                        <Link
                            href="/business/demo"
                            className="block rounded-full bg-black px-8 py-3 text-white font-medium hover:bg-zinc-900 transition-all"
                        >
                            Reservar Demo &rarr;
                        </Link>
                    </NoiseBackground>
                </div>
            </section>
        </div>
    )
}
