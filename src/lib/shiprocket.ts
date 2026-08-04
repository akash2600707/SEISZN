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
    throw new Error("Missing Shiprocket credentials")
  }

  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      cache: "no-store",
    }
  )

  const body = await res.text()

  if (!res.ok) {
    throw new Error(
      `Shiprocket login failed: ${res.status} ${body}`
    )
  }

  const json = JSON.parse(body)

  const token = json.token || json.data?.token

  if (!token) {
    throw new Error("Shiprocket token missing")
  }

  cachedToken = {
    token,
    expiresAt: Date.now() + 55 * 60 * 1000,
  }

  return token
}

export async function estimateShiprocketDelivery(
  pincode: string
): Promise<ShiprocketEstimate> {
  const token = await getShiprocketToken()

  const pickup =
    process.env.SHIPROCKET_PICKUP_PINCODE || "600128"

  const url = new URL(
    "https://apiv2.shiprocket.in/v1/external/courier/serviceability/"
  )

  url.searchParams.set("pickup_postcode", pickup)
  url.searchParams.set("delivery_postcode", pincode)
  url.searchParams.set("weight", "0.5")
  url.searchParams.set("cod", "1")

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  })

  const data = await res.json()

  console.log(JSON.stringify(data, null, 2))

  if (!res.ok) {
    throw new Error(
      `Shiprocket serviceability failed: ${res.status}`
    )
  }

  const couriers =
    data?.available_courier_companies ??
    data?.data?.available_courier_companies ??
    []

  if (!couriers.length) {
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

  const first = couriers[0]

  const days =
    Number(
      first.estimated_delivery_days ??
      first.delivery_days ??
      first.etd
    ) || null

  return {
    serviceable: true,
    cod_available: Boolean(
      first.cod ??
      first.cod_available ??
      first.is_cod_available
    ),
    delivery_days: days,
    estimated_delivery_date: normalizeDate(days),
    courier_name:
      first.courier_name ??
      first.courier_company_name ??
      null,
    shipping_charge:
      Number(first.freight_charge ?? 0),
    raw: data,
  }
}
