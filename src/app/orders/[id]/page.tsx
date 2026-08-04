'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase, Order } from '@/lib/supabase'
import Link from 'next/link'
import { CheckCircle, Package, Truck } from 'lucide-react'

const STATUS_STEPS = [
  { key: 'paid', label: 'Order Confirmed', icon: CheckCircle },
  { key: 'shipped', label: 'Shipped', icon: Package },
  { key: 'delivered', label: 'Delivered', icon: Truck },
]

export default function OrderPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === '1'
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setOrder(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-24 text-center text-white/30">Loading order...</div>
  if (!order) return <div className="max-w-2xl mx-auto px-4 py-24 text-center text-white/40">Order not found.</div>

  const currentStep = STATUS_STEPS.findIndex(s => s.key === order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {isSuccess && (
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#e8ff47]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-[#e8ff47]" size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2">Order Placed!</h1>
          <p className="text-white/50">Thank you for your order. We&apos;ll ship it soon.</p>
        </div>
      )}

      <div className="card p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Order ID</p>
            <p className="font-mono text-sm mt-0.5">{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
            ${order.status === 'delivered' ? 'bg-green-400/20 text-green-400' :
              order.status === 'shipped' ? 'bg-blue-400/20 text-blue-400' :
              order.status === 'paid' ? 'bg-[#e8ff47]/20 text-[#e8ff47]' :
              'bg-white/10 text-white/40'}`}>
            {order.status}
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-6">
          {STATUS_STEPS.map((step, i) => {
            const Icon = step.icon
            const done = i <= currentStep
            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className={`flex flex-col items-center gap-1 ${done ? 'text-[#e8ff47]' : 'text-white/20'}`}>
                  <Icon size={20} />
                  <span className="text-xs whitespace-nowrap">{step.label}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 mb-4 ${i < currentStep ? 'bg-[#e8ff47]' : 'bg-white/10'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Items */}
        <div className="space-y-3 mb-4">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-white/70">{item.name} <span className="text-white/40">×{item.quantity}</span></span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
            <span>Total Paid</span>
            <span className="text-[#e8ff47]">₹{order.total.toLocaleString()}</span>
          </div>
        </div>

        {order.shiprocket_shipment_id && (
          <div className="bg-blue-400/10 rounded-lg p-3 text-sm text-blue-300">
            📦 Shipment ID: {order.shiprocket_shipment_id}
          </div>
        )}
      </div>

      <div className="card p-4 text-sm">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Delivering to</p>
        <p className="font-semibold">{order.customer_name}</p>
        <p className="text-white/60 mt-0.5">
          {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.pincode}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <Link href="/products" className="flex-1 text-center py-3 rounded-xl border border-white/20 text-sm hover:border-white transition-colors">
          Continue Shopping
        </Link>
        <Link href="https://wa.me/91XXXXXXXXXX" target="_blank" className="flex-1 text-center py-3 rounded-xl bg-green-600 hover:bg-green-500 transition-colors text-sm font-semibold">
          WhatsApp Support
        </Link>
      </div>
    </div>
  )
}
