import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
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

    // Define allowed roles for admin area
    const allowedRoles = ['admin', 'owner', 'bouncer']

    // Only redirect if user is NOT authorized
    // Do NOT redirect bouncers to /admin/scan here - that causes loops
    if (!allowedRoles.includes(role)) {
        redirect('/login')
    }

    // If authorized, let them pass to whatever page they're accessing
    return <>{children}</>
}
