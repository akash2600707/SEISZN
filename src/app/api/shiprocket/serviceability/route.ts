import { NextRequest, NextResponse } from 'next/server'

async function getToken(): Promise<string> {
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    })
  })
  const data = await res.json()
  return data.token
}

export async function POST(req: NextRequest) {
  try {
    const { pincode, weight } = await req.json()

    if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
    }

    const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE
    if (!pickupPincode) {
      console.error('SHIPROCKET_PICKUP_PINCODE is not set')
      return NextResponse.json({ serviceable: true, cod_available: false, courier_name: null, etd: null })
    }

    const token = await getToken()

    const params = new URLSearchParams({
      pickup_postcode: pickupPincode,
      delivery_postcode: pincode,
      weight: String(weight && weight > 0 ? weight : 0.5),
      cod: '1'
    })

    const res = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    const couriers = data?.data?.available_courier_companies || []

    if (couriers.length === 0) {
      return NextResponse.json({ serviceable: false, cod_available: false, courier_name: null, etd: null })
    }

    const codCourier = couriers.find((c: any) => c.cod === 1 || c.cod === '1')
    const best = codCourier || couriers[0]

    return NextResponse.json({
      serviceable: true,
      cod_available: !!codCourier,
      courier_name: best.courier_name || null,
      etd: best.etd || null
    })
  } catch (err: any) {
    console.error('Serviceability check error:', err)
    return NextResponse.json({ serviceable: true, cod_available: false, courier_name: null, etd: null })
  }
}