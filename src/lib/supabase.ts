import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with elevated privileges
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
)

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | null
  images: string[]
  category: string
  stock: number
  weight: number // in grams, for Shiprocket
  is_active: boolean
  created_at: string
}

export type Order = {
  id: string
  razorpay_order_id: string
  razorpay_payment_id: string | null
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  shiprocket_order_id: string | null
  shiprocket_shipment_id: string | null
  tracking_url: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: ShippingAddress
  items: OrderItem[]
  subtotal: number
  shipping_charge: number
  total: number
  created_at: string
}

export type OrderItem = {
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
}

export type ShippingAddress = {
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
}
