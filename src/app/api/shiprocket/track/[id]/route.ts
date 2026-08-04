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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const token = await getToken()
    const res = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${id}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
