'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/supabase'
import { useCart } from '@/lib/cart'
import { ShoppingBag } from 'lucide-react'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null

  return (
    <div className="card group overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative bg-[#1a1a1a] aspect-square overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl font-black">
              S
            </div>
          )}
          {discount && (
            <span className="absolute top-2 left-2 bg-[#e8ff47] text-black text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white/60 text-sm font-semibold">Sold Out</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <p className="text-sm font-semibold text-white truncate hover:text-[#e8ff47] transition-colors">
            {product.name}
          </p>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#e8ff47] font-bold text-sm">₹{product.price.toLocaleString()}</span>
          {product.compare_price && (
            <span className="text-white/30 text-xs line-through">₹{product.compare_price.toLocaleString()}</span>
          )}
        </div>
        <button
          onClick={() => product.stock > 0 && add(product)}
          disabled={product.stock === 0}
          className="btn-primary w-full mt-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={12} />
          {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  )
}
