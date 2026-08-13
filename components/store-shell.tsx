'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowRight, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { products, formatINR, Product } from '@/lib/data';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => `${p.name} ${p.category} ${p.color}`.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  return (
    <>
      <div className="announcement">Free shipping across India on orders above ₹1,999 <span>•</span> easy returns</div>
      <header className="site-header">
        <button className="icon-button mobile-only" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
        <Link href="/" className="wordmark">SEISZN</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link className={pathname === '/shop' ? 'active' : ''} href="/shop">Shop</Link>
          <Link href="/shop?category=Dresses">Dresses</Link>
          <Link href="/shop?category=Sets">Sets</Link>
          <Link href="/#journal">Journal</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={21} /></button>
          <Link href="/account" className="icon-button desktop-only" aria-label="Account"><User size={21} /></Link>
          <Link href="/cart" className="icon-button bag-icon" aria-label="Cart"><ShoppingBag size={21} /><span className="bag-dot" /></Link>
        </div>
      </header>
      {searchOpen && (
        <div className="overlay" onMouseDown={() => setSearchOpen(false)}>
          <div className="search-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="search-top"><input autoFocus placeholder="Search the collection" value={query} onChange={(e) => setQuery(e.target.value)} /><button className="icon-button" onClick={() => setSearchOpen(false)}><X /></button></div>
            {query && hits.length === 0 && <p className="muted">No pieces found.</p>}
            <div className="search-hits">{hits.map((p) => <button key={p.id} onClick={() => { setSearchOpen(false); router.push(`/product/${p.slug}`); }}><img src={p.image} alt="" /><span><strong>{p.name}</strong><small>{p.category} · {formatINR(p.price)}</small></span><ArrowRight size={17} /></button>)}</div>
          </div>
        </div>
      )}
      {menuOpen && <div className="mobile-menu"><div className="mobile-menu-head"><span className="wordmark">SEISZN</span><button className="icon-button" onClick={() => setMenuOpen(false)}><X /></button></div><div className="mobile-links"><Link href="/shop" onClick={() => setMenuOpen(false)}>Shop <ArrowRight size={18} /></Link><Link href="/shop?category=Dresses" onClick={() => setMenuOpen(false)}>Dresses <ArrowRight size={18} /></Link><Link href="/shop?category=Sets" onClick={() => setMenuOpen(false)}>Sets <ArrowRight size={18} /></Link><Link href="/#journal" onClick={() => setMenuOpen(false)}>Journal <ArrowRight size={18} /></Link><Link href="/account" onClick={() => setMenuOpen(false)}>Account <ArrowRight size={18} /></Link></div></div>}
    </>
  );
}

export function Footer() {
  return <footer className="footer"><div><div className="wordmark footer-mark">SEISZN</div><p className="footer-note">Modern wardrobe, quiet confidence.<br/>Designed in India.</p></div><div className="footer-grid"><div><span className="eyebrow">Explore</span><Link href="/shop">Shop all</Link><Link href="/shop?category=Dresses">Dresses</Link><Link href="/shop?category=Sets">Sets</Link></div><div><span className="eyebrow">Help</span><Link href="/account">Account</Link><Link href="/cart">Cart</Link><a href="mailto:hello@seiszn.in">Contact</a></div><div><span className="eyebrow">Follow</span><a href="#">Instagram</a><a href="#">Pinterest</a><a href="#">YouTube</a></div></div><div className="footer-bottom"><span>© 2026 Seiszn</span><span>Made for the season.</span></div></footer>;
}

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  return <article className="product-card"><Link href={`/product/${product.slug}`} className="product-image-wrap"><img src={product.image} alt={product.imageAlt} className="product-image" /><div className="product-overlay"><span>View piece <ArrowRight size={14} /></span></div>{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`heart-button ${liked ? 'liked' : ''}`} onClick={(e) => { e.preventDefault(); setLiked(!liked); }} aria-label="Save product"><Heart size={18} fill={liked ? 'currentColor' : 'none'} /></button></Link><div className="product-meta"><div><Link href={`/product/${product.slug}`} className="product-name">{product.name}</Link><span className="product-color">{product.color}</span></div><div className="price-wrap"><span>{formatINR(product.price)}</span>{product.compareAt && <del>{formatINR(product.compareAt)}</del>}</div></div></article>;
}

export function ProductGrid({ items }: { items: Product[] }) { return <div className="product-grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>; }

export function Newsletter() { return <section className="newsletter"><div><span className="eyebrow">The Seiszn Letter</span><h2>First look.<br/>Only the good stuff.</h2></div><form onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="Your email address" aria-label="Email address" /><button type="submit">Join <ArrowRight size={18} /></button><p>New drops, private edits and occasional notes.</p></form></section>; }
