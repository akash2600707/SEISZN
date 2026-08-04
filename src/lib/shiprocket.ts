export type ShiprocketEstimate = {
  serviceable: boolean
  cod_available: boolean
  delivery_days: number | null
  estimated_delivery_date: string | null
  courier_name: string | null
  shipping_charge: number | null
  raw?: unknown
}

let cachedToken: { token: string; expiresAt: number } | null = null

function normalizeDate(days: number | null) {
  if (!days || Number.isNaN(days)) return null

  const d = new Date()
  d.setDate(d.getDate() + days)

  return d.toISOString().slice(0, 10)
}

async function getShiprocketToken(): Promise<string> {
  // your existing login code
}

export async function estimateShiprocketDelivery(
  pincode: string
): Promise<ShiprocketEstimate> {
  // the updated function
}
