'use client'

import { useCart } from '@/lib/cart'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, update, remove, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4 text-white/20" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-white/40 mb-8">Add some products to get started.</p>
        <Link href="/products" className="btn-primary inline-block px-8 py-3 rounded-full text-sm uppercase tracking-wider">
          Shop Now
        </Link>
      </div>
    )
  }

  const shipping = total >= 999 ? 0 : 99

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-10">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl font-black">S</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{product.name}</p>
                <p className="text-[#e8ff47] font-bold mt-0.5">₹{product.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => update(product.id, quantity - 1)} className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                    <Minus size={10} />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                  <button onClick={() => update(product.id, quantity + 1)} disabled={quantity >= product.stock} className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors disabled:opacity-30">
                    <Plus size={10} />
                  </button>
                  <button onClick={() => remove(product.id)} className="ml-auto text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-white/30 text-xs">Add ₹{(999 - total).toLocaleString()} more for free shipping</p>
            )}
            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-[#e8ff47]">₹{(total + shipping).toLocaleString()}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="btn-primary block w-full text-center py-3.5 rounded-xl mt-6 text-sm uppercase tracking-wider font-bold"
          >
            Proceed to Checkout
          </Link>
          <Link href="/products" className="block text-center text-sm text-white/30 hover:text-white mt-3 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
