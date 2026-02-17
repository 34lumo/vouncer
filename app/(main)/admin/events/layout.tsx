import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminEventsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        redirect('/login')
    }

    // Fetch user profile with role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        redirect('/login')
    }

    const role = profile.role || 'user'

    // Bouncers cannot access event management
    if (role === 'bouncer') {
        redirect('/admin')
    }

    // Regular users cannot access admin area
    if (role !== 'admin' && role !== 'owner') {
        redirect('/')
    }

    return <>{children}</>
}
