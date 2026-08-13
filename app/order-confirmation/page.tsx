'use client'

import { Suspense, useSearchParams } from 'react'
import Link from 'next/link'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const paymentId = searchParams.get('payment_id')

  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold text-green-600">Order Placed!</h1>
      <p className="mt-4">Thank you for your purchase.</p>
      {orderId && (
        <p className="text-gray-600">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
      {paymentId && (
        <p className="text-gray-600">
          Payment ID: <span className="font-mono">{paymentId}</span>
        </p>
      )}
      <Link href="/" className="mt-6 inline-block text-indigo-600 hover:underline">
        Continue Shopping
      </Link>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}