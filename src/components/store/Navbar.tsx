'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'

export default function Navbar() {
  const { count } = useCart()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-black text-xl tracking-widest text-white hover:text-[#e8ff47] transition-colors">
          SEISZN
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-sm text-white/60 hover:text-white transition-colors">
            Shop
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#e8ff47] text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
