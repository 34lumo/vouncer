import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Verificamos si hay sesión activa
  const { data: { user }, error } = await supabase.auth.getUser()

  // Si NO hay usuario logueado, patada al Login
  if (error || !user) {
    redirect('/login')
  }

  // Si hay usuario, le dejamos pasar a la página que quería (el escáner)
  return <>{children}</>
}