'use client';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { products, formatINR } from '@/lib/data';
import { ProductGrid } from '@/components/store-shell';

export default function ProductPage() {
  const { slug } = useParams<{slug:string}>();
  const router = useRouter();
  const product = products.find((p) => p.slug === slug);
  const [size, setSize] = useState(product?.sizes[1] || product?.sizes[0] || '');
  const [added, setAdded] = useState(false);
  const [open, setOpen] = useState('Details');
  const related = useMemo(() => product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [], [product]);
  if (!product) return <main className="error-page"><div><span className="eyebrow">Seiszn</span><h1>404</h1><p className="muted">This piece could not be found.</p><Link href="/shop" className="button-dark" style={{marginTop:20}}>Back to shop</Link></div></main>;
  const add = () => { setAdded(true); setTimeout(() => router.push('/cart'), 450); };
  return <main><section className="product-detail"><div className="gallery">{product.gallery.map((src,i) => <img key={src} src={src} alt={`${product.name} view ${i+1}`} />)}</div><aside className="detail-panel"><span className="eyebrow">{product.category} / {product.color}</span><h1>{product.name}</h1><div className="detail-price">{formatINR(product.price)} {product.compareAt && <del className="muted"> {formatINR(product.compareAt)}</del>}</div><p className="detail-copy">{product.description}</p><div className="detail-row"><span className="label">Select size</span><div className="size-row">{product.sizes.map((s) => <button key={s} className={`size-button ${s===size ? 'active':''}`} onClick={() => setSize(s)}>{s}</button>)}</div><p className="detail-note">Free size exchange within 7 days. See size guide at checkout.</p></div><button className="add-button" onClick={add}>{added ? <><Check size={16}/> Added</> : <>Add to bag <ArrowRight size={16}/></>}</button><div className="detail-row"><button className="sr-only" aria-hidden="true" />{['Details','Shipping & returns','Care'].map((x)=><div key={x} style={{borderTop:'1px solid var(--line)',padding:'15px 0'}}><button onClick={()=>setOpen(open===x?'':x)} style={{width:'100%',background:'transparent',border:0,display:'flex',justifyContent:'space-between',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',padding:0}}>{x}<ChevronDown size={15}/></button>{open===x && <p className="detail-note" style={{marginTop:12}}>{x==='Details' ? 'Designed for an easy drape with a clean finish and a soft hand feel.' : x==='Shipping & returns' ? 'Dispatch in 1–3 business days. Easy returns on eligible pieces.' : 'Cold wash, inside out. Line dry. Press gently on low heat.'}</p>}</div>)}</div><Link href="/shop" className="text-link" style={{marginTop:24}}>Back to shop <ArrowRight size={15}/></Link></aside></section>{related.length>0 && <section className="section"><div className="section-head"><div><span className="eyebrow">You may also like</span><h2>More to love.</h2></div></div><ProductGrid items={related}/></section>}</main>;
}
