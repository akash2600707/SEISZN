'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/store-shell';
import { categories, products } from '@/lib/data';

export default function ShopPage() {
  const params = useSearchParams();
  const initial = params.get('category') || 'All';
  const [category, setCategory] = useState(initial);
  const [sort, setSort] = useState('Featured');
  const visible = useMemo(() => {
    const base = category === 'All' ? products : products.filter((p) => p.category === category);
    if (sort === 'Price: Low to High') return [...base].sort((a,b) => a.price-b.price);
    if (sort === 'Price: High to Low') return [...base].sort((a,b) => b.price-a.price);
    return base;
  }, [category, sort]);
  return <main className="shop-page"><div className="shop-hero"><div><span className="eyebrow">The collection</span><h1>Shop all.</h1></div><p>Pieces with enough personality to stand alone and enough ease to become everyday.</p></div><div className="shop-toolbar"><div className="chip-row">{categories.map((c) => <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}</div><select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products"><option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option></select></div>{visible.length ? <ProductGrid items={visible} /> : <div className="empty-state"><p>Nothing here yet.</p></div>}</main>;
}
