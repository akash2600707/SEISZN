import { NextRequest, NextResponse } from 'next/server'
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
      payment_method: 'COD',
      sub_total: order.subtotal,
      length: 20, width: 15, height: 10,
      weight: 0.5
    })
  })
  return res.json()
}

export async function POST(req: NextRequest) {
  try {
    const { amount, items, customer, shipping_address } = await req.json()

    const shipping_charge = amount >= 999 ? 0 : 99
    const total = amount + shipping_charge

    const { data: dbOrder, error } = await supabaseAdmin
      .from('orders')
      .insert({
        status: 'paid',
        payment_method: 'COD',
        payment_status: 'PENDING',
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address,
        items: items.map((i: any) => ({
          product_id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images?.[0] || ''
        })),
        subtotal: amount,
        shipping_charge,
        total
      })
      .select()
      .single()

    if (error) throw error

    try {
      const token = await getShiprocketToken()
      const srOrder = await createShiprocketOrder(dbOrder, token)
      if (srOrder.order_id) {
        await supabaseAdmin
          .from('orders')
          .update({
            shiprocket_order_id: String(srOrder.order_id),
            shiprocket_shipment_id: String(srOrder.shipment_id || ''),
            status: 'shipped'
          })
          .eq('id', dbOrder.id)
      }
    } catch (srError) {
      console.error('Shiprocket error (non-fatal):', srError)
    }

    return NextResponse.json({ success: true, db_order_id: dbOrder.id })
  } catch (err: any) {
    console.error('COD order error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}