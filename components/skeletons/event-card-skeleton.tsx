export function EventCardSkeleton() {
    return (
        <div className="flex flex-col bg-zinc-900/60 border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="h-56 bg-zinc-800/50 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 animate-pulse" />
                <div className="absolute top-4 left-4 bg-black/40 border border-white/10 rounded-xl p-2.5 min-w-[56px]">
                    <div className="h-5 w-7 bg-zinc-700/50 rounded animate-pulse mb-0.5" />
                    <div className="h-2.5 w-7 bg-zinc-700/50 rounded animate-pulse" />
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3 space-y-2">
                    <div className="h-5 bg-zinc-800/50 rounded w-3/4 animate-pulse" />
                    <div className="h-5 bg-zinc-800/50 rounded w-1/2 animate-pulse" />
                </div>
                <div className="flex flex-col gap-1.5 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 bg-zinc-700/50 rounded animate-pulse" />
                        <div className="h-3.5 bg-zinc-800/50 rounded w-2/3 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 bg-zinc-700/50 rounded animate-pulse" />
                        <div className="h-3.5 bg-zinc-800/50 rounded w-1/3 animate-pulse" />
                    </div>
                </div>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <div className="h-2.5 bg-zinc-800/50 rounded w-14 mb-1.5 animate-pulse" />
                        <div className="h-5 bg-zinc-800/50 rounded w-20 animate-pulse" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 animate-pulse" />
                </div>
            </div>
        </div>
    )
}
