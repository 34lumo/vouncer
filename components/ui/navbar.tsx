import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { UserNav } from '@/components/admin/user-nav'

export async function Navbar() {
  // Fetch current user session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full h-24 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md border-b border-white/10 transition-all duration-300 relative">

      {/* Logo - Centered */}
      <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
        {/* Aura de luz trasera (Glow Azul) */}
        <div className="absolute -inset-4 bg-sky-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Logo con Drop Shadow Neón */}
        <Image
          src="/logo.png"
          alt="Vouncer"
          width={140}
          height={45}
          priority
          className="object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all duration-500 group-hover:scale-105"
        />
      </Link>

      {/* User Profile - Right Side */}
      {user && (
        <div className="flex items-center gap-4 ml-auto">
          <UserNav email={user.email || 'user@vouncer.com'} />
        </div>
      )}
    </nav>
  )
}