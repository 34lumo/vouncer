import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { TicketsReveal } from './TicketsReveal'

interface SuccessPageProps {
  searchParams: Promise<{ email?: string; ids?: string }>
}

type TicketRow = {
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

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { email, ids } = await searchParams
  const displayEmail = email || 'tu correo'

  const supabase = await createClient()

  let tickets: TicketRow[] = []

  if (ids) {
    const idsArray = ids.split(',').map((id) => id.trim()).filter(Boolean)

    if (idsArray.length > 0) {
      const { data, error } = await supabase
        .from('tickets')
        .select(
          'id, qr_token, event:events(title, venues(name, city))'
        )
        .in('id', idsArray)

      if (error) {
        console.error('Error fetching tickets for success page', error)
      } else if (data) {
        tickets = (data as unknown as TicketRow[]) ?? []
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header de éxito */}
        <div className="max-w-xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-900/30 border border-green-600">
            <svg
              className="h-12 w-12 text-green-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold mb-3">¡Entradas aseguradas!</h1>
          <p className="text-gray-300 mb-6">
            Hemos enviado tus entradas a{' '}
            <span className="font-semibold text-white">{displayEmail}</span>.
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Revisa también tu carpeta de spam o promociones. En puerta solo tendrás
            que mostrar el código QR que te enviamos.
          </p>

          <Link
            href="/"
            className="inline-flex justify-center w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Volver a inicio
          </Link>
        </div>

        {/* Sección de Tickets */}
        {tickets.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Tus Entradas</h2>
            <TicketsReveal tickets={tickets} />
          </section>
        )}
      </div>
    </div>
  )
}

