export default function LoadingEvents() {
    return (
        <div className="min-h-screen bg-black text-white p-6 pt-32">
            <div className="max-w-6xl mx-auto">

                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="space-y-3">
                        <div className="h-8 w-64 bg-zinc-800 rounded-lg animate-pulse" />
                        <div className="h-4 w-48 bg-zinc-800/60 rounded animate-pulse" />
                    </div>

                    {/* Create Event Button Skeleton */}
                    <div className="h-12 w-40 bg-zinc-800 rounded-xl animate-pulse" />
                </div>

                {/* Event Cards Grid Skeleton */}
                <div className="grid gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Image Skeleton */}
                                <div className="relative w-full md:w-64 h-48 md:h-auto bg-zinc-800 flex-shrink-0 animate-pulse" />

                                {/* Event Details Skeleton */}
                                <div className="flex-1 p-6 flex flex-col">
                                    {/* Title and Status Row */}
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex-1 space-y-3">
                                            {/* Title */}
                                            <div className="h-6 w-3/4 bg-zinc-800 rounded animate-pulse" />
                                            {/* Description */}
                                            <div className="space-y-2">
                                                <div className="h-4 w-full bg-zinc-800/60 rounded animate-pulse" />
                                                <div className="h-4 w-5/6 bg-zinc-800/60 rounded animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Action Buttons Skeleton */}
                                        <div className="flex gap-2">
                                            {/* Edit Button */}
                                            <div className="w-12 h-12 bg-zinc-800 rounded-xl animate-pulse" />
                                            {/* Delete Button */}
                                            <div className="w-12 h-12 bg-zinc-800 rounded-xl animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Info Grid Skeleton */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {/* Date */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 w-12 bg-zinc-800/60 rounded animate-pulse" />
                                                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                                                <div className="h-3 w-16 bg-zinc-800/60 rounded animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Venue */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 w-12 bg-zinc-800/60 rounded animate-pulse" />
                                                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                                                <div className="h-3 w-24 bg-zinc-800/60 rounded animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 w-10 bg-zinc-800/60 rounded animate-pulse" />
                                                <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Tickets */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 w-12 bg-zinc-800/60 rounded animate-pulse" />
                                                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Skeleton */}
                                    <div className="mt-4 space-y-2">
                                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full w-1/3 bg-zinc-700 animate-pulse" />
                                        </div>
                                        <div className="h-3 w-24 bg-zinc-800/60 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
