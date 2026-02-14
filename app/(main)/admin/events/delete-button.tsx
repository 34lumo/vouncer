'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteEvent } from '@/app/(main)/admin/actions'

interface DeleteButtonProps {
    eventId: string
    eventTitle: string
}

export default function DeleteButton({ eventId, eventTitle }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${eventTitle}"?\n\nThis action cannot be undone.`
        )

        if (confirmed) {
            startTransition(async () => {
                const formData = new FormData()
                formData.append('id', eventId)
                await deleteEvent(formData)
            })
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50 hover:border-red-500 transition-all group/btn disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete event"
        >
            <Trash2
                className={`w-5 h-5 group-hover/btn:scale-110 transition-transform ${isPending ? 'animate-pulse' : ''
                    }`}
            />
        </button>
    )
}
