export function EventCardSkeleton() {
    return (
        <div className="group relative flex flex-col bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden">
            {/* Poster Skeleton */}
            <div className="h-64 bg-zinc-800/50 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 animate-pulse" />

                {/* Date Badge Skeleton */}
                <div className="absolute top-5 left-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 min-w-[64px] z-10">
                    <div className="h-6 w-8 bg-zinc-700/50 rounded animate-pulse mb-1" />
                    <div className="h-3 w-8 bg-zinc-700/50 rounded animate-pulse" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-8 flex flex-col flex-grow">
                {/* Title Skeleton */}
                <div className="mb-3 space-y-2">
                    <div className="h-6 bg-zinc-800/50 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-6 bg-zinc-800/50 rounded-lg w-1/2 animate-pulse" />
                </div>

                {/* Metadata Skeleton */}
                <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-zinc-700/50 rounded animate-pulse" />
                        <div className="h-4 bg-zinc-800/50 rounded w-2/3 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-zinc-700/50 rounded animate-pulse" />
                        <div className="h-4 bg-zinc-800/50 rounded w-1/3 animate-pulse" />
                    </div>
                </div>

                {/* Price Section Skeleton */}
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <div className="h-3 bg-zinc-800/50 rounded w-16 mb-2 animate-pulse" />
                        <div className="h-6 bg-zinc-800/50 rounded w-20 animate-pulse" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 animate-pulse" />
                </div>
            </div>
        </div>
    )
}
