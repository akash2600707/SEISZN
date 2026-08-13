'use client'

import Link from 'next/link'
import { useCart } from '@/components/CartContext'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } =
    useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 border-b pb-4"
          >
            <div className="relative h-20 w-20 bg-gray-100 rounded overflow-hidden">
              {item.product.image_url && (
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-gray-600">₹{item.product.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
                className="border rounded px-2 py-1"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                className="border rounded px-2 py-1"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
            <div className="font-bold">₹{item.product.price * item.quantity}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div className="text-xl font-semibold">
          Total ({totalItems} items): ₹{totalPrice}
        </div>
        <Link
          href="/checkout"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
