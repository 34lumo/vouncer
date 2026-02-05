import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: events, error } = await supabase
    .from('events')
    .select('*, venues(name, city)')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          El control total de tu evento
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8">
          Compra entradas en segundos. Sin registros.
        </p>
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
          Ver Fiestas
        </button>
      </section>

      {/* Grid de Eventos */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {error ? (
          <div className="text-center text-red-400">
            <p>Error al cargar eventos: {error.message}</p>
          </div>
        ) : !events || events.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No hay eventos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
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
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors block"
                >
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  {venue && (
                    <p className="text-violet-400 mb-1">
                      {venue.name} - {venue.city}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mb-2">{formattedDate}</p>
                  {event.price && formatPrice(event.price) && (
                    <p className="text-white font-bold text-lg">
                      {formatPrice(event.price)}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
