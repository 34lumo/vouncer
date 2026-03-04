import { createClient } from '@supabase/supabase-js'

// Cookie-free client for public read-only queries.
// Does NOT call cookies(), so Next.js ISR (revalidate) works correctly.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
