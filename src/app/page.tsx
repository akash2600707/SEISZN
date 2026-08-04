import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/store/ProductCard'

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)
  return data || []
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <p className="text-[#e8ff47] text-xs font-bold tracking-[0.3em] uppercase mb-4">
          New Collection
        </p>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6">
          BUILT FOR<br />
          <span className="text-[#e8ff47]">THE SEASON</span>
        </h1>
        <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
          Premium streetwear drops. Limited quantities. Ship pan-India.
        </p>
        <Link
          href="/products"
          className="btn-primary inline-block px-10 py-4 rounded-full text-sm uppercase tracking-widest"
        >
          Shop Now
        </Link>
      </section>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link href="/products" className="text-sm text-[#e8ff47] hover:underline">
            View all →
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-white/30">
            <p>Products coming soon.</p>
          </div>
        )}
      </section>

      {/* Trust band */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-4 text-center text-sm">
          {[
            ['🚚', 'Pan-India Shipping', 'Via Shiprocket'],
            ['🔒', 'Secure Payments', 'Razorpay powered'],
            ['↩️', 'Easy Returns', '7-day policy'],
          ].map(([icon, title, sub]) => (
            <div key={title}>
              <p className="text-2xl mb-1">{icon}</p>
              <p className="font-semibold text-white">{title}</p>
              <p className="text-white/40 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
