'use client'

import { createEventWithTicketTypes } from '@/app/(main)/admin/ticket-actions'
import { Calendar, Clock, FileText, AlignLeft, Image as ImageIcon, X, Plus, Trash2, Ticket, DollarSign, Wine } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type TicketType = {
    name: string
    price: string
    total_tickets: string
    drinks_included: string
}

export default function NewEventPage() {
    const router = useRouter()
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Ticket types state
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
        { name: 'General', price: '0', total_tickets: '100', drinks_included: '0' }
    ])

    const now = new Date()
    const minDate = now.toISOString().split('T')[0]
    const minTime = now.toTimeString().slice(0, 5)

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

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { name: '', price: '0', total_tickets: '100', drinks_included: '0' }])
    }

    const removeTicketType = (index: number) => {
        if (ticketTypes.length > 1) {
            setTicketTypes(ticketTypes.filter((_, i) => i !== index))
        }
    }

    const updateTicketType = (index: number, field: keyof TicketType, value: string) => {
        const updated = [...ticketTypes]
        updated[index][field] = value
        setTicketTypes(updated)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const formData = new FormData(e.currentTarget)

            // Validate ticket types
            const validatedTicketTypes = ticketTypes.map(tt => ({
                name: tt.name.trim(),
                price: parseInt(tt.price, 10),
                total_tickets: parseInt(tt.total_tickets, 10),
                drinks_included: parseInt(tt.drinks_included, 10) || 0,
            }))

            // Validation
            if (validatedTicketTypes.some(tt => !tt.name)) {
                throw new Error('All ticket types must have a name')
            }
            if (validatedTicketTypes.some(tt => isNaN(tt.price) || tt.price < 0)) {
                throw new Error('All ticket prices must be valid positive numbers')
            }
            if (validatedTicketTypes.some(tt => isNaN(tt.total_tickets) || tt.total_tickets <= 0)) {
                throw new Error('All ticket types must have at least 1 ticket')
            }

            formData.append('ticket_types', JSON.stringify(validatedTicketTypes))

            await createEventWithTicketTypes(formData)
        } catch (err: any) {
            setError(err.message || 'Failed to create event')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
                    <p className="text-zinc-400">Fill in the event details and configure ticket types.</p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">

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
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-all bg-zinc-900/50"
                            >
                                <ImageIcon className="w-12 h-12 text-zinc-600 mb-2" />
                                <p className="text-sm text-zinc-500">Click to upload event poster</p>
                                <p className="text-xs text-zinc-600 mt-1">PNG, JPG up to 10MB</p>
                            </label>
                        )}
                        <input
                            id="event_image"
                            name="event_image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-400" />
                            Event Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
                            placeholder="e.g., Summer Music Festival 2026"
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
                            rows={4}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                            placeholder="Describe your event..."
                        />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-zinc-400" />
                                Event Date
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                required
                                min={minDate}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-400" />
                                Start Time
                            </label>
                            <input
                                id="time"
                                name="time"
                                type="time"
                                required
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Event End Time */}
                    <div>
                        <label htmlFor="ends_at" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            Event End Time
                        </label>
                        <input
                            id="ends_at"
                            name="ends_at"
                            type="datetime-local"
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
                        />
                    </div>

                    {/* Sales End Time (Optional) */}
                    <div>
                        <label htmlFor="sales_ends_at" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            Sales End Time (Optional)
                        </label>
                        <input
                            id="sales_ends_at"
                            name="sales_ends_at"
                            type="datetime-local"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-sky-500 transition-colors"
                        />
                    </div>

                    {/* Ticket Types Section */}
                    <div className="border-t border-zinc-800 pt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-sky-400" />
                                Ticket Types
                            </h2>
                            <button
                                type="button"
                                onClick={addTicketType}
                                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Type
                            </button>
                        </div>

                        <div className="space-y-4">
                            {ticketTypes.map((tt, index) => (
                                <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-zinc-400">Type #{index + 1}</span>
                                        {ticketTypes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTicketType(index)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium mb-1 text-zinc-500">Name</label>
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
                                                Price (COP)
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
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                value={tt.total_tickets}
                                                onChange={(e) => updateTicketType(index, 'total_tickets', e.target.value)}
                                                min="1"
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium mb-1 text-zinc-500 flex items-center gap-1">
                                                <Wine className="w-3 h-3" />
                                                Drinks Included
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
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Creating Event...
                            </>
                        ) : (
                            'Create Event with Ticket Types'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
