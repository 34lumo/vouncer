import { Suspense } from "react"
import { Navbar } from "@/components/ui/navbar"
import { NavbarSkeleton } from "@/components/ui/navbar-skeleton"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            {/*
             * Navbar is an async Server Component that calls supabase.auth.getUser().
             * Wrapping it in Suspense lets Next.js stream the page shell instantly
             * while the auth check resolves in the background.
             */}
            <Suspense fallback={<NavbarSkeleton />}>
                <Navbar />
            </Suspense>

            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
