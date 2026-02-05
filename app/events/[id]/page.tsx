import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*, venues(*)')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  const venue = event.venues as { name: string; city: string } | null
  const eventDate = event.event_date ? new Date(event.event_date) : null
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : 'Fecha no disponible'

  const formatPrice = (price: number | string | null) => {
    if (!price) return null
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return null
    return `$${Math.round(numPrice).toLocaleString('es-CO')}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8">{event.title}</h1>

        {/* Info Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Fecha</p>
              <p className="text-xl">{formattedDate}</p>
            </div>

            {venue && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Lugar</p>
                <p className="text-xl text-violet-400">
                  {venue.name} - {venue.city}
                </p>
              </div>
            )}

            {event.price && formatPrice(event.price) && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Precio</p>
                <p className="text-3xl font-bold">{formatPrice(event.price)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-0 bg-black border-t border-gray-800 py-6">
          <Link
            href={`/checkout/${id}`}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-colors block text-center"
          >
            Continuar Compra
          </Link>
        </div>
      </div>
    </div>
  )
}
