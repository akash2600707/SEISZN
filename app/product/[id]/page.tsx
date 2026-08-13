'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/types'
import { useCart } from '@/components/CartContext'
import Image from 'next/image'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      setProduct(data)
      setLoading(false)
    }
    if (id) fetchProduct()
  }, [id])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!product) return <div className="text-center py-10">Product not found</div>

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-3xl font-bold mt-4">₹{product.price}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Availability: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </p>
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
          )}
        </div>
        <button
          onClick={() => addToCart(product, quantity)}
          disabled={product.stock <= 0}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
