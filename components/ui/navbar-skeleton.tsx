export function NavbarSkeleton() {
    return (
        <nav
            aria-hidden="true"
            className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-6 bg-black/70 backdrop-blur-md border-b border-white/[0.06]"
        >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-[120px] h-[40px] rounded bg-white/5 animate-pulse" />
            </div>
        </nav>
    )
}
