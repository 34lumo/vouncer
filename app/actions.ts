'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import TicketEmail from './emails/ticket-email'
import DemoRequestEmail from './emails/demo-request-email'

// --- INTERFACES ---
interface DemoRequestData {
  name: string
  clubName: string
  email: string
  phone: string
}

interface TicketData {
  id: string
  status: string
  validated_at: string | null
  customer_email: string | null
  customer_name: string | null
  ticket_type_id: string | null
  event: { title: string } | null
  ticket_type: { name: string; drinks_included: number } | null
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
  quantity: number,
  ticketTypeId?: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = await createClient()

  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1

  // 1. RECUPERAR DATOS DEL EVENTO Y TICKET TYPES
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('title, event_date, venues(name, city), ticket_types(*)')
    .eq('id', eventId)
    .single()

  if (eventError || !event) {
    console.error('Error fetching event for purchase', eventError)
    throw new Error('Evento no encontrado. Inténtalo de nuevo.')
  }

  // Price and availability come exclusively from ticket_types
  let ticketType = null
  let ticketPrice = 0
  let ticketTypeName = 'General'
  let drinksIncluded = 0

  if (ticketTypeId) {
    const ticketTypes = event.ticket_types as Array<{
      id: string
      name: string
      price: number
      total_tickets: number
      sold_tickets: number
      drinks_included: number
    }> | null

    ticketType = ticketTypes?.find(tt => tt.id === ticketTypeId)

    if (ticketType) {
      ticketPrice = ticketType.price
      ticketTypeName = ticketType.name
      drinksIncluded = ticketType.drinks_included

      // Availability check
      const available = ticketType.total_tickets - ticketType.sold_tickets
      if (available < safeQuantity) {
        throw new Error(`Solo quedan ${available} entradas de tipo ${ticketTypeName}`)
      }

      // Atomic increment: read current value from DB, add safeQuantity
      // Using raw SQL increment avoids race conditions vs. read-then-write
      const { error: updateError } = await supabase.rpc('increment_sold_tickets', {
        p_ticket_type_id: ticketTypeId,
        p_amount: safeQuantity,
      })

      if (updateError) {
        // Fallback: plain update (works even if RPC not yet created)
        const { error: fallbackError } = await supabase
          .from('ticket_types')
          .update({ sold_tickets: ticketType.sold_tickets + safeQuantity })
          .eq('id', ticketTypeId)

        if (fallbackError) {
          console.error('Error updating ticket type stock', fallbackError)
          throw new Error('No se pudo actualizar el stock. Inténtalo de nuevo.')
        }
      }
    }
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

  const priceStr = ticketPrice
    ? `$${new Intl.NumberFormat('es-CO').format(ticketPrice)}`
    : 'Gratis'


  // 3. BULK INSERT TICKETS (one row per ticket)
  const rows = Array.from({ length: safeQuantity }, () => ({
    event_id: eventId,
    customer_email: email,
    customer_name: name,
    status: 'paid' as const,
    qr_token: crypto.randomUUID(),   // unique QR per ticket
    ticket_type_id: ticketTypeId || null,
  }))

  console.log(`🎫 Inserting ${rows.length} ticket(s) for ${email}`)

  const { data: insertedTickets, error } = await supabase
    .from('tickets')
    .insert(rows)
    .select('id, qr_token')

  if (error) {
    console.error('Error inserting tickets', error)
    throw new Error('No se pudo completar la compra. Inténtalo de nuevo.')
  }

  console.log(`✅ Inserted ${insertedTickets?.length ?? 0} ticket(s) into DB`)

  // 4. GUARANTEED STOCK UPDATE — uses Service Role to bypass RLS
  // Regular user session does NOT have UPDATE on ticket_types (RLS blocks it silently)
  if (ticketTypeId) {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: currentTicketType, error: fetchError } = await supabaseAdmin
      .from('ticket_types')
      .select('sold_tickets')
      .eq('id', ticketTypeId)
      .single()

    if (fetchError) {
      console.error('❌ Admin fetch error (sold_tickets):', fetchError)
    } else if (currentTicketType) {
      const newSoldTotal = (currentTicketType.sold_tickets || 0) + safeQuantity
      const { error: stockError } = await supabaseAdmin
        .from('ticket_types')
        .update({ sold_tickets: newSoldTotal })
        .eq('id', ticketTypeId)

      if (stockError) {
        console.error('❌ RLS/Update Error (sold_tickets):', stockError)
      } else {
        console.log(`📦 sold_tickets → ${newSoldTotal} for type ${ticketTypeId}`)
      }
    }
  }

  // 5. SEND ONE SUMMARY EMAIL (avoids Resend rate-limiting on bulk purchases)
  const tickets = (insertedTickets ?? []) as InsertedTicket[]
  console.log(`📧 Sending 1 summary email to ${email} for ${tickets.length} ticket(s)`)

  const fromEmail = 'Vouncer <entradas@vouncer.com>'
  const subject = safeQuantity === 1
    ? `¡Estás dentro! Tu entrada para ${eventTitle} 🦍`
    : `¡Estás dentro! Tus ${safeQuantity} entradas para ${eventTitle} 🦍`

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.vouncer.com'

    // Build magic-link: /mis-entradas?ids=uuid1,uuid2,...
    // This gives any guest (no auth required) direct access to their QRs.
    const ticketIdList = tickets.map(t => t.id).join(',')
    const ticketsUrl = `${baseUrl}/mis-entradas?ids=${ticketIdList}`

    // For qty=1: also pass the static QR value so the email renders it inline.
    // Use qr_token from DB — never generate a new value at render time.
    const firstTicket = tickets[0]
    const singleTicketProps = safeQuantity === 1 && firstTicket
      ? {
        qrToken: firstTicket.qr_token ?? firstTicket.id,
        ticketId: firstTicket.id,
      }
      : {}

    const emailHtml = await render(TicketEmail({
      userEmail: email,
      userName: name,
      eventName: eventTitle,
      quantity: safeQuantity,
      ...singleTicketProps,
      ticketsUrl,   // ← always included; CTA always rendered
      eventDate: eventDateStr,
      eventLocation: eventLocationStr,
      price: priceStr,
      ticketTypeName,
      drinksIncluded,
    }))

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html: emailHtml,
    })

    console.log(`✅ Summary email sent to ${email}`)
  } catch (sendError) {
    console.error('❌ Error sending summary email:', sendError)
  }

  // 6. PURGE CACHE — ensure event pages reflect new stock immediately
  revalidatePath('/')
  revalidatePath(`/events/${eventId}`)
  revalidatePath('/admin/events')

  // 7. REDIRECT — use event_id + quantity, NOT a comma-separated UUID list
  redirect(`/success?event_id=${eventId}&quantity=${safeQuantity}&email=${encodeURIComponent(email)}`)
}

// --- FUNCIÓN DE VALIDACIÓN (SCAN) ---
// Se mantiene igual
type ValidateTicketResult =
  | { success: false; message: string }
  | { success: true; message: string; data: { eventTitle: string | null; email: string | null; ticketTypeName: string; drinksIncluded: number } }

export async function validateTicket(qrToken: string): Promise<ValidateTicketResult> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tickets')
    .select('id, status, validated_at, customer_email, customer_name, ticket_type_id, event:events(title), ticket_type:ticket_types(name, drinks_included)')
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

    // Get ticket type info
    const ticketTypeData = ticket.ticket_type as { name: string; drinks_included: number } | null
    const ticketTypeName = ticketTypeData?.name || 'General'
    const drinksIncluded = ticketTypeData?.drinks_included || 0

    return {
      success: true,
      message: ticket.customer_name || 'ACCESO PERMITIDO ✅',
      data: {
        eventTitle: ticket.event?.title ?? 'Evento',
        email: ticket.customer_email ?? null,
        ticketTypeName,
        drinksIncluded,
      },
    }
  }

  return { success: false, message: 'Estado inválido.' }
}

// --- FUNCIÓN DE SOLICITUD DE DEMO ---
export async function submitDemoRequest(data: DemoRequestData) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    // Renderizar el email con los datos del solicitante
    const emailHtml = await render(DemoRequestEmail({
      name: data.name,
      clubName: data.clubName,
      email: data.email,
      phone: data.phone,
    }))

    // Enviar emails a ambos destinatarios
    const emailPromises = [
      resend.emails.send({
        from: 'Vouncer Business <business@vouncer.com>',
        to: 'vouncerteam@gmail.com',
        subject: `🎯 Nueva Solicitud de Demo - ${data.clubName}`,
        html: emailHtml,
        replyTo: data.email,
      }),
      resend.emails.send({
        from: 'Vouncer Business <business@vouncer.com>',
        to: 'contact@vouncer.com',
        subject: `🎯 Nueva Solicitud de Demo - ${data.clubName}`,
        html: emailHtml,
        replyTo: data.email,
      })
    ]

    await Promise.all(emailPromises)

    console.log(`✅ Demo request emails sent for ${data.clubName} (${data.email})`)

    return { success: true, message: 'Solicitud enviada correctamente' }
  } catch (error) {
    console.error('❌ Error sending demo request emails:', error)
    return { success: false, message: 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.' }
  }
}