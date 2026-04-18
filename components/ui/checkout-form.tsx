"use client"

import { useState, useCallback } from "react"
import { createWompiCheckout } from '@/app/actions'
import type { OrderMetadata, PlayerData } from '@/lib/wompi'
import {
  ArrowRight, Lock, Mail, ShieldCheck, Ticket, AlertCircle,
  User, ExternalLink, Users, Eye, Trophy, Hash,
} from "lucide-react"

// ── Constants ──────────────────────────────────────────────────────────────

const SPECTATOR_PRICE = 30_000   // COP
const TEAM_PRICE = 300_000        // COP
const MIN_PLAYERS = 3
const MAX_PLAYERS = 5

// ── Types ──────────────────────────────────────────────────────────────────

type TournamentMode = 'spectator' | 'team'

type TicketType = {
  id: string
  name: string
  price: number
  drinks_included: number
}

interface CheckoutFormProps {
  event: any
  selectedTicketType: TicketType | null
  /** When true the form shows the tournament-specific UI (Espectador vs Equipo). */
  tournamentMode?: boolean
}

// ── Component ─────────────────────────────────────────────────────────────

export function CheckoutForm({ event, selectedTicketType, tournamentMode = false }: CheckoutFormProps) {
  // Shared
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Standard mode
  const [quantity, setQuantity] = useState(1)

  // Tournament mode
  const [ticketMode, setTicketMode] = useState<TournamentMode | null>(null)
  const [teamName, setTeamName] = useState('')
  const [playerCount, setPlayerCount] = useState(MIN_PLAYERS)
  const [players, setPlayers] = useState<PlayerData[]>(
    () => Array.from({ length: MIN_PLAYERS }, () => ({ fullName: '', cedula: '' })),
  )

  if (!event) return <div className="text-center text-red-500">Error cargando datos del evento.</div>

  // ── Derived values ───────────────────────────────────────────────────────

  const isTeam = tournamentMode && ticketMode === 'team'
  const modeSelected = !tournamentMode || ticketMode !== null

  const price = tournamentMode
    ? (ticketMode === 'team' ? TEAM_PRICE : SPECTATOR_PRICE)
    : (selectedTicketType?.price ?? event.price ?? 0)

  const qty = isTeam ? 1 : quantity
  const total = price * qty

  const ticketLabel = tournamentMode
    ? (ticketMode === 'team' ? 'Inscripción de Equipo' : 'Espectador')
    : (selectedTicketType?.name ?? 'General')

  const drinksIncluded = !tournamentMode && selectedTicketType ? selectedTicketType.drinks_included : 0

  // ── Helpers ──────────────────────────────────────────────────────────────

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  const updatePlayer = useCallback((idx: number, field: keyof PlayerData, val: string) => {
    setPlayers(prev => prev.map((p, i) => (i === idx ? { ...p, [field]: val } : p)))
  }, [])

  const handlePlayerCount = (count: number) => {
    setPlayerCount(count)
    setPlayers(prev => Array.from({ length: count }, (_, i) => prev[i] ?? { fullName: '', cedula: '' }))
  }

  // ── Validation ───────────────────────────────────────────────────────────

  const validate = (): string | null => {
    if (tournamentMode && !ticketMode) return 'Por favor selecciona el tipo de entrada.'
    if (!name.trim()) return 'Por favor ingresa tu nombre completo.'
    if (!email.trim()) return 'Por favor ingresa tu correo electrónico.'

    if (isTeam) {
      if (!teamName.trim()) return 'Por favor ingresa el nombre del equipo.'
      for (let i = 0; i < players.length; i++) {
        if (!players[i].fullName.trim()) return `Ingresa el nombre completo del jugador ${i + 1}.`
        const ced = players[i].cedula.trim()
        if (!ced) return `Ingresa la cédula del jugador ${i + 1}.`
        if (!/^\d{6,12}$/.test(ced)) return `La cédula del jugador ${i + 1} debe tener entre 6 y 12 dígitos.`
      }
    }
    return null
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setErrorMessage(err); return }

    setErrorMessage('')
    setIsSubmitting(true)

    const metadata: OrderMetadata = isTeam
      ? {
          teamName: teamName.trim(),
          players: players.map(p => ({ fullName: p.fullName.trim(), cedula: p.cedula.trim() })),
        }
      : null

    try {
      await createWompiCheckout(event.id, email.trim(), name.trim(), qty, selectedTicketType?.id, metadata)
    } catch (error) {
      console.error(error)
      setErrorMessage(error instanceof Error ? error.message : 'Hubo un problema al iniciar el pago.')
      setIsSubmitting(false)
    }
  }

  const venueName = event.venues?.name || 'Ubicación Secreta'
  const venueCity = event.venues?.city || 'Bogotá'

  // ── Step numbers ─────────────────────────────────────────────────────────
  // Tournament: 1=Tipo  2=Cantidad/Equipo  3=Datos comprador  4=Pago
  // Standard:            1=Cantidad        2=Tus datos        3=Pago
  const qtyStep      = tournamentMode ? 2 : 1
  const buyerStep    = tournamentMode ? 3 : 2
  const paymentStep  = tournamentMode ? 4 : 3

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

      {/* ────────────────── LEFT: Order summary ────────────────── */}
      <div className="space-y-6 order-2 lg:order-1">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-8">
          {/* Ambient glow — amber for team, sky otherwise */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -z-10 transition-colors duration-500 ${isTeam ? 'bg-amber-500/10' : 'bg-sky-500/10'}`} />

          <div className="flex items-start justify-between mb-8">
            <div>
              <p className={`text-xs font-medium uppercase tracking-widest mb-2 transition-colors ${isTeam ? 'text-amber-400' : 'text-sky-400'}`}>
                Resumen de compra
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{event.title}</h2>
              <p className="text-zinc-400 text-sm mt-1">{venueName}, {venueCity}</p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
              {isTeam ? <Trophy className="w-6 h-6 text-amber-400" /> : <Ticket className="w-6 h-6 text-white" />}
            </div>
          </div>

          <div className="space-y-3 border-b border-white/10 pb-8 mb-8">
            <div className="flex items-center gap-3 text-zinc-400 text-sm">
              <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>{modeSelected ? ticketLabel : 'Selecciona tu tipo de entrada'}</span>
            </div>
            {isTeam && teamName && (
              <div className="flex items-center gap-3 text-amber-400 text-sm">
                <Users className="w-4 h-4 shrink-0" />
                <span className="font-medium">{teamName}</span>
                <span className="text-amber-400/60">·</span>
                <span>{playerCount} jugadores</span>
              </div>
            )}
            {drinksIncluded > 0 && (
              <div className="flex items-center gap-3 text-sky-400 text-sm">
                <span className="text-base">🍹</span>
                <span>Incluye {drinksIncluded} {drinksIncluded === 1 ? 'consumición' : 'consumiciones'}</span>
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm">
            {modeSelected && (
              <div className="flex justify-between text-zinc-400">
                <span>{ticketLabel}{!isTeam ? ` × ${qty}` : ''}</span>
                <span>{fmt(price)}{!isTeam && qty > 1 ? ` × ${qty}` : ''}</span>
              </div>
            )}
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Total a pagar</span>
              <span className={`text-3xl font-bold tracking-tight transition-colors ${modeSelected ? 'text-white' : 'text-zinc-700'}`}>
                {modeSelected ? fmt(total) : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-green-900/10 border border-green-500/20 text-green-400 text-xs md:text-sm">
          <Lock className="w-4 h-4 shrink-0" />
          <p>Pago procesado de forma segura por Wompi. Las entradas se envían al instante.</p>
        </div>
      </div>

      {/* ────────────────── RIGHT: Form ────────────────── */}
      <div className="relative order-1 lg:order-2">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Error banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* ── STEP 1: Ticket type selector (tournament only) ─────────────── */}
          {tournamentMode && (
            <div className="space-y-4">
              <StepHeading n={1} label="Tipo de entrada" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Espectador */}
                <ModeCard
                  active={ticketMode === 'spectator'}
                  onClick={() => setTicketMode('spectator')}
                  color="sky"
                  icon={<Eye className="w-4 h-4 text-sky-400" />}
                  title="Espectador"
                  description="Disfruta el torneo desde las gradas"
                  price={fmt(SPECTATOR_PRICE)}
                />

                {/* Inscripción de Equipo */}
                <ModeCard
                  active={ticketMode === 'team'}
                  onClick={() => setTicketMode('team')}
                  color="amber"
                  icon={<Trophy className="w-4 h-4 text-amber-400" />}
                  title="Inscripción de Equipo"
                  description={`Registra tu equipo (${MIN_PLAYERS}–${MAX_PLAYERS} jugadores)`}
                  price={fmt(TEAM_PRICE)}
                />

              </div>
            </div>
          )}

          {/* ── STEP 2a: Quantity (standard OR tournament-spectator) ────────── */}
          {(!tournamentMode || ticketMode === 'spectator') && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <StepHeading n={qtyStep} label={tournamentMode ? 'Cantidad de entradas' : 'Selecciona cantidad'} />
              <div className="flex items-center gap-4">
                <CounterBtn onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</CounterBtn>
                <input
                  type="number" readOnly value={quantity}
                  className="w-20 h-12 bg-black border border-white/20 rounded-xl text-center text-white font-bold text-lg focus:outline-none"
                />
                <CounterBtn onClick={() => setQuantity(q => Math.min(10, q + 1))}>+</CounterBtn>
              </div>
            </div>
          )}

          {/* ── STEP 2b: Team details (tournament-team only) ────────────────── */}
          {ticketMode === 'team' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <StepHeading n={qtyStep} label="Datos del equipo" color="amber" />

              {/* Team name */}
              <div className="relative group">
                <Trophy className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type="text" value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  placeholder="Nombre del equipo"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition outline-none"
                  required
                />
              </div>

              {/* Player count */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Número de integrantes</label>
                <div className="flex gap-2">
                  {([3, 4, 5] as const).map(n => (
                    <button
                      key={n} type="button" onClick={() => handlePlayerCount(n)}
                      className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${
                        playerCount === n
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30'
                          : 'border-white/10 bg-zinc-900/40 text-zinc-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic player inputs */}
              <div className="space-y-3">
                {players.map((player, i) => (
                  <div key={i} className="rounded-2xl border border-amber-500/10 bg-zinc-900/30 p-4 space-y-3">
                    <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      Jugador {i + 1}
                    </p>

                    {/* Full name */}
                    <div className="relative group">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-amber-400 transition-colors" />
                      <input
                        type="text"
                        value={player.fullName}
                        onChange={e => updatePlayer(i, 'fullName', e.target.value)}
                        placeholder="Nombre Completo"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-zinc-600 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition outline-none"
                        required
                      />
                    </div>

                    {/* Cédula */}
                    <div className="relative group">
                      <Hash className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-amber-400 transition-colors" />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={player.cedula}
                        onChange={e => updatePlayer(i, 'cedula', e.target.value.replace(/\D/g, ''))}
                        placeholder="Número de Cédula"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-zinc-600 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/40 transition outline-none"
                        required
                        maxLength={12}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal disclaimer */}
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <span className="text-base shrink-0 mt-0.5" aria-hidden>⚠️</span>
                <p className="text-xs text-amber-200/70 leading-relaxed">
                  <span className="font-semibold text-amber-300">Aviso legal:</span>{' '}
                  Todos los integrantes deben ser <span className="font-semibold">mayores de 18 años</span>.
                  Al inscribirte certificas que los datos son verídicos y que cada jugador
                  ha aceptado participar bajo los términos y condiciones del torneo.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Buyer / contact details (visible once mode is chosen) ── */}
          {modeSelected && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <StepHeading
                n={buyerStep}
                label={isTeam ? 'Representante del equipo' : 'Tus Datos'}
                color={isTeam ? 'amber' : 'sky'}
              />
              <div className="space-y-3">
                <FloatingInput
                  icon={<User className="w-5 h-5" />}
                  type="text"
                  value={name}
                  onChange={setName}
                  placeholder={isTeam ? 'Tu Nombre Completo (Capitán)' : 'Nombre Completo'}
                  color={isTeam ? 'amber' : 'sky'}
                  required
                />
                <FloatingInput
                  icon={<Mail className="w-5 h-5" />}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="correo@ejemplo.com"
                  color={isTeam ? 'amber' : 'sky'}
                  required
                />
                <p className="text-xs text-zinc-500 pl-1">
                  {isTeam
                    ? 'La confirmación del registro llegará a este correo.'
                    : 'Las entradas llegarán a este correo.'}
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 4: Payment method ─────────────────────────────────────── */}
          {modeSelected && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <StepHeading n={paymentStep} label="Pago Seguro" color={isTeam ? 'amber' : 'sky'} />
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-3">
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <ExternalLink className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>
                    Serás redirigido a{' '}
                    <span className="text-white font-semibold">Wompi</span>{' '}
                    para completar el pago
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-zinc-500 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 shrink-0" />
                  Acepta tarjetas, PSE, Nequi y más · Transacción SSL cifrada
                </p>
              </div>
            </div>
          )}

          {/* ── Submit ────────────────────────────────────────────────────── */}
          {modeSelected && (
            <>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group w-full relative overflow-hidden rounded-full py-4 px-8 font-bold text-lg transition-all
                  disabled:opacity-70 disabled:cursor-not-allowed
                  ${isTeam
                    ? 'bg-amber-400 text-black hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(251,191,36,0.35)]'
                    : 'bg-white text-black hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting
                    ? 'Redirigiendo a Wompi...'
                    : `Continuar al pago · ${fmt(total)}`}
                  {!isSubmitting && (
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
              </button>

              <p className="text-center text-xs text-zinc-600">
                Al continuar, aceptas los Términos de Vouncer.
              </p>
            </>
          )}

        </form>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────

function StepHeading({
  n, label, color = 'sky',
}: { n: number; label: string; color?: 'sky' | 'amber' }) {
  const dot = color === 'amber'
    ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
    : 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]'
  return (
    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3">
      <span className={`w-6 h-6 rounded-full ${dot} text-black text-xs flex items-center justify-center font-bold shrink-0`}>
        {n}
      </span>
      {label}
    </h3>
  )
}

function ModeCard({
  active, onClick, color, icon, title, description, price,
}: {
  active: boolean
  onClick: () => void
  color: 'sky' | 'amber'
  icon: React.ReactNode
  title: string
  description: string
  price: string
}) {
  const ring = color === 'amber'
    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40'
    : 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500/40'
  const priceColor = color === 'amber' ? 'text-amber-400' : 'text-sky-400'
  const iconBg = color === 'amber' ? 'bg-amber-500/10' : 'bg-sky-500/10'
  const checkBg = color === 'amber' ? 'bg-amber-500' : 'bg-sky-500'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.99]
        ${active ? ring : 'border-white/10 bg-zinc-900/40 hover:border-white/20'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className={`w-5 h-5 rounded-full border transition-all ${active ? `${checkBg} border-transparent` : 'border-white/20 bg-transparent'} flex items-center justify-center`}>
          {active && (
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 12 10">
              <path d="M1 5l3 3.5L11 1" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
      <p className="text-white font-bold text-sm mb-1">{title}</p>
      <p className="text-zinc-500 text-xs mb-3 leading-relaxed">{description}</p>
      <p className={`font-black text-lg ${priceColor}`}>{price}</p>
    </button>
  )
}

function CounterBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button" onClick={onClick}
      className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 text-white hover:bg-zinc-700 active:scale-95 transition flex items-center justify-center text-xl font-medium"
    >
      {children}
    </button>
  )
}

function FloatingInput({
  icon, type, value, onChange, placeholder, color, required,
}: {
  icon: React.ReactNode
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  color: 'sky' | 'amber'
  required?: boolean
}) {
  const focus = color === 'amber'
    ? 'focus:border-amber-500/50 focus:ring-amber-500/50'
    : 'focus:border-sky-500/50 focus:ring-sky-500/50'
  const iconFocus = color === 'amber'
    ? 'group-focus-within:text-amber-400'
    : 'group-focus-within:text-sky-400'

  return (
    <div className="relative group">
      <span className={`absolute left-4 top-3.5 text-zinc-500 ${iconFocus} transition-colors`}>
        {icon}
      </span>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:ring-1 transition outline-none ${focus}`}
      />
    </div>
  )
}
