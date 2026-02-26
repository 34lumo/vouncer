export function NavbarSkeleton() {
    return (
        <nav
            aria-hidden="true"
            className="sticky top-0 z-50 w-full h-24 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md border-b border-white/10"
        >
            {/* Logo placeholder — centred, matching the real Navbar layout */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-[140px] h-[45px] rounded-lg bg-white/5 animate-pulse" />
            </div>
        </nav>
    )
}
