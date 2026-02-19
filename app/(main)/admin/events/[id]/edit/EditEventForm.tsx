'use client'

import { useState } from 'react'
import { updateEventWithTicketTypes, type TicketTypeForUpdate } from '@/app/(main)/admin/ticket-actions'
import { Calendar, Clock, FileText, AlignLeft, Image as ImageIcon, X, Plus, Trash2, Ticket, DollarSign, Wine } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────

interface ExistingTicketType {
    id: string
    name: string
    price: number
    total_tickets: number
    sold_tickets: number
    drinks_included: number
}

interface EditEventFormProps {
    event: {
        id: string
        title: string
        description: string
        event_date: string | null
        ends_at: string | null
        sales_ends_at: string | null
        image_url: string | null
    }
    ticketTypes: ExistingTicketType[]
}

// Local working type (id optional because new rows won't have one yet)
type LocalTicketType = {
    id?: string
    name: string
    price: string
    total_tickets: string
    drinks_included: string
    sold_tickets?: number   // read-only, for display
}

// ─── Component ───────────────────────────────────────────────────────────

export default function EditEventForm({ event, ticketTypes: initialTicketTypes }: EditEventFormProps) {
    const router = useRouter()

    // Pre-fill image
    const [imagePreview, setImagePreview] = useState<string | null>(event.image_url)
    const [newImageSelected, setNewImageSelected] = useState(false)
    const [imageDeleted, setImageDeleted] = useState(false)
    const [fileName, setFileName] = useState('')

    // Pre-fill ticket types — convert numbers to strings for controlled inputs
    const [ticketTypes, setTicketTypes] = useState<LocalTicketType[]>(
        initialTicketTypes.length > 0
            ? initialTicketTypes.map(tt => ({
                id: tt.id,
                name: tt.name,
                price: String(tt.price),
                total_tickets: String(tt.total_tickets),
                drinks_included: String(tt.drinks_included),
                sold_tickets: tt.sold_tickets,
            }))
            : [{ name: 'General', price: '0', total_tickets: '100', drinks_included: '0' }]
    )

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Parse date fields for pre-filling
    const parseDateTime = (iso: string | null) => {
        if (!iso) return { date: '', time: '' }
        const d = new Date(iso)
        return {
            date: d.toISOString().split('T')[0],
            time: d.toTimeString().slice(0, 5),
        }
    }
    const parseISO = (iso: string | null) => {
        if (!iso) return ''
        return new Date(iso).toISOString().slice(0, 16) // datetime-local format
    }

    const start = parseDateTime(event.event_date)
    const endsAtDefault = parseISO(event.ends_at)
    const salesEndsAtDefault = parseISO(event.sales_ends_at)

    // ── Image handlers ────────────────────────────────────────────────────
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            setNewImageSelected(true)
            setImageDeleted(false)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }
    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setImagePreview(null)
        setImageDeleted(true)
        setNewImageSelected(false)
        setFileName('')
        const input = document.getElementById('event_image') as HTMLInputElement
        if (input) input.value = ''
    }

    // ── Ticket type handlers ──────────────────────────────────────────────
    const addTicketType = () =>
        setTicketTypes([...ticketTypes, { name: '', price: '0', total_tickets: '100', drinks_included: '0' }])

    const removeTicketType = (index: number) => {
        if (ticketTypes.length > 1) setTicketTypes(ticketTypes.filter((_, i) => i !== index))
    }

    const updateTicketType = (index: number, field: keyof LocalTicketType, value: string) => {
        const updated = [...ticketTypes]
            ; (updated[index] as any)[field] = value
        setTicketTypes(updated)
    }

    // ── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const formData = new FormData(e.currentTarget)

            const validated: TicketTypeForUpdate[] = ticketTypes.map(tt => ({
                ...(tt.id ? { id: tt.id } : {}),
                name: tt.name.trim(),
                price: parseInt(tt.price, 10) || 0,
                total_tickets: parseInt(tt.total_tickets, 10) || 1,
                drinks_included: parseInt(tt.drinks_included, 10) || 0,
            }))

            if (validated.some(tt => !tt.name)) throw new Error('Todos los tipos de entrada deben tener un nombre')
            if (validated.some(tt => tt.price < 0)) throw new Error('Los precios deben ser positivos')
            if (validated.some(tt => tt.total_tickets < 1)) throw new Error('Cada tipo necesita al menos 1 entrada')

            await updateEventWithTicketTypes(event.id, formData, validated)
        } catch (err: any) {
            // redirect() throws internally — ignore that specific "error"
            if (err?.message !== 'NEXT_REDIRECT') {
                setError(err.message || 'Failed to update event')
                setIsSubmitting(false)
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Editar Evento</h1>
                    <p className="text-zinc-400">Actualiza los detalles del evento y gestiona los tipos de entrada.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Hidden fields */}
                    <input type="hidden" name="event_id" value={event.id} />
                    <input type="hidden" name="image_deleted" value={imageDeleted.toString()} />

                    {/* ── Image ────────────────────────────────────────── */}
                    <div>
                        <label htmlFor="event_image" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-zinc-400" />
                            Cartel del Evento
                            {newImageSelected && <span className="text-sky-400 text-xs">(Nueva imagen seleccionada)</span>}
                            {imageDeleted && <span className="text-red-400 text-xs">(La imagen será eliminada)</span>}
                        </label>

                        {imagePreview ? (
                            <div className="relative w-full h-64 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
                                <Image src={imagePreview} alt="Event preview" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <p className="text-xs text-zinc-300 truncate">
                                        {newImageSelected ? fileName : 'Imagen actual (hover para cambiar)'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <label htmlFor="event_image" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-all bg-zinc-900/50">
                                <ImageIcon className="w-12 h-12 text-zinc-600 mb-2" />
                                <p className="text-sm text-zinc-500">Haz clic para subir el cartel</p>
                                <p className="text-xs text-zinc-600 mt-1">PNG, JPG hasta 10MB</p>
                            </label>
                        )}
                        <input id="event_image" name="event_image" type="file" accept="image/*"
                            onChange={handleImageChange} className="hidden" />
                    </div>

                    {/* ── Title ────────────────────────────────────────── */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-400" />
                            Título del Evento
                        </label>
                        <input id="title" name="title" type="text" required defaultValue={event.title}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors" />
                    </div>

                    {/* ── Description ──────────────────────────────────── */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <AlignLeft className="w-4 h-4 text-zinc-400" />
                            Descripción
                        </label>
                        <textarea id="description" name="description" required rows={4}
                            defaultValue={event.description ?? ''}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors resize-none" />
                    </div>

                    {/* ── Date & Time ───────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-zinc-400" />
                                Fecha del Evento
                            </label>
                            <input id="date" name="date" type="date" required defaultValue={start.date}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-400" />
                                Hora de Inicio
                            </label>
                            <input id="time" name="time" type="time" required defaultValue={start.time}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors" />
                        </div>
                    </div>

                    {/* ── End Time ─────────────────────────────────────── */}
                    <div>
                        <label htmlFor="ends_at" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            Hora de Fin del Evento
                        </label>
                        <input id="ends_at" name="ends_at" type="datetime-local" required defaultValue={endsAtDefault}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors" />
                    </div>

                    {/* ── Sales End Time ───────────────────────────────── */}
                    <div>
                        <label htmlFor="sales_ends_at" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            Fin de Venta <span className="text-zinc-600 text-xs ml-1">(Opcional)</span>
                        </label>
                        <input id="sales_ends_at" name="sales_ends_at" type="datetime-local" defaultValue={salesEndsAtDefault}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors" />
                    </div>

                    {/* ── Ticket Types ──────────────────────────────────── */}
                    <div className="border-t border-zinc-800 pt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-sky-400" />
                                Tipos de Entrada
                            </h2>
                            <button
                                type="button"
                                onClick={addTicketType}
                                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Añadir Tipo
                            </button>
                        </div>

                        <div className="space-y-4">
                            {ticketTypes.map((tt, index) => (
                                <div key={tt.id ?? `new-${index}`} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-zinc-400">Tipo #{index + 1}</span>
                                            {tt.id && (
                                                <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">
                                                    {tt.sold_tickets ?? 0} vendidas
                                                </span>
                                            )}
                                            {!tt.id && (
                                                <span className="text-xs text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                                                    Nuevo
                                                </span>
                                            )}
                                        </div>
                                        {ticketTypes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTicketType(index)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                                title={tt.id ? 'Eliminar (se cerrará)' : 'Eliminar'}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium mb-1 text-zinc-500">Nombre</label>
                                            <input
                                                type="text"
                                                value={tt.name}
                                                onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                                                placeholder="e.g., Early Bird, VIP"
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 text-zinc-500 flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                Precio (COP)
                                            </label>
                                            <input
                                                type="number"
                                                value={tt.price}
                                                onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                                                min="0"
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1 text-zinc-500 flex items-center gap-1">
                                                <Ticket className="w-3 h-3" />
                                                Cantidad Total
                                                {tt.sold_tickets !== undefined && tt.sold_tickets > 0 && (
                                                    <span className="text-zinc-600 ml-1">(mín: {tt.sold_tickets})</span>
                                                )}
                                            </label>
                                            <input
                                                type="number"
                                                value={tt.total_tickets}
                                                onChange={(e) => updateTicketType(index, 'total_tickets', e.target.value)}
                                                min={tt.sold_tickets ?? 1}
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium mb-1 text-zinc-500 flex items-center gap-1">
                                                <Wine className="w-3 h-3" />
                                                Consumiciones Incluidas
                                            </label>
                                            <input
                                                type="number"
                                                value={tt.drinks_included}
                                                onChange={(e) => updateTicketType(index, 'drinks_included', e.target.value)}
                                                min="0"
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {ticketTypes.some(tt => tt.id) && (
                            <p className="text-xs text-zinc-500 mt-3">
                                ⚠️ Eliminar un tipo existente lo cerrará (sin nuevas ventas). Las entradas ya compradas siguen siendo válidas.
                            </p>
                        )}
                    </div>

                    {/* ── Actions ───────────────────────────────────────── */}
                    <div className="flex gap-4 pt-2">
                        <a
                            href="/admin/events"
                            className="flex-1 bg-zinc-800 text-white font-semibold py-3 px-6 rounded-xl hover:bg-zinc-700 transition-all text-center"
                        >
                            Cancelar
                        </a>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
