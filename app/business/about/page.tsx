import Link from 'next/link'
import { ArrowRight, Target, Users2, Lightbulb } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="bg-black text-white">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Sobre Vouncer
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed">
                        Construimos la infraestructura que impulsa el futuro de la vida nocturna.
                    </p>
                </div>
            </section>

            {/* Misión */}
            <section className="py-24 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Target className="w-6 h-6 text-sky-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestra Misión</h2>
                            <p className="text-xl text-zinc-400 leading-relaxed">
                                Digitalizar la vida nocturna de forma segura y transparente, dotando a los venues de las herramientas necesarias para operar con eficiencia y ofrecer experiencias excepcionales a sus clientes.
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 md:p-12">
                        <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                            La industria nocturna lleva demasiado tiempo operando con tecnología obsoleta. Las entradas en papel, las transacciones en efectivo y el control manual del aforo generan fricciones, facilitan el fraude y limitan el crecimiento.
                        </p>
                        <p className="text-lg text-zinc-300 leading-relaxed">
                            Los propietarios de venues merecen algo mejor. Vouncer ofrece infraestructura de nivel empresarial, fácil de usar, segura por defecto y diseñada específicamente para los retos únicos de la gestión nocturna.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quiénes Somos */}
            <section className="py-24 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quiénes Somos</h2>
                            <p className="text-xl text-zinc-400 leading-relaxed">
                                Un equipo de operadores de venues y expertos en tecnología que entienden ambos lados del negocio.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-1">Alejandro Piñeres</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Hemos trabajado en venues, gestionado eventos y vivido de primera mano los retos operativos que quitan el sueño a los propietarios.
                            </p>
                        </div>

                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-1">Luis Molina</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Nuestro equipo de ingeniería ha construido sistemas para millones de usuarios a escala, llevando la fiabilidad empresarial a la vida nocturna.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Valores</h2>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="border-l-2 border-sky-500 pl-6">
                            <h3 className="text-xl font-bold mb-2">Seguridad ante Todo</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Cada línea de código se escribe pensando en la seguridad. Tus datos y los de tus clientes son sagrados.
                            </p>
                        </div>

                        <div className="border-l-2 border-emerald-500 pl-6">
                            <h3 className="text-xl font-bold mb-2">Transparencia Total</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Sin tarifas ocultas, sin sorpresas. Siempre sabrás exactamente por qué y cuánto estás pagando.
                            </p>
                        </div>

                        <div className="border-l-2 border-purple-500 pl-6">
                            <h3 className="text-xl font-bold mb-2">Soporte Obsesivo</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Cuando tienes un evento, estamos disponibles. Personas reales, soporte en tiempo real, siempre.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-white/10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Construyamos el futuro juntos
                    </h2>
                    <p className="text-xl text-zinc-400 mb-8">
                        Descubre cómo Vouncer puede transformar las operaciones de tu venue.
                    </p>
                    <Link
                        href="/business/demo"
                        className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-zinc-200 transition-all text-lg"
                    >
                        Reservar Demo
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
