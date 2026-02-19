import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
// NOTA: Importación con llaves { } porque es una exportación nombrada
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

  // Consulta completa con ticket_types
  const { data: event, error } = await supabase
    .from('events')
    .select('*, venues(name, city, address), ticket_types(*)')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Fetch specific ticket type if ticket_type_id is provided
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-sky-500/30 font-sans pb-20">

      {/* Navbar Minimalista */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={`/events/${id}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Cancelar y volver
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 opacity-80">
            <Image src="/logo.png" alt="Vouncer" width={80} height={25} className="object-contain" />
          </div>

          <div className="text-sm text-zinc-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Seguro
          </div>
        </div>
      </nav>

      <main className="pt-12 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-sky-900/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center mb-12 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Finaliza tu compra</h1>
          <p className="text-zinc-400">Estás a un paso de tu noche.</p>
        </div>

        <div className="relative z-10">
          <CheckoutForm event={event} selectedTicketType={selectedTicketType} />
        </div>
      </main>
    </div>
  )
}