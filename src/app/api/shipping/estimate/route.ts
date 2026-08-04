import { NextRequest, NextResponse } from 'next/server'
import { estimateShiprocketDelivery } from '@/lib/shiprocket'

export async function GET(req: NextRequest) {
  try {
    const pincode = req.nextUrl.searchParams.get('pincode') || ''
    const estimate = await estimateShiprocketDelivery(pincode)
    return NextResponse.json(estimate)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to estimate delivery' },
      { status: 400 }
    )
  }
}
