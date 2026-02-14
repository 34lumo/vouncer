'use client'

import { useState } from 'react'
import QRCode from 'react-qr-code'

type Ticket = {
  id: string
  qr_token: string | null
  event: {
    title: string
    venues: {
      name: string
      city: string
    } | null
  } | null
}

interface TicketsRevealProps {
  tickets: Ticket[]
}

export function TicketsReveal({ tickets }: TicketsRevealProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!tickets || tickets.length === 0) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        🎫 Ver mis Entradas
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2">
        {tickets.map((ticket) => {
          const event = ticket.event
          const venue = event?.venues ?? null
          const qrValue = ticket.qr_token || ticket.id

          return (
            <div
              key={ticket.id}
              className="relative overflow-hidden rounded-2xl border border-violet-700/40 bg-gradient-to-br from-gray-900 via-gray-950 to-violet-950/40 p-5 flex flex-col gap-4"
            >
              {/* Top: info evento */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-violet-400 mb-1">
                    Entrada
                  </p>
                  <h3 className="text-lg font-semibold">
                    {event?.title ?? 'Evento'}
                  </h3>
                  {venue && (
                    <p className="text-sm text-gray-400">
                      {venue.name} · {venue.city}
                    </p>
                  )}
                </div>
              </div>

              {/* Centro: QR */}
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-xl shadow-md">
                  <QRCode value={qrValue} size={140} fgColor="#000000" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs text-gray-400 hover:text-gray-200 underline underline-offset-4"
        >
          Ocultar
        </button>
      </div>
    </div>
  )
}

