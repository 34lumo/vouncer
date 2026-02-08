"use client"

import { useState } from "react"
import { purchaseTickets } from '@/app/actions'
import { ArrowRight, CreditCard, Lock, Mail, ShieldCheck, Ticket, AlertCircle } from "lucide-react"

// NOTA: Exportación nombrada (sin 'default')
export function CheckoutForm({ event }: { event: any }) {
  const [quantity, setQuantity] = useState(1)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Protección contra datos nulos
  if (!event) return <div className="text-red-500">Error: Datos del evento no disponibles.</div>

  const ticketPrice = event.price || 0
  const total = ticketPrice * quantity

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !event.id) return
    setErrorMessage('')

    try {
      setIsSubmitting(true)
      await purchaseTickets(event.id, email, quantity)
    } catch (error) {
      console.error(error)
      const msg = error instanceof Error ? error.message : 'Hubo un problema al procesar tu compra.'
      setErrorMessage(msg)
      setIsSubmitting(false)
    }
  }

  const venueName = event.venues?.name || 'Ubicación Secreta'
  const venueCity = event.venues?.city || 'Bogotá'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
      {/* Columna Izquierda (Resumen) */}
      <div className="space-y-6 order-2 lg:order-1">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px] -z-10" />
          
          <div className="flex items-start justify-between mb-8">
            <div>
               <p className="text-xs font-medium text-sky-400 uppercase tracking-widest mb-2">Resumen de compra</p>
               <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{event.title}</h2>
               <p className="text-zinc-400 text-sm mt-1">{venueName}, {venueCity}</p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                <Ticket className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="space-y-4 border-b border-white/10 pb-8 mb-8">
            <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                <span>Entrada General Garantizada</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Entrada ({formatPrice(ticketPrice)} x {quantity})</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="h-px bg-white/10 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Total a pagar</span>
              <span className="text-3xl font-bold text-white tracking-tight">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha (Formulario) */}
      <div className="relative order-1 lg:order-2">
        <form onSubmit={handleSubmit} className="space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-black text-xs flex items-center justify-center font-bold">1</span>
                    Selecciona cantidad
                </h3>
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 text-white flex items-center justify-center">-</button>
                    <input type="number" readOnly value={quantity} className="w-20 h-12 bg-black border border-white/20 rounded-xl text-center text-white font-bold text-lg focus:outline-none" />
                    <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 text-white flex items-center justify-center">+</button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-black text-xs flex items-center justify-center font-bold">2</span>
                    Tus Datos
                </h3>
                <div className="space-y-3">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="donde.te.envio.el.qr@gmail.com" 
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition outline-none"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-black text-xs flex items-center justify-center font-bold">3</span>
                    Pago Seguro
                </h3>
                <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-4 opacity-80">
                    <div className="flex items-center gap-3">
                         <CreditCard className="w-4 h-4 text-zinc-500" />
                         <span className="text-zinc-500 text-sm">Tarjeta Crédito / Débito</span>
                    </div>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="group w-full relative overflow-hidden rounded-full bg-white py-4 px-8 text-black font-bold text-lg transition-all hover:scale-[1.02] disabled:opacity-70"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? 'Procesando...' : `Pagar ${formatPrice(total)}`}
                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </span>
            </button>
        </form>
      </div>
    </div>
  )
}