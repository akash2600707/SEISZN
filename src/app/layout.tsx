import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart'
import Navbar from '@/components/store/Navbar'

export const metadata: Metadata = {
  title: 'Seiszn — Official Store',
  description: 'Shop the official Seiszn collection',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-white/10 mt-24 py-10 text-center text-sm text-white/40">
            <p>© {new Date().getFullYear()} Seiszn. All rights reserved.</p>
            <p className="mt-1">Made in India 🇮🇳</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
