'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Recogemos los datos
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Intentamos entrar
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // SI FALLA: Redirigimos a la misma página con una "marca" de error
  if (error) {
    redirect('/login?error=true')
  }

  // SI FUNCIONA: Fetch user role and redirect accordingly
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Fetch user profile to get role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'user'

    // Direct redirect based on role (avoids layout conflicts)
    if (role === 'bouncer') {
      revalidatePath('/', 'layout')
      redirect('/admin/scan')  // Bouncers go directly to scanner
    } else if (role === 'admin' || role === 'owner') {
      revalidatePath('/', 'layout')
      redirect('/admin')  // Admins go to hub
    } else {
      revalidatePath('/', 'layout')
      redirect('/')  // Regular users go home
    }
  }

  // Fallback
  revalidatePath('/', 'layout')
  redirect('/admin')
}