import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Newsletter, ProductGrid } from '@/components/store-shell';
import { products } from '@/lib/data';

export default function Home() {
  return <main>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">Seiszn / 2026 edit</span><h1>Wear the<br/><em>moment.</em></h1><p className="hero-lede">Quiet pieces with a little edge. Designed for the plans you make and the ones you don’t.</p><Link href="/shop" className="button-dark">Shop the edit <ArrowRight size={17}/></Link></div>
      <div className="hero-art"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=90" alt="Seiszn seasonal fashion editorial"/><div className="hero-caption">The new rhythm — 01</div></div>
    </section>

    <section className="section"><div className="section-head"><div><span className="eyebrow">A considered selection</span><h2>New in.</h2></div><Link href="/shop" className="text-link">View all <ArrowRight size={15}/></Link></div><ProductGrid items={products.slice(0,4)} /></section>

    <div className="ticker"><div className="ticker-track"><span>SEISZN — new perspective</span><span>✳</span><span>SEISZN — made to move</span><span>✳</span><span>SEISZN — quiet confidence</span><span>✳</span><span>SEISZN — new perspective</span><span>✳</span></div></div>

    <section className="editorial"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90" alt="Woman wearing Seiszn inspired neutral fashion"/></div><div className="editorial-copy"><span className="eyebrow">The everyday edit</span><h2>Nothing loud.<br/>Nothing ordinary.</h2><p>We’re interested in the space between effortless and unforgettable. Clean lines, feminine movement and pieces that become your own.</p><Link href="/shop" className="text-link">Explore the collection <ArrowRight size={15}/></Link></div></section>

    <section className="section"><div className="section-head"><div><span className="eyebrow">Find your mood</span><h2>Shop by feeling.</h2></div></div><div className="categories">{[
      ['Dresses','https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85'],['Tops','https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85'],['Bottoms','https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85'],['Sets','https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85']
    ].map(([name,img]) => <Link href={`/shop?category=${name}`} className="category-tile" key={name}><img src={img} alt=""/><div className="category-overlay"><strong>{name}</strong><span>Explore</span></div></Link>)}</div></section>

    <section className="section journal" id="journal"><div className="section-head"><div><span className="eyebrow">Seiszn journal</span><h2>Notes on the season.</h2></div></div><div className="journal-grid"><article className="journal-card"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85" alt="Minimal fashion editorial"/><span className="eyebrow">01 / Perspective</span><h3>Getting dressed, without overthinking it.</h3><p>A simple wardrobe can still have a point of view. Here’s how we build one.</p></article><article className="journal-card"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85" alt="Fashion editorial portrait"/><span className="eyebrow">02 / Objects</span><h3>The pieces we keep reaching for.</h3><p>Five quiet essentials that earn their place by doing a little more.</p></article></div></section>
    <Newsletter />
  </main>;
}
