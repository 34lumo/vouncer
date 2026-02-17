import { login } from './actions'
import Image from 'next/image'

// Añadimos props para poder leer la URL (searchParams)
export default async function LoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Leemos si hay error en la URL
  const searchParams = await props.searchParams
  const showError = searchParams?.error === 'true'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-[#111] border border-[#333] rounded-xl p-8 shadow-2xl">

        {/* Logo Centrado */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Vouncer"
            width={180}
            height={60}
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Acceso Vouncer
        </h2>

        {/* --- MENSAJE DE ERROR (Solo sale si la contraseña falló) --- */}
        {showError && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-center text-sm">
            🔒 Usuario o contraseña incorrectos
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-[#222] border border-[#444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              placeholder="admin@vouncer.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-[#222] border border-[#444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors mt-4"
          >
            Entrar al Club
          </button>
        </form>
      </div>
    </div>
  )
}