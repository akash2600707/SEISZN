'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import { ShippingAddress } from '@/lib/supabase'
import Link from 'next/link'

type Serviceability = {
  checking: boolean
  serviceable: boolean | null
  cod_available: boolean
  courier_name: string | null
  etd: string | null
}

declare global {
  interface Window { Razorpay: any }
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
  'Chandigarh','Puducherry'
]

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const shipping = total >= 999 ? 0 : 99
  const grandTotal = total + shipping

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: 'Tamil Nadu', pincode: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE')
  const [serviceability, setServiceability] = useState<Serviceability>({
    checking: false, serviceable: null, cod_available: false, courier_name: null, etd: null
  })

  const totalWeightKg = items.reduce((sum, i) => sum + ((i.product.weight || 500) * i.quantity), 0) / 1000

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  // Debounced serviceability + COD availability check whenever a full pincode is entered
  useEffect(() => {
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      setServiceability({ checking: false, serviceable: null, cod_available: false, courier_name: null, etd: null })
      return
    }

    let cancelled = false
    setServiceability(s => ({ ...s, checking: true }))

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/shiprocket/serviceability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pincode: form.pincode, weight: totalWeightKg })
        })
        const data = await res.json()
        if (cancelled) return
        setServiceability({
          checking: false,
          serviceable: !!data.serviceable,
          cod_available: !!data.cod_available,
          courier_name: data.courier_name || null,
          etd: data.etd || null
        })
        if (!data.cod_available) {
          setPaymentMethod(m => (m === 'COD' ? 'ONLINE' : m))
        }
      } catch {
        if (cancelled) return
        setServiceability({ checking: false, serviceable: true, cod_available: false, courier_name: null, etd: null })
        setPaymentMethod(m => (m === 'COD' ? 'ONLINE' : m))
      }
    }, 500)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [form.pincode, totalWeightKg])

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')

    const shipping_address = {
      line1: form.line1, line2: form.line2,
      city: form.city, state: form.state,
      pincode: form.pincode, country: 'India'
    } as ShippingAddress

    if (paymentMethod === 'COD') {
      try {
        const res = await fetch('/api/orders/cod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            items,
            customer: { name: form.name, email: form.email, phone: form.phone },
            shipping_address
          })
        })
        const result = await res.json()
        if (!result.success) throw new Error(result.error || 'Could not place order')
        clear()
        router.push(`/orders/${result.db_order_id}?success=1`)
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
        setLoading(false)
      }
      return
    }

    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Payment gateway failed to load')

      // Create Razorpay order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          items,
          customer: { name: form.name, email: form.email, phone: form.phone },
          shipping_address
        })
      })

      const { order_id, db_order_id } = await res.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: 'INR',
        name: 'Seiszn',
        description: 'Order Payment',
        order_id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#e8ff47' },
        handler: async (response: any) => {
          // Verify payment
          const verify = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              db_order_id
            })
          })
          const result = await verify.json()
          if (result.success) {
            clear()
            router.push(`/orders/${db_order_id}?success=1`)
          } else {
            setError('Payment verification failed. Contact support.')
          }
        },
        modal: { ondismiss: () => setLoading(false) }
      }

      new window.Razorpay(options).open()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-white/40 mb-4">Nothing to checkout.</p>
        <Link href="/products" className="text-[#e8ff47] hover:underline">Go shopping →</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-10">Checkout</h1>

      <form onSubmit={handleCheckout} className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg mb-2">Delivery Details</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-white/50 mb-1 block">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Akash Kumar" required />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Phone *</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9876543210" required pattern="[0-9]{10}" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-white/50 mb-1 block">Address Line 1 *</label>
              <input name="line1" value={form.line1} onChange={handleChange} placeholder="Flat / House No, Street" required />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-white/50 mb-1 block">Address Line 2</label>
              <input name="line2" value={form.line2} onChange={handleChange} placeholder="Landmark (optional)" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">City *</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Chennai" required />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Pincode *</label>
              <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="600001" required pattern="[0-9]{6}" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-white/50 mb-1 block">State *</label>
              <select name="state" value={form.state} onChange={handleChange} required>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="card p-4 space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-white/70 truncate flex-1">{product.name} <span className="text-white/40">×{quantity}</span></span>
                <span className="ml-4 font-semibold">₹{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-[#e8ff47]">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="card p-4 mt-4">
            <h2 className="font-bold text-sm mb-3">Payment Method</h2>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${paymentMethod === 'ONLINE' ? 'border-[#e8ff47] bg-[#e8ff47]/5' : 'border-white/10'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                />
                <span className="text-sm">Razorpay <span className="text-white/40">(UPI, Cards, Net Banking)</span></span>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-lg border transition-colors
                ${!serviceability.cod_available ? 'border-white/5 opacity-40 cursor-not-allowed' :
                  paymentMethod === 'COD' ? 'border-[#e8ff47] bg-[#e8ff47]/5 cursor-pointer' : 'border-white/10 cursor-pointer'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  disabled={!serviceability.cod_available}
                  onChange={() => setPaymentMethod('COD')}
                />
                <span className="text-sm">
                  Cash on Delivery
                  {serviceability.checking && <span className="text-white/40"> · checking availability…</span>}
                  {!serviceability.checking && serviceability.serviceable === false && (
                    <span className="text-white/40"> · not deliverable to this pincode</span>
                  )}
                  {!serviceability.checking && serviceability.serviceable && !serviceability.cod_available && (
                    <span className="text-white/40"> · not available for this pincode</span>
                  )}
                </span>
              </label>
            </div>
            {serviceability.cod_available && serviceability.courier_name && (
              <p className="text-white/30 text-xs mt-3">
                Delivered by {serviceability.courier_name}{serviceability.etd ? ` · Est. ${serviceability.etd}` : ''}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-3 p-3 bg-red-400/10 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 rounded-xl mt-4 font-bold text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Processing...' : paymentMethod === 'COD'
              ? `Place Order (Pay ₹${grandTotal.toLocaleString()} on Delivery)`
              : `Pay ₹${grandTotal.toLocaleString()} via Razorpay`}
          </button>
          <p className="text-white/30 text-xs text-center mt-3">
            {paymentMethod === 'COD' ? '📦 Pay in cash when your order arrives' : '🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted'}
          </p>
        </div>
      </form>
    </div>
  )
}
