import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CheckoutForm } from '@/components/ui/checkout-form'

export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ticket_type_id?: string }>
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { ticket_type_id } = await searchParams
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*, venues(name, city, address), ticket_types(*)')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  let selectedTicketType = null
  if (ticket_type_id) {
    const ticketTypes = event.ticket_types as Array<{
      id: string
      name: string
      price: number
      total_tickets: number
      sold_tickets: number
      drinks_included: number
    }> | null

    selectedTicketType = ticketTypes?.find(tt => tt.id === ticket_type_id) || null
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">

      <nav className="border-b border-white/[0.06] bg-black/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href={`/events/${id}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Cancelar
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 opacity-70">
            <Image src="/logo.png" alt="Vouncer" width={80} height={25} className="object-contain" />
          </div>

          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Seguro
          </div>
        </div>
      </nav>

      <main className="pt-10 px-6">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-1.5">Finaliza tu compra</h1>
          <p className="text-zinc-500 text-sm">Estás a un paso de tu noche.</p>
        </div>

        <CheckoutForm event={event} selectedTicketType={selectedTicketType} />
      </main>
    </div>
  )
}
