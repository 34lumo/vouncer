import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWompiEventSignature } from '@/lib/wompi'
import type { WompiEventBody, WompiTransaction } from '@/lib/wompi'

// ─────────────────────────────────────────────────────────────────────────────
// Wompi Webhook Handler
//
// Wompi sends a POST to this URL every time a transaction changes state.
// Configure this URL in your Wompi merchant dashboard under:
//   Desarrolladores → Webhooks → URL de eventos
//
// Sandbox URL example:
//   https://your-domain.com/api/webhooks/wompi
//   (or use `ngrok http 3000` locally for sandbox testing)
//
// Secrets used:
//   WOMPI_EVENT_SECRET     — verifies the event body signature
//   WOMPI_INTEGRITY_SECRET — cross-checks the transaction amount/reference
// ─────────────────────────────────────────────────────────────────────────────

// Service-role Supabase client — bypasses RLS, safe only on the server.
function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let eventBody: WompiEventBody

  try {
    eventBody = (await req.json()) as WompiEventBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ── 2. Verify event signature ──────────────────────────────────────────────
  // Wompi embeds the verification data inside the event itself:
  //   eventBody.signature.properties → paths of the fields used in the hash
  //   eventBody.signature.checksum   → SHA256( values + WOMPI_EVENT_SECRET )
  const eventSecret = process.env.WOMPI_EVENT_SECRET!

  if (!verifyWompiEventSignature(eventBody, eventSecret)) {
    console.warn('⚠️  Wompi webhook: invalid event signature — possible spoofing attempt')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // ── 3. Only handle transaction.updated events ──────────────────────────────
  if (eventBody.event !== 'transaction.updated') {
    // Acknowledge other events without processing them
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const tx: WompiTransaction = eventBody.data.transaction

  // ── 4. Only act on APPROVED transactions ──────────────────────────────────
  if (tx.status !== 'APPROVED') {
    console.log(`ℹ️  Wompi webhook: tx ${tx.id} status=${tx.status} — no action needed`)

    // TODO: If status is DECLINED or ERROR, mark the pending_order as 'failed'
    // and optionally notify the customer.
    //
    // const db = adminSupabase()
    // await db
    //   .from('pending_orders')
    //   .update({ status: 'failed' })
    //   .eq('reference', tx.reference)

    return NextResponse.json({ received: true }, { status: 200 })
  }

  // ── 5. Log and proceed to confirm the order ───────────────────────────────
  // Wompi does NOT include the integrity hash in webhook payloads.
  // Fraud prevention here is two-layered:
  //   a) Event signature already verified in step 2.
  //   b) In step 6b (TODO) we cross-check the amount against our pending_orders
  //      record — so a tampered amount_in_cents will be caught there.
  console.log(`✅ Wompi webhook: APPROVED tx ${tx.id} — reference: ${tx.reference}`)
  console.log(`   amount: ${tx.amount_in_cents} ${tx.currency} | customer: ${tx.customer_data.email}`)

  // ── 6. Confirm the order in Supabase ──────────────────────────────────────
  // Instantiate the admin client now — it will be used in the TODO blocks below.
  void adminSupabase() // remove this line and uncomment `const db = ...` once the table is ready

  // TODO: Implement the steps below once the pending_orders table is created
  //       (see migration SQL in app/actions.ts → createWompiCheckout).
  //
  // ── 6a. Look up the pending order ────────────────────────────────────────
  //
  // const { data: order, error: orderError } = await db
  //   .from('pending_orders')
  //   .select('*')
  //   .eq('reference', tx.reference)
  //   .eq('status', 'pending')
  //   .single()
  //
  // if (orderError || !order) {
  //   // Could be a duplicate webhook call — safe to acknowledge
  //   console.warn(`⚠️  pending_order not found for reference: ${tx.reference}`)
  //   return NextResponse.json({ received: true }, { status: 200 })
  // }
  //
  // ── 6b. Validate amount matches what we expected ──────────────────────────
  //
  // if (order.amount_in_cents !== tx.amount_in_cents) {
  //   console.error(`❌ Amount mismatch! expected=${order.amount_in_cents} got=${tx.amount_in_cents}`)
  //   return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  // }
  //
  // ── 6c. Create confirmed tickets (one row per ticket) ─────────────────────
  //
  // For team inscriptions, order.metadata contains the TeamMetadata JSON
  // (teamName + players array with fullName/cedula). It is written verbatim
  // to the tickets.metadata JSONB column so back-office can access player data.
  // For regular (spectator) purchases order.metadata is null.
  //
  // const ticketRows = Array.from({ length: order.quantity }, () => ({
  //   event_id:        order.event_id,
  //   customer_email:  order.customer_email,
  //   customer_name:   order.customer_name,
  //   status:          'paid' as const,
  //   qr_token:        crypto.randomUUID(),
  //   ticket_type_id:  order.ticket_type_id ?? null,
  //   metadata:        order.metadata ?? null,   // ← team data propagated here
  //   wompi_reference: tx.reference,
  //   wompi_tx_id:     tx.id,
  // }))
  //
  // const { data: insertedTickets, error: insertError } = await db
  //   .from('tickets')
  //   .insert(ticketRows)
  //   .select('id, qr_token')
  //
  // if (insertError) {
  //   console.error('❌ Error inserting confirmed tickets:', insertError)
  //   return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })
  // }
  //
  // console.log(`🎫 ${insertedTickets?.length} ticket(s) created for ${order.customer_email}`)
  //
  // ── 6d. Update sold_tickets counter on ticket_types ───────────────────────
  //
  // if (order.ticket_type_id) {
  //   const { data: tt } = await db
  //     .from('ticket_types')
  //     .select('sold_tickets')
  //     .eq('id', order.ticket_type_id)
  //     .single()
  //
  //   if (tt) {
  //     await db
  //       .from('ticket_types')
  //       .update({ sold_tickets: (tt.sold_tickets || 0) + order.quantity })
  //       .eq('id', order.ticket_type_id)
  //   }
  // }
  //
  // ── 6e. Mark pending order as confirmed ───────────────────────────────────
  //
  // await db
  //   .from('pending_orders')
  //   .update({ status: 'confirmed' })
  //   .eq('reference', tx.reference)
  //
  // ── 6f. Revalidate Next.js cache for event pages ──────────────────────────
  //
  // revalidatePath('/')
  // revalidatePath(`/events/${order.event_id}`)
  //
  // ── 6g. Send confirmation email via Resend ────────────────────────────────
  //
  // (Call the same email logic as purchaseTickets() in app/actions.ts,
  //  or extract it into a shared helper. Pass insertedTickets for the QR URLs.)
  //
  // await sendTicketConfirmationEmail({
  //   email:          order.customer_email,
  //   name:           order.customer_name,
  //   eventId:        order.event_id,
  //   tickets:        insertedTickets ?? [],
  //   quantity:       order.quantity,
  //   ticketTypeId:   order.ticket_type_id ?? undefined,
  // })

  return NextResponse.json({ received: true }, { status: 200 })
}
