export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  stock: number
  active: boolean
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}
