'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateEvent } from '@/app/(main)/admin/actions'
import { Calendar, Clock, DollarSign, Ticket, FileText, AlignLeft, Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface EditEventFormProps {
    event: {
        id: string
        title: string
        description: string
        event_date: string
        price: number
        total_tickets: number
        image_url: string | null
    }
}

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
                    Updating Event...
                </>
            ) : (
                'Update Event'
            )}
        </button>
    )
}

export default function EditEventForm({ event }: EditEventFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(event.image_url)
    const [newImageSelected, setNewImageSelected] = useState(false)
    const [imageDeleted, setImageDeleted] = useState(false)
    const [fileName, setFileName] = useState<string>('')

    // Parse the event date
    const eventDate = new Date(event.event_date)
    const dateValue = eventDate.toISOString().split('T')[0]
    const timeValue = eventDate.toTimeString().slice(0, 5)

    // Get current date for min attribute
    const now = new Date()
    const minDate = now.toISOString().split('T')[0]

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            setNewImageSelected(true)
            setImageDeleted(false) // Reset deletion flag when new image selected
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
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
        const fileInput = document.getElementById('event_image') as HTMLInputElement
        if (fileInput) fileInput.value = ''
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
                    <p className="text-zinc-400">Update event details. Leave image unchanged if you don't upload a new one.</p>
                </div>

                {/* Form */}
                <form action={updateEvent} className="space-y-6">
                    {/* Hidden event ID */}
                    <input type="hidden" name="event_id" value={event.id} />
                    {/* Hidden field to track image deletion */}
                    <input type="hidden" name="image_deleted" value={imageDeleted.toString()} />

                    {/* Event Image Upload */}
                    <div>
                        <label htmlFor="event_image" className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-zinc-400" />
                            Event Poster {newImageSelected && <span className="text-sky-400 text-xs">(New image selected)</span>}
                            {imageDeleted && <span className="text-red-400 text-xs">(Image will be removed)</span>}
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
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <p className="text-xs text-zinc-300 truncate">
                                        {newImageSelected ? fileName : 'Current image (click X to change)'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="event_image"
                                className="flex flex-col items-center justify-center w-full h-64 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/50 transition-all"
                            >
                                <ImageIcon className="w-12 h-12 text-zinc-600 mb-3" />
                                <p className="text-sm text-zinc-400 mb-1">Click to upload new poster</p>
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
                        <p className="text-xs text-zinc-500 mt-1">Optional - Leave unchanged if you don't select a new file</p>
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
                            defaultValue={event.title}
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
                            defaultValue={event.description}
                            placeholder="Describe your event..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                        />
                    </div>

                    {/* Date and Time Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-zinc-400" />
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                required
                                min={minDate}
                                defaultValue={dateValue}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-400" />
                                Time
                            </label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                required
                                defaultValue={timeValue}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>
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
                                defaultValue={event.price}
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
                                defaultValue={event.total_tickets}
                                placeholder="100"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                            <p className="text-xs text-zinc-500 mt-1">Minimum 1 ticket</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex gap-4">
                        <a
                            href="/admin/events"
                            className="flex-1 bg-zinc-800 text-white font-semibold py-3 px-6 rounded-xl hover:bg-zinc-700 transition-all text-center"
                        >
                            Cancel
                        </a>
                        <div className="flex-1">
                            <SubmitButton />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
