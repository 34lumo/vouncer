import { createHash } from 'node:crypto'

// ── Tournament / order metadata types ────────────────────────────────────
// Stored as JSONB in pending_orders.metadata and propagated to tickets.metadata.

export interface PlayerData {
  /** Full legal name of the player */
  fullName: string
  /** Colombian national ID (cédula de ciudadanía) */
  cedula: string
}

export interface TeamMetadata {
  teamName: string
  players: PlayerData[]
}

/** Null for regular (spectator) purchases; TeamMetadata for team inscriptions. */
export type OrderMetadata = TeamMetadata | null

// ── Wompi API types ───────────────────────────────────────────────────────

export interface WompiTransaction {
  id: string
  status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING'
  reference: string
  amount_in_cents: number
  currency: string
  customer_data: {
    email: string
    full_name: string
    phone_number?: string
  }
  payment_method_type: string
  created_at: string
  finalized_at?: string | null
}

export interface WompiEventBody {
  event: string
  data: {
    transaction: WompiTransaction
  }
  environment: 'test' | 'production'
  signature: {
    properties: string[]
    checksum: string
  }
  timestamp: number
  sent_at: string
}

// ── Integrity hash (checkout) ─────────────────────────────────────────────

/**
 * Computes the Wompi integrity signature required when building the checkout URL.
 *
 * Formula:  SHA256( reference + amountInCents + currency + integritySecret )
 *
 * @see https://docs.wompi.co/docs/colombia/widget-checkout-colombia
 */
export function generateIntegrityHash(
  reference: string,
  amountInCents: number,
  currency: string,
  integritySecret: string,
): string {
  const payload = `${reference}${amountInCents}${currency}${integritySecret}`
  return createHash('sha256').update(payload, 'utf8').digest('hex')
}

// ── Event signature (webhook) ─────────────────────────────────────────────

/**
 * Verifies the signature on a Wompi webhook event.
 *
 * Wompi embeds the verification info inside the event body:
 *   event.signature.properties  → ordered list of property paths
 *   event.signature.checksum    → expected SHA256 digest
 *
 * Formula: SHA256( val1 + val2 + ... + valN + eventsSecret )
 * where each valN is resolved from event.data using its dotted path.
 *
 * Returns true only when the computed digest matches the checksum.
 */
export function verifyWompiEventSignature(
  eventBody: WompiEventBody,
  eventsSecret: string,
): boolean {
  const { properties, checksum } = eventBody.signature

  const values = properties.map((path) => {
    // "transaction.id" → eventBody.data.transaction.id
    const keys = path.split('.')
    let node: unknown = eventBody.data
    for (const key of keys) {
      if (node == null || typeof node !== 'object') return ''
      node = (node as Record<string, unknown>)[key]
    }
    return String(node ?? '')
  })

  const payload = values.join('') + eventsSecret
  const computed = createHash('sha256').update(payload, 'utf8').digest('hex')

  return computed === checksum
}
