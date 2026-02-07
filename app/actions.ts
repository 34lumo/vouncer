'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import React from 'react'
import { TicketEmail } from './emails/TicketEmail'

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
  quantity: number
) {
  // 1. Inicializamos Resend AQUÍ DENTRO para evitar errores de carga
  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = await createClient()

  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1

  // 2. Recuperar datos del evento
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('title')
    .eq('id', eventId)
    .single()

  if (eventError || !event) {
    console.error('Error fetching event for purchase', eventError)
    throw new Error('Evento no encontrado. Inténtalo de nuevo.')
  }

  const eventTitle = event.title ?? 'Evento'

  // 3. Preparar e insertar tickets
  const rows = Array.from({ length: safeQuantity }, () => ({
    event_id: eventId,
    customer_email: email,
    status: 'paid' as const,
  }))

  const { data: insertedTickets, error } = await supabase
    .from('tickets')
    .insert(rows)
    .select('id, qr_token')

  if (error) {
    console.error('Error inserting tickets', error)
    throw new Error('No se pudo completar la compra. Inténtalo de nuevo.')
  }

  // 4. Enviar correos
  const tickets = (insertedTickets ?? []) as InsertedTicket[]
  const fromEmail = 'Vouncer <onboarding@resend.dev>' // Solo funciona si envías a tu propio email registrado

  // Usamos Promise.all para que sea más rápido (en paralelo)
  try {
    const emailPromises = tickets.map((t) => {
      const qrToken = t.qr_token ?? t.id
      return resend.emails.send({
        from: fromEmail,
        to: email, // IMPORTANTE: En modo test, este email debe ser el tuyo (el admin de Resend)
        subject: `Tu entrada para ${eventTitle} 🎟️`,
        react: React.createElement(TicketEmail, {
          eventName: eventTitle,
          ticketId: t.id,
          qrToken,
          quantity: tickets.length,
        }),
      })
    })

    await Promise.all(emailPromises)
    console.log(`✅ ${tickets.length} emails enviados a ${email}`)
  } catch (sendError) {
    console.error('❌ Error enviando emails:', sendError)
    // No bloqueamos, dejamos que el usuario vea su ticket en la web
  }

  // 5. Redirección
  const ticketIds = tickets.map((t) => t.id).join(',')
  redirect(`/success?ids=${ticketIds}&email=${encodeURIComponent(email)}`)
}

// --- FUNCIÓN DE VALIDACIÓN (Scan) ---
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
          timeZone: 'Europe/Madrid', // 🇪🇸 Hora de España
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