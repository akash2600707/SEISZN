# Seiszn Store — Deployment Guide

## Stack
- **Frontend + API**: Next.js 14 → Vercel (free)
- **Database**: Supabase (free)
- **Payments**: Razorpay (2% per transaction)
- **Shipping**: Shiprocket (pay per shipment)
- **Domain**: seiszn.in (Spaceship)

---

## Step 1 — Supabase Setup (10 mins)
1. Go to supabase.com → Create new project
2. Go to SQL Editor → paste contents of `supabase-schema.sql` → Run
3. Go to Settings → API → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 2 — Razorpay Setup (5 mins)
1. Go to razorpay.com → Sign up (free)
2. Dashboard → Settings → API Keys → Generate Key
3. Copy Key ID → `RAZORPAY_KEY_ID` + `NEXT_PUBLIC_RAZORPAY_KEY_ID`
4. Copy Key Secret → `RAZORPAY_KEY_SECRET`

## Step 3 — Shiprocket Setup (5 mins)
1. Go to shiprocket.in → Sign up (free)
2. Settings → API → copy email + password
3. Set `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD`
4. Settings → Channels → copy Channel ID → `SHIPROCKET_CHANNEL_ID`

## Step 4 — Vercel Deployment (5 mins)
1. Push this repo to GitHub
2. Go to vercel.com → Import repo
3. Add all env variables from `.env.local.example`
4. Deploy → Vercel gives you a free URL

## Step 5 — Connect seiszn.in (5 mins)
1. In Vercel → Project → Settings → Domains → Add `seiszn.in`
2. In Spaceship → DNS → Add the CNAME/A records Vercel shows
3. Done! seiszn.in now points to your store

## Step 6 — Add Products
1. Go to Supabase → Table Editor → products
2. Add your products with name, slug, price, images, stock
3. For images: upload to Supabase Storage → copy public URL

---

## Adding Products via Supabase Dashboard
```sql
INSERT INTO products (name, slug, description, price, compare_price, images, category, stock, weight)
VALUES ('Your Product', 'your-product', 'Description here', 999, 1299, 
        ARRAY['https://your-image-url.com/img.jpg'], 'Category', 10, 300);
```

## Update WhatsApp Number
In `src/app/orders/[id]/page.tsx` → replace `91XXXXXXXXXX` with your number

---

## Cost Summary
| Service | Monthly Cost |
|---------|-------------|
| Vercel | ₹0 |
| Supabase | ₹0 |
| Razorpay | 2% per order |
| Shiprocket | Per shipment |
| **Total fixed** | **₹0** |
