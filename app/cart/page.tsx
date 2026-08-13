'use client';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatINR, products } from '@/lib/data';

const initial = [{product: products[0], size: 'M', qty: 1}, {product: products[4], size: 'S', qty: 1}];
export default function CartPage(){
  const [items,setItems] = useState(initial);
  const change=(id:string,delta:number)=>setItems(items.map(i=>i.product.id===id?{...i,qty:Math.max(1,i.qty+delta)}:i));
  const remove=(id:string)=>setItems(items.filter(i=>i.product.id!==id));
  const subtotal=items.reduce((s,i)=>s+i.product.price*i.qty,0); const shipping=subtotal>=1999||subtotal===0?0:99; const total=subtotal+shipping;
  return <main className="cart-page"><span className="eyebrow">Your selection</span><h1>Shopping bag.</h1>{!items.length?<div className="empty-state"><p className="muted">Your bag is empty.</p><Link className="button-dark" href="/shop" style={{marginTop:20}}>Continue shopping <ArrowRight size={16}/></Link></div>:<div className="cart-layout"><div>{items.map(({product,size,qty})=><article className="cart-item" key={product.id}><img className="cart-thumb" src={product.image} alt={product.imageAlt}/><div><h3>{product.name}</h3><small>{product.color} · Size {size}</small><div className="cart-actions"><div className="qty"><button onClick={()=>change(product.id,-1)} aria-label="Decrease"><Minus size={13}/></button><span>{qty}</span><button onClick={()=>change(product.id,1)} aria-label="Increase"><Plus size={13}/></button></div><button className="remove" onClick={()=>remove(product.id)}><Trash2 size={13} style={{display:'inline',verticalAlign:'middle',marginRight:5}}/>Remove</button></div></div><div style={{fontSize:13}}>{formatINR(product.price*qty)}</div></article>)}</div><aside className="summary"><span className="eyebrow">Summary</span><div className="summary-line"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div><div className="summary-line"><span>Shipping</span><span>{shipping===0?'Free':formatINR(shipping)}</span></div><div className="summary-line summary-total"><span>Total</span><span>{formatINR(total)}</span></div><button className="add-button" style={{marginTop:22}}>Continue to checkout <ArrowRight size={16}/></button><p className="detail-note">Payment and order creation will be connected in the backend phase.</p></aside></div>}</main>
}
