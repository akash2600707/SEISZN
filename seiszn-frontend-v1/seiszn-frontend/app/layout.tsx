import './globals.css';
import { Header, Footer } from '@/components/store-shell';

export const metadata = {
  title: 'Seiszn — Modern wardrobe, quiet confidence',
  description: 'Seiszn women’s fashion — considered pieces for the season.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header />{children}<Footer /></body></html>;
}
