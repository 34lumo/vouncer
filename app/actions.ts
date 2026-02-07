'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// --- 1. Definimos la forma EXACTA de los datos del Ticket ---
// Esto soluciona el error de "Property title missing"
interface TicketData {
  id: string
  status: string
  validated_at: string | null
  customer_email: string | null
  event: {
    title: string
  } | null // Puede ser null si el evento se borró
}

export async function purchaseTickets(
  eventId: string,
  email: string,
  quantity: number
) {
  const supabase = await createClient()

  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1

  const rows = Array.from({ length: safeQuantity }, () => ({
    event_id: eventId,
    customer_email: email,
    status: 'paid' as const,
  }))

  const { data: insertedTickets, error } = await supabase
    .from('tickets')
    .insert(rows)
    .select('id')

  if (error) {
    console.error('Error inserting tickets', error)
    throw new Error('No se pudo completar la compra. Inténtalo de nuevo.')
  }

  const ticketIds =
    insertedTickets?.map((t: { id: string | number }) => t.id).join(',') ?? ''

  redirect(`/success?ids=${ticketIds}&email=${encodeURIComponent(email)}`)
}

// --- Tipado de la respuesta de validación ---
type ValidateTicketResult =
  | {
      success: false
      message: string
    }
  | {
      success: true
      message: string
      data: {
        eventTitle: string | null
        email: string | null
      }
    }

export async function validateTicket(qrToken: string): Promise<ValidateTicketResult> {
  const supabase = await createClient()

  // 1. Obtenemos los datos "crudos" de la base de datos
  const { data, error } = await supabase
    .from('tickets')
    .select('id, status, validated_at, customer_email, event:events(title)')
    .eq('qr_token', qrToken)
    .maybeSingle()

  if (error) {
    console.error('Error fetching ticket for validation', error)
    return {
      success: false,
      message: 'Error al validar el ticket. Intenta de nuevo.',
    }
  }

  // Caso 1: No existe
  if (!data) {
    return {
      success: false,
      message: 'Ticket NO VÁLIDO ❌',
    }
  }

  // --- AQUÍ ESTÁ EL ARREGLO ---
  // Forzamos a TypeScript a entender que 'data' cumple con nuestra interfaz TicketData
  const ticket = data as unknown as TicketData

  // Caso 2: Ya usado
  if (ticket.status === 'used') {
    const when = ticket.validated_at
      ? new Date(ticket.validated_at).toLocaleString('es-ES', {
          timeZone: 'America/Bogota', // Opcional: Ajusta a tu zona horaria si quieres
        })
      : 'antes'

    return {
      success: false,
      message: `Ticket YA USADO (Hora: ${when}) ⚠️`,
    }
  }

  // Caso 3: Éxito -> marcar como usado
  if (ticket.status === 'paid') {
    const nowIso = new Date().toISOString()

    const { error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'used', validated_at: nowIso })
      .eq('id', ticket.id)

    if (updateError) {
      console.error('Error updating ticket as used', updateError)
      return {
        success: false,
        message: 'No se pudo marcar el ticket como usado. Intenta de nuevo.',
      }
    }

    return {
      success: true,
      message: 'ACCESO PERMITIDO ✅',
      data: {
        // Usamos ?. por si acaso 'event' viniera null
        eventTitle: ticket.event?.title ?? 'Evento desconocido',
        email: ticket.customer_email ?? null,
      },
    }
  }

  // Estado desconocido
  return {
    success: false,
    message: 'Estado de ticket no válido para acceso.',
  }
}