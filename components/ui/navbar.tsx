import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { UserNav } from '@/components/admin/user-nav'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-6 bg-black/70 backdrop-blur-md border-b border-white/[0.06]">
      <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/logo.png"
          alt="Vouncer"
          width={120}
          height={40}
          priority
          className="object-contain"
        />
      </Link>

      {user && (
        <div className="flex items-center gap-4 ml-auto">
          <UserNav email={user.email || 'user@vouncer.com'} />
        </div>
      )}
    </nav>
  )
}
