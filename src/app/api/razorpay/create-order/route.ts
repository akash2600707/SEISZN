import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
  try {
    const { amount, items, customer, shipping_address } = await req.json()

    const shipping_charge = amount >= 999 ? 0 : 99
    const total = amount + shipping_charge

    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: 'INR',
      receipt: `seiszn_${Date.now()}`,
    })

    const { data: dbOrder, error } = await supabaseAdmin
      .from('orders')
      .insert({
        razorpay_order_id: razorpayOrder.id,
        status: 'pending',
        payment_method: 'ONLINE',
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

    return NextResponse.json({
      order_id: razorpayOrder.id,
      db_order_id: dbOrder.id,
      amount: total
    })
  } catch (err: any) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
