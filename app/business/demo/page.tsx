'use client'

import { useState } from 'react'
import { Building2, Mail, Phone, User, CheckCircle2 } from 'lucide-react'
import { submitDemoRequest } from '@/app/actions'

export default function DemoPage() {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await submitDemoRequest({
                name: formData.get('name') as string,
                clubName: formData.get('club_name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
            })

            if (result.success) {
                setSubmitted(true)
                // Reset form after 3 seconds
                setTimeout(() => {
                    setSubmitted(false)
                        ; (e.target as HTMLFormElement).reset()
                }, 3000)
            } else {
                setError(result.message)
            }
        } catch (err) {
            setError('Error al enviar la solicitud. Por favor, inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative bg-black text-white min-h-[calc(100vh-4rem)]">
            {/* Fixed Background */}
            <div className="fixed inset-0 -z-10">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url(/background.png)' }}
                />
                <div className="absolute inset-0 bg-black/85" />
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Vouncer en Acción
                    </h1>
                    <p className="text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                        Reserva una demo personalizada y descubre cómo Vouncer puede transformar las operaciones de tu venue.
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-2xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        {/* Left: Benefits */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6">Qué obtendrás:</h2>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Demostración Personalizada</h3>
                                    <p className="text-sm text-zinc-400">
                                        Demo en vivo de 30 minutos adaptada a las necesidades específicas de tu venue.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Análisis de ROI</h3>
                                    <p className="text-sm text-zinc-400">
                                        Ve exactamente cuánto tiempo y dinero ahorrarás con Vouncer.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Plan de Implementación</h3>
                                    <p className="text-sm text-zinc-400">
                                        Obtén una hoja de ruta para implementar Vouncer en tu venue.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold mb-1">Sin Compromiso</h3>
                                    <p className="text-sm text-zinc-400">
                                        Solo una conversación. Sin presión, sin discurso de ventas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">¡Solicitud Recibida!</h3>
                                    <p className="text-zinc-400">
                                        Nos pondremos en contacto en menos de 24 horas para agendar tu demo.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <p className="text-red-400 text-sm">{error}</p>
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                                <User className="w-4 h-4 text-zinc-400" />
                                                Tu Nombre
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="Juan Pérez"
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="club_name" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-zinc-400" />
                                                Nombre del Venue
                                            </label>
                                            <input
                                                type="text"
                                                id="club_name"
                                                name="club_name"
                                                required
                                                placeholder="Tu Venue"
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-zinc-400" />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                placeholder="juan@venue.com"
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-zinc-400" />
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                placeholder="+57 300 123 4567"
                                                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                'Solicitar Demo'
                                            )}
                                        </button>

                                        <p className="text-xs text-zinc-500 text-center">
                                            Al enviar, aceptas recibir comunicaciones de Vouncer.
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold mb-1">24h</div>
                            <div className="text-sm text-zinc-400">Tiempo de Respuesta</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold mb-1">30min</div>
                            <div className="text-sm text-zinc-400">Duración del Demo</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold mb-1">100%</div>
                            <div className="text-sm text-zinc-400">Sin Obligación</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
