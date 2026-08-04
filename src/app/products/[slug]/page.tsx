'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase, Product } from '@/lib/supabase'
import { useCart } from '@/lib/cart'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type ShippingEstimate = {
  serviceable: boolean
  cod_available: boolean
  delivery_days: number | null
  estimated_delivery_date: string | null
  courier_name: string | null
  shipping_charge: number | null
  error?: string
}

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [pincode, setPincode] = useState('600001')
  const [estimate, setEstimate] = useState<ShippingEstimate | null>(null)
  const [etaLoading, setEtaLoading] = useState(false)
  const [etaError, setEtaError] = useState('')
  const { add } = useCart()

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setProduct(data)
        setLoading(false)
      })
  }, [slug])

  const checkEstimate = async () => {
    const clean = pincode.trim()
    if (!/^[0-9]{6}$/.test(clean)) {
      setEtaError('Enter a valid 6-digit PIN code.')
      setEstimate(null)
      return
    }
    setEtaLoading(true)
    setEtaError('')
    try {
      const res = await fetch(`/api/shipping/estimate?pincode=${encodeURIComponent(clean)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to fetch delivery estimate')
      setEstimate(data)
    } catch (err: any) {
      setEstimate(null)
      setEtaError(err?.message || 'Unable to fetch delivery estimate')
    } finally {
      setEtaLoading(false)
    }
  }

  const handleAdd = () => {
    if (!product) return
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-24 text-center text-white/30">Loading...</div>
  )

  if (!product) return (
    <div className="max-w-6xl mx-auto px-4 py-24 text-center">
      <p className="text-white/40">Product not found.</p>
      <Link href="/products" className="text-[#e8ff47] text-sm mt-4 inline-block hover:underline">← Back to shop</Link>
    </div>
  )

  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={14} /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative bg-[#1a1a1a] rounded-2xl aspect-square overflow-hidden">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 text-8xl font-black">S</div>
          )}
          {discount && (
            <span className="absolute top-4 left-4 bg-[#e8ff47] text-black text-sm font-bold px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          {product.category && (
            <p className="text-[#e8ff47] text-xs font-bold tracking-[0.3em] uppercase mb-3">{product.category}</p>
          )}
          <h1 className="text-4xl font-black mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-[#e8ff47]">₹{product.price.toLocaleString()}</span>
            {product.compare_price && (
              <span className="text-white/30 text-lg line-through">₹{product.compare_price.toLocaleString()}</span>
            )}
          </div>

          {product.description && (
            <p className="text-white/60 leading-relaxed mb-8">{product.description}</p>
          )}

          <div className="card p-4 mb-6 space-y-3">
            <p className="text-sm font-semibold">Check delivery estimate</p>
            <div className="flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter PIN code"
                inputMode="numeric"
                maxLength={6}
              />
              <button type="button" onClick={checkEstimate} className="btn-primary px-4 rounded-lg text-sm font-bold">
                {etaLoading ? 'Checking...' : 'Check'}
              </button>
            </div>
            {etaError && <p className="text-red-400 text-xs">{etaError}</p>}
            {estimate && estimate.serviceable && (
              <div className="text-sm text-white/70 space-y-1">
                <p>✓ Delivery by: <span className="text-white">{estimate.estimated_delivery_date || 'Soon'}</span></p>
                <p>Courier: <span className="text-white">{estimate.courier_name || 'Shiprocket'}</span></p>
                <p>{estimate.cod_available ? 'Cash on Delivery available' : 'Cash on Delivery not available'}</p>
              </div>
            )}
            {estimate && !estimate.serviceable && (
              <p className="text-sm text-red-400">This PIN code is not serviceable.</p>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-white/50">
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} />
            {added ? '✓ Added to Cart' : product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
          </button>

          <p className="text-white/30 text-xs mt-4 text-center">
            🚚 Free shipping on orders above ₹999 · Delivered via Shiprocket
          </p>
        </div>
      </div>
    </div>
  )
}
