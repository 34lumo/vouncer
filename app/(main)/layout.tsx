import { Navbar } from "@/components/ui/navbar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Navbar for Main App (B2C/Admin) */}
            <Navbar />

            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
