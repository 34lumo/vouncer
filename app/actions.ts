'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import TicketEmail from './emails/ticket-email'

// --- INTERFACES ---
interface TicketData {
  id: string
  status: string
  validated_at: string | null
  customer_email: string | null
  event: {
    title: string
  } | null
}

interface InsertedTicket {
  id: string
  qr_token: string | null
}

// --- FUNCIÓN DE COMPRA ---
export async function purchaseTickets(
  eventId: string,
  email: string,
  name: string,
  quantity: number
) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = await createClient()

  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1

  // 1. RECUPERAR DATOS DEL EVENTO
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('title, event_date, price, venues(name, city)')
    .eq('id', eventId)
    .single()

  if (eventError || !event) {
    console.error('Error fetching event for purchase', eventError)
    throw new Error('Evento no encontrado. Inténtalo de nuevo.')
  }

  // 2. Preparar variables para el email
  const eventTitle = event.title ?? 'Evento Vouncer'

  const eventDateObj = event.event_date ? new Date(event.event_date) : null
  const eventDateStr = eventDateObj
    ? eventDateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'Fecha por confirmar'

  const venueData = event.venues as any
  const venue = Array.isArray(venueData) ? venueData[0] : venueData
  const eventLocationStr = venue ? `${venue.name}, ${venue.city}` : 'Ubicación Secreta'

  const priceStr = event.price
    ? `$${new Intl.NumberFormat('es-CO').format(event.price)}`
    : 'Gratis'


  // 3. INSERTAR TICKETS EN BASE DE DATOS
  const rows = Array.from({ length: safeQuantity }, () => ({
    event_id: eventId,
    customer_email: email,
    customer_name: name,
    status: 'paid' as const,
    qr_token: crypto.randomUUID()
  }))

  const { data: insertedTickets, error } = await supabase
    .from('tickets')
    .insert(rows)
    .select('id, qr_token')

  if (error) {
    console.error('Error inserting tickets', error)
    throw new Error('No se pudo completar la compra. Inténtalo de nuevo.')
  }

  // 4. ENVIAR CORREOS
  const tickets = (insertedTickets ?? []) as InsertedTicket[]

  // ⚠️ OJO: Usa aquí el correo que prefieras (hola, contact, soporte...)
  const fromEmail = 'Vouncer <entradas@vouncer.com>'

  try {
    const emailPromises = tickets.map(async (t) => {
      const qrToken = t.qr_token ?? t.id

      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrToken}`

      // Renderizamos el email con los datos
      const emailHtml = await render(TicketEmail({
        userEmail: email,
        userName: name,
        eventName: eventTitle,
        ticketId: t.id, // Pasamos el ID completo para que funcione el link
        qrCodeUrl: qrImageUrl,
        eventDate: eventDateStr,
        eventLocation: eventLocationStr,
        price: priceStr
      }))

      // 🔍 DEBUG: Verificar qué URL se está generando
      console.log('🔍 Verificando URL en el email...')
      if (emailHtml.includes('vouncer-mvp.vercel.app')) {
        console.log('❌ ERROR: Email contiene URL ANTIGUA de Vercel')
      } else if (emailHtml.includes('www.vouncer.com')) {
        console.log('✅ CORRECTO: Email contiene URL NUEVA de producción')
      } else {
        console.log('⚠️ ADVERTENCIA: No se encontró ninguna URL de Vouncer')
      }

      return resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `¡Estás dentro! Tu entrada para ${eventTitle} 🦍`,
        html: emailHtml,
      })
    })

    await Promise.all(emailPromises)
    console.log(`✅ ${tickets.length} emails enviados a ${email}`)

  } catch (sendError) {
    console.error('❌ Error enviando emails:', sendError)
  }

  // 5. REDIRECCIÓN
  const ticketIds = tickets.map((t) => t.id).join(',')
  // La redirección aquí es relativa, así que funcionará bien en vouncer.com
  redirect(`/success?ids=${ticketIds}&email=${encodeURIComponent(email)}`)
}

// --- FUNCIÓN DE VALIDACIÓN (SCAN) ---
// Se mantiene igual
type ValidateTicketResult =
  | { success: false; message: string }
  | { success: true; message: string; data: { eventTitle: string | null; email: string | null } }

export async function validateTicket(qrToken: string): Promise<ValidateTicketResult> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tickets')
    .select('id, status, validated_at, customer_email, event:events(title)')
    .eq('qr_token', qrToken)
    .maybeSingle()

  if (error) {
    console.error('Error fetching ticket', error)
    return { success: false, message: 'Error al validar.' }
  }

  if (!data) return { success: false, message: 'Ticket NO VÁLIDO ❌' }

  const ticket = data as unknown as TicketData

  if (ticket.status === 'used') {
    const when = ticket.validated_at
      ? new Date(ticket.validated_at).toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
        hour: '2-digit',
        minute: '2-digit'
      })
      : 'antes'
    return { success: false, message: `Ticket YA USADO (${when}) ⚠️` }
  }

  if (ticket.status === 'paid') {
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'used', validated_at: new Date().toISOString() })
      .eq('id', ticket.id)

    if (updateError) return { success: false, message: 'Fallo al validar.' }

    return {
      success: true,
      message: 'ACCESO PERMITIDO ✅',
      data: {
        eventTitle: ticket.event?.title ?? 'Evento',
        email: ticket.customer_email ?? null,
      },
    }
  }

  return { success: false, message: 'Estado inválido.' }
}