export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  color: string;
  sizes: string[];
  badge?: string;
  description: string;
  image: string;
  imageAlt: string;
  gallery: string[];
};

const photos = {
  dress1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
  dress2: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
  dress3: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
  dress4: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85',
  dress5: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
  dress6: 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=1200&q=85',
  dress7: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
  dress8: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85'
};

export const products: Product[] = [
  { id: 'S001', slug: 'muse-drape-maxi', name: 'Muse Drape Maxi', category: 'Dresses', price: 1899, color: 'Ivory', sizes: ['S', 'M', 'L', 'XL'], badge: 'New', description: 'Fluid drape, soft structure and a clean neckline designed for effortless movement.', image: photos.dress1, imageAlt: 'Ivory draped maxi dress', gallery: [photos.dress1, photos.dress2, photos.dress3] },
  { id: 'S002', slug: 'afterglow-satin-dress', name: 'Afterglow Satin Dress', category: 'Dresses', price: 2299, compareAt: 2599, color: 'Mocha', sizes: ['S', 'M', 'L'], badge: 'Bestseller', description: 'A minimal satin silhouette with an easy bias cut and subtle sheen.', image: photos.dress2, imageAlt: 'Mocha satin dress', gallery: [photos.dress2, photos.dress4, photos.dress5] },
  { id: 'S003', slug: 'quiet-romance-midi', name: 'Quiet Romance Midi', category: 'Dresses', price: 1699, color: 'Rose', sizes: ['S', 'M', 'L', 'XL'], description: 'A feminine everyday midi with a soft waist and softly gathered skirt.', image: photos.dress3, imageAlt: 'Rose midi dress', gallery: [photos.dress3, photos.dress6, photos.dress1] },
  { id: 'S004', slug: 'studio-line-set', name: 'Studio Line Set', category: 'Sets', price: 2499, compareAt: 2799, color: 'Charcoal', sizes: ['S', 'M', 'L'], badge: 'Limited', description: 'A tailored co-ord built for sharp mornings and late evenings.', image: photos.dress4, imageAlt: 'Charcoal fashion set', gallery: [photos.dress4, photos.dress7, photos.dress8] },
  { id: 'S005', slug: 'sunroom-shirt-dress', name: 'Sunroom Shirt Dress', category: 'Dresses', price: 1999, color: 'Butter', sizes: ['S', 'M', 'L', 'XL'], description: 'An airy shirt-dress with an elongated line and relaxed sleeve.', image: photos.dress5, imageAlt: 'Butter yellow shirt dress', gallery: [photos.dress5, photos.dress2, photos.dress7] },
  { id: 'S006', slug: 'midnight-slip', name: 'Midnight Slip', category: 'Dresses', price: 1599, color: 'Black', sizes: ['S', 'M', 'L'], description: 'Clean, pared-back and easy to layer. Your after-dark essential.', image: photos.dress6, imageAlt: 'Black slip dress', gallery: [photos.dress6, photos.dress3, photos.dress4] },
  { id: 'S007', slug: 'soft-focus-top', name: 'Soft Focus Top', category: 'Tops', price: 999, color: 'Cream', sizes: ['S', 'M', 'L', 'XL'], badge: 'New', description: 'A sculpted jersey top that pairs with tailoring, denim and everything between.', image: photos.dress7, imageAlt: 'Cream fashion top', gallery: [photos.dress7, photos.dress5, photos.dress8] },
  { id: 'S008', slug: 'linework-trouser', name: 'Linework Trouser', category: 'Bottoms', price: 1499, color: 'Stone', sizes: ['S', 'M', 'L', 'XL'], description: 'High-rise trousers with an uninterrupted vertical line and relaxed drape.', image: photos.dress8, imageAlt: 'Stone trousers', gallery: [photos.dress8, photos.dress4, photos.dress6] }
];

export const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Sets'];
export const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;
