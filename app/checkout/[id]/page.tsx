import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import CheckoutForm from './CheckoutForm' // <--- Aquí importamos el formulario

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // 1. Desempaquetar params (necesario en Next.js moderno)
  const { id } = await params

  // 2. Conectar a BD
  const supabase = await createClient()

  // 3. Buscar el evento
  const { data: event } = await supabase
    .from('events')
    .select('*, venues(name, city)')
    .eq('id', id)
    .single()

  // Si no existe el evento, error 404
  if (!event) {
    notFound()
  }

  // 4. Renderizar la página con el formulario dentro
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: Resumen del Evento */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          
          {/* Datos de la Venue (seguro) */}
          {event.venues && (
             <p className="text-violet-400 text-lg mb-6">
               {/* @ts-ignore: Supabase join types a veces dan guerra */}
               {event.venues.name}, {event.venues.city}
             </p>
          )}

          <div className="border-t border-gray-800 pt-6 mt-6">
            <p className="text-gray-400 text-sm mb-1">Precio por entrada</p>
            <p className="text-2xl font-bold">
              ${event.price.toLocaleString('es-CO')} COP
            </p>
          </div>
          
          <div className="mt-8 p-4 bg-violet-900/20 rounded-lg border border-violet-500/30">
            <p className="text-sm text-violet-200">
              ⚡️ <strong>Compra rápida:</strong> No necesitas registrarte. 
              Tus entradas llegarán a tu correo inmediatamente.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: El Formulario Interactivo */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <CheckoutForm 
            eventId={event.id} 
            unitPrice={event.price} 
          />
        </div>

      </div>
    </div>
  )
}