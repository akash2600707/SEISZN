-- Run this in your Supabase SQL editor

-- Products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  images text[] default '{}',
  category text,
  stock integer default 0,
  weight integer default 500, -- grams
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  razorpay_order_id text unique,
  razorpay_payment_id text,
  status text default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  tracking_url text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping_charge numeric(10,2) default 0,
  total numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table products enable row level security;
alter table orders enable row level security;

-- Products: anyone can read active products
create policy "Public read active products"
  on products for select
  using (is_active = true);

-- Orders: service role only (API routes use admin client)
create policy "Service role full access orders"
  on orders for all
  using (auth.role() = 'service_role');

-- Sample products (replace with your actual Seiszn products)
insert into products (name, slug, description, price, compare_price, images, category, stock, weight) values
  ('Seiszn Classic Tee', 'seiszn-classic-tee', 'Premium quality classic fit t-shirt', 899, 1199, '{}', 'Apparel', 50, 250),
  ('Seiszn Cap', 'seiszn-cap', 'Structured cap with embroidered logo', 699, 999, '{}', 'Accessories', 30, 150),
  ('Seiszn Hoodie', 'seiszn-hoodie', 'Heavyweight fleece hoodie', 1899, 2499, '{}', 'Apparel', 20, 600);
