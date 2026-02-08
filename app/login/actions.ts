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

  // SI FUNCIONA: Entramos al escáner
  revalidatePath('/', 'layout')
  redirect('/admin/scan')
}