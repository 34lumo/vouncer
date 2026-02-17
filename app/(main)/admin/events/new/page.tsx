'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { createEvent } from '@/app/(main)/admin/actions'
import type { State } from '@/app/(main)/admin/actions'
import { Calendar, Clock, DollarSign, Ticket, FileText, AlignLeft, Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {pending ? (
                <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Creating Event...
                </>
            ) : (
                'Create Event'
            )}
        </button>
    )
}

export default function NewEventPage() {
    const initialState: State = { message: undefined, errors: {} }
    const [state, formAction] = useFormState(createEvent, initialState)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string>('')

    // Get current date and time for min attribute
    const now = new Date()
    const minDate = now.toISOString().split('T')[0]

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const clearImage = () => {
        setImagePreview(null)
        setFileName('')
        const fileInput = document.getElementById('event_image') as HTMLInputElement
        if (fileInput) fileInput.value = ''
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
                    <p className="text-zinc-400">Fill in the event details. Your venue will be assigned automatically.</p>
                </div>

                {/* Form */}
                <form action={formAction} className="space-y-6">

                    {/* Event Image Upload */}
                    <div>
                        <label htmlFor="event_image" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-zinc-400" />
                            Event Poster
                        </label>

                        {imagePreview ? (
                            <div className="relative w-full h-64 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
                                <Image
                                    src={imagePreview}
                                    alt="Event preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <p className="text-xs text-zinc-300 truncate">{fileName}</p>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="event_image"
                                className="flex flex-col items-center justify-center w-full h-64 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/50 transition-all"
                            >
                                <ImageIcon className="w-12 h-12 text-zinc-600 mb-3" />
                                <p className="text-sm text-zinc-400 mb-1">Click to upload event poster</p>
                                <p className="text-xs text-zinc-600">PNG, JPG, WEBP up to 10MB</p>
                            </label>
                        )}

                        <input
                            type="file"
                            id="event_image"
                            name="event_image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Optional - Recommended size: 1200x630px</p>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-400" />
                            Event Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            minLength={3}
                            maxLength={200}
                            placeholder="e.g., Summer Music Festival"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <AlignLeft className="w-4 h-4 text-zinc-400" />
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            minLength={10}
                            maxLength={1000}
                            rows={4}
                            placeholder="Describe your event..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                        />
                    </div>

                    {/* Date and Time Section */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-zinc-400" />
                                    Fecha del Evento
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    required
                                    min={minDate}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="time" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    Hora de Inicio
                                </label>
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    required
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                />
                                {state.errors?.date && (
                                    <p className="text-red-400 text-sm mt-1">{state.errors.date[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Event End Time */}
                        <div>
                            <label htmlFor="ends_at" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-400" />
                                Fin del Evento
                            </label>
                            <input
                                type="datetime-local"
                                id="ends_at"
                                name="ends_at"
                                required
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Debe ser después del inicio del evento</p>
                            {state.errors?.ends_at && (
                                <p className="text-red-400 text-sm mt-1">{state.errors.ends_at[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Sales End Time (Optional) */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                        <label htmlFor="sales_ends_at" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            Cierre de Venta (Opcional)
                        </label>
                        <input
                            type="datetime-local"
                            id="sales_ends_at"
                            name="sales_ends_at"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                            Si se deja vacío, se puede vender hasta que acabe el evento.
                        </p>
                    </div>

                    {/* Price and Tickets Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-zinc-400" />
                                Price (COP)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                required
                                min="0"
                                max="10000000"
                                step="1"
                                placeholder="0"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Use 0 for free events</p>
                        </div>

                        <div>
                            <label htmlFor="total_tickets" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Ticket className="w-4 h-4 text-zinc-400" />
                                Total Tickets
                            </label>
                            <input
                                type="number"
                                id="total_tickets"
                                name="total_tickets"
                                required
                                min="1"
                                max="100000"
                                step="1"
                                placeholder="100"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Minimum 1 ticket</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
