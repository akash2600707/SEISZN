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
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  const email = process.env.SHIPROCKET_EMAIL
  const password = process.env.SHIPROCKET_PASSWORD

  if (!email || !password) {
    throw new Error('Missing Shiprocket credentials')
  }

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shiprocket login failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  const token = data.token || data.data?.token

  if (!token) {
    throw new Error('Shiprocket token not returned')
  }

  cachedToken = { token, expiresAt: Date.now() + 55 * 60 * 1000 }
  return token
}

export async function estimateShiprocketDelivery(pincode: string): Promise<ShiprocketEstimate> {
  const cleanPin = String(pincode || '').trim()
  if (!/^[0-9]{6}$/.test(cleanPin)) {
    throw new Error('Invalid pincode')
  }

  const token = await getShiprocketToken()
  const shipFrom = process.env.SHIPROCKET_PICKUP_PINCODE || '600001'

  const url = new URL('https://apiv2.shiprocket.in/v1/external/courier/serviceability/')
  url.searchParams.set('pickup_postcode', shipFrom)
  url.searchParams.set('delivery_postcode', cleanPin)
  url.searchParams.set('cod', '1')
  url.searchParams.set('weight', '0.5')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shiprocket serviceability failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  const candidates = data?.data || data?.available_courier_companies || []
  const first = Array.isArray(candidates) ? candidates[0] : null

  if (!first) {
    return {
      serviceable: false,
      cod_available: false,
      delivery_days: null,
      estimated_delivery_date: null,
      courier_name: null,
      shipping_charge: null,
      raw: data,
    }
  }

  const deliveryDays = Number(first.estimated_delivery_days ?? first.etd ?? first.delivery_days ?? null) || null

  return {
    serviceable: true,
    cod_available: Boolean(first.cod || first.cod_available || first.is_cod_available),
    delivery_days: deliveryDays,
    estimated_delivery_date: normalizeDate(deliveryDays),
    courier_name: first.courier_name || first.courier_company_id || null,
    shipping_charge: typeof first.freight_charge === 'number' ? first.freight_charge : null,
    raw: data,
  }
}
