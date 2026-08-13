import Link from 'next/link';
export default function NotFound(){return <main className="error-page"><div><span className="eyebrow">Seiszn</span><h1>404</h1><p className="muted">This page wandered off.</p><Link href="/" className="button-dark" style={{marginTop:20}}>Back home</Link></div></main>}
