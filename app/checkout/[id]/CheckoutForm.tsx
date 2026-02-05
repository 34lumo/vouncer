'use client'

import { useState } from 'react'
import { purchaseTickets } from '@/app/actions'

interface CheckoutFormProps {
  unitPrice: number
  eventId: string
}

export default function CheckoutForm({ unitPrice, eventId }: CheckoutFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = Math.round(unitPrice * quantity)

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !eventId) return

    try {
      setIsSubmitting(true)
      await purchaseTickets(eventId, email, quantity)
      // La navegación será manejada por la redirección en la Server Action
    } catch (error) {
      console.error(error)
      alert(
        error instanceof Error
          ? error.message
          : 'Hubo un problema al procesar tu compra. Inténtalo de nuevo.'
      )
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Completa tu compra</h2>

      {/* Input Cantidad */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium mb-2">
          Cantidad
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
          required
        />
      </div>

      {/* Input Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Tu Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="donde.te.envio.el.qr@gmail.com"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          required
        />
        <p className="text-xs text-gray-400 mt-2">
          Te enviaremos el código QR a este correo. Asegúrate de que está bien
          escrito.
        </p>
      </div>

      {/* Total */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">Total a Pagar</span>
          <span className="text-2xl font-bold">{formatPrice(total)} COP</span>
        </div>
      </div>

      {/* Botón Final */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-8 rounded-lg transition-colors"
      >
        {isSubmitting ? 'Procesando compra...' : `Pagar ${formatPrice(total)} COP`}
      </button>
    </form>
  )
}
