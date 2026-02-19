'use client'

import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { validateTicket } from '@/app/actions'

type ValidateSuccess = {
  success: true
  message: string
  data: {
    eventTitle: string | null
    email: string | null
    ticketTypeName: string
    drinksIncluded: number
  }
}

type ValidateFailure = {
  success: false
  message: string
}

type ValidateResult = ValidateSuccess | ValidateFailure

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<ValidateResult | null>(null)

  const handleScan = async (codes: { rawValue: string }[]) => {
    if (!isScanning || isValidating) return
    if (!codes || codes.length === 0) return

    const qrValue = codes[0]?.rawValue
    if (!qrValue) return

    // Pausamos el escáner mientras validamos
    setIsScanning(false)
    setIsValidating(true)

    try {
      const validation = (await validateTicket(qrValue)) as ValidateResult
      setResult(validation)
    } catch (error) {
      console.error('Error validating ticket from scanner', error)
      setResult({
        success: false,
        message: 'Error al validar el ticket. Intenta de nuevo.',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setIsScanning(true)
  }

  const isSuccess = result?.success === true
  const isError = result && !result.success

  const overlayColor = isSuccess
    ? 'bg-green-600/95'
    : isError
      ? 'bg-red-700/95'
      : 'bg-black/80'

  const showOverlay = isValidating || !!result

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Escáner de Tickets</h1>
        <span className="text-xs text-gray-500">MVP · Sin login</span>
      </header>

      <main className="flex-1 relative flex flex-col">
        {/* Contenedor del vídeo / escáner */}
        <div className="flex-1 relative overflow-hidden">
          <Scanner
            onScan={handleScan}
            onError={(error) => {
              if (error) {
                console.error('Scanner error', error)
              }
            }}
            paused={!isScanning}
            styles={{
              container: {
                width: '100%',
                height: '100%',
                position: 'relative',
              },
              video: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            }}
          />

          {/* Overlay de resultado / validación */}
          {showOverlay && (
            <div className={`absolute inset-0 flex items-center justify-center ${overlayColor}`}>
              <div className="w-full max-w-sm px-5 text-center space-y-3">
                {isValidating && (
                  <>
                    <p className="text-sm uppercase tracking-[0.18em] text-gray-200">
                      Validando...
                    </p>
                    <p className="text-2xl font-bold">Espera un momento</p>
                  </>
                )}

                {!isValidating && result && (
                  <>
                    {/* ── STATUS HEADER ─────────────────────────── */}
                    <p className="text-sm uppercase tracking-[0.2em] text-white/80">
                      {isSuccess ? '✅ Ticket válido' : '❌ Acceso denegado'}
                    </p>
                    <p className="text-4xl font-black tracking-tight text-white">
                      {isSuccess ? 'ADELANTE' : 'DENEGADO'}
                    </p>

                    {/* ── SUCCESS DETAILS ───────────────────────── */}
                    {isSuccess && result.data && (
                      <div className="space-y-3 mt-2">

                        {/* Customer name */}
                        <p className="text-xl font-bold text-white">
                          {result.message}
                        </p>

                        {/* Event */}
                        {result.data.eventTitle && (
                          <p className="text-sm text-white/70">
                            {result.data.eventTitle}
                          </p>
                        )}

                        {/* ── TICKET TYPE — large & unmissable ─── */}
                        <div className="rounded-xl bg-white/15 border border-white/30 px-4 py-3">
                          <p className="text-xs uppercase tracking-widest text-white/60 mb-0.5">
                            🎫 Tipo de Entrada
                          </p>
                          <p className="text-3xl font-black text-white leading-tight">
                            {result.data.ticketTypeName.toUpperCase()}
                          </p>
                        </div>

                        {/* ── DRINKS — CRITICAL: solid colour, max size ── */}
                        {result.data.drinksIncluded > 0 ? (
                          <div className="rounded-xl bg-lime-400 px-4 py-4 shadow-[0_0_30px_rgba(163,230,53,0.6)]">
                            <p className="text-xs uppercase tracking-widest text-black/60 font-bold mb-1">
                              Incluye consumiciones
                            </p>
                            <p className="text-5xl font-black text-black leading-none">
                              🍹 ×{result.data.drinksIncluded}
                            </p>
                            <p className="text-lg font-bold text-black mt-1">
                              {result.data.drinksIncluded === 1
                                ? '1 CONSUMICIÓN'
                                : `${result.data.drinksIncluded} CONSUMICIONES`}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-white/50">
                            Sin consumición incluida
                          </p>
                        )}
                      </div>
                    )}

                    {/* ── FAILURE MESSAGE ───────────────────────── */}
                    {!isSuccess && (
                      <p className="text-xl font-semibold text-white/90 mt-2">
                        {result.message}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botón de reinicio */}
        <div className="p-4 border-t border-gray-800 bg-black/80">
          <button
            type="button"
            onClick={handleReset}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isValidating}
          >
            Escanear Siguiente
          </button>
        </div>
      </main>
    </div>
  )
}

