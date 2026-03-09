import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Calendar, Scan, Building2 } from 'lucide-react'

export default async function AdminHub() {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        redirect('/login')
    }

    // Fetch user profile with role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        redirect('/login')
    }

    const role = profile.role || 'user'
    const isAdmin = role === 'admin' || role === 'owner'
    const isBouncer = role === 'bouncer'

    // Regular users shouldn't access admin area
    if (!isAdmin && !isBouncer) {
        redirect('/')
    }

    // Note: Bouncers are redirected to /admin/scan directly from login action
    // If a bouncer somehow reaches this page, just show them the scanner card

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">
                        Bienvenido, {profile.full_name || 'Usuario'}
                    </h1>
                    <p className="text-zinc-400">
                        {isAdmin ? 'Panel de Administración' : 'Panel de Control'}
                    </p>
                </div>

                {/* Admin/Owner Dashboard */}
                {isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Gestión de Eventos */}
                        <Link
                            href="/admin/events"
                            className="group relative bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-sky-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/20"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                                    <Calendar className="w-8 h-8 text-sky-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Gestión de Eventos</h3>
                                    <p className="text-sm text-zinc-400">
                                        Crear, editar y administrar eventos
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Analytics */}
                        <Link
                            href="/business"
                            className="group relative bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                    <BarChart3 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Analíticas</h3>
                                    <p className="text-sm text-zinc-400">
                                        Métricas y estadísticas del negocio
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Escáner */}
                        <Link
                            href="/admin/scan"
                            className="group relative bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/20"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                                    <Scan className="w-8 h-8 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Escáner</h3>
                                    <p className="text-sm text-zinc-400">
                                        Validar entradas en la puerta
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Bouncer Dashboard - Single Large Card */}
                {isBouncer && (
                    <div className="max-w-md mx-auto">
                        <Link
                            href="/admin/scan"
                            className="group relative bg-gradient-to-br from-violet-900/50 to-purple-900/50 backdrop-blur-xl border border-violet-500/30 rounded-3xl p-12 hover:border-violet-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/30 block"
                        >
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-24 h-24 bg-violet-500/20 rounded-3xl flex items-center justify-center group-hover:bg-violet-500/30 transition-colors group-hover:scale-110 duration-300">
                                    <Scan className="w-12 h-12 text-violet-300" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-3">Abrir Escáner</h2>
                                    <p className="text-zinc-300">
                                        Toca para validar entradas
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Info Card */}
                        <div className="mt-6 bg-zinc-900/30 border border-white/5 rounded-xl p-4 text-center">
                            <p className="text-sm text-zinc-400">
                                Rol: <span className="text-violet-400 font-semibold">Portero</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
