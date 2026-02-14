import { EventCardSkeleton } from './event-card-skeleton'

export function EventsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
            ))}
        </div>
    )
}
