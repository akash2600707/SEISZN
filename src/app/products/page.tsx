import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/store/ProductCard'

export const revalidate = 60

async function getProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-[#e8ff47] text-xs font-bold tracking-[0.3em] uppercase mb-2">Collection</p>
        <h1 className="text-4xl font-black">All Products</h1>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-white/30">
          <p className="text-4xl mb-4">👀</p>
          <p>New drops coming soon.</p>
        </div>
      )}
    </div>
  )
}
