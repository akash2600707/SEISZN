import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

async function getShiprocketToken(): Promise<string> {
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

async function createShiprocketOrder(order: any, token: string) {
  const addr = order.shipping_address
  const items = order.items.map((item: any) => ({
    name: item.name,
    sku: item.product_id.slice(0, 8),
    units: item.quantity,
    selling_price: item.price,
  }))

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      order_id: order.id,
      order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pickup_location: 'Primary',
      channel_id: process.env.SHIPROCKET_CHANNEL_ID || '',
      billing_customer_name: order.customer_name,
      billing_last_name: '',
      billing_address: addr.line1,
      billing_address_2: addr.line2 || '',
      billing_city: addr.city,
      billing_pincode: addr.pincode,
      billing_state: addr.state,
      billing_country: 'India',
      billing_email: order.customer_email,
      billing_phone: order.customer_phone,
      shipping_is_billing: true,
      order_items: items,
      payment_method: 'Prepaid',
      sub_total: order.subtotal,
      length: 20, width: 15, height: 10,
      weight: 0.5
    })
  })
  return res.json()
}

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = await req.json()

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    const { data: order } = await supabaseAdmin
      .from('orders')
      .update({ status: 'paid', razorpay_payment_id, payment_status: 'PAID' })
      .eq('id', db_order_id)
      .select()
      .single()

    try {
      const token = await getShiprocketToken()
      const srOrder = await createShiprocketOrder(order, token)
      if (srOrder.order_id) {
        await supabaseAdmin
          .from('orders')
          .update({
            shiprocket_order_id: String(srOrder.order_id),
            shiprocket_shipment_id: String(srOrder.shipment_id || ''),
            status: 'shipped'
          })
          .eq('id', db_order_id)
      }
    } catch (srError) {
      console.error('Shiprocket error (non-fatal):', srError)
    }

    return NextResponse.json({ success: true, order_id: db_order_id })
  } catch (err: any) {
    console.error('Verify error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
