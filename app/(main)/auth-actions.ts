"use server"

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOutAction() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error signing out:', error)
        return { error: error.message }
    }

    // Redirect to business landing page after logout
    redirect('/business')
}
