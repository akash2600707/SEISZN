# Seiszn Frontend — V1

A GitHub-ready Next.js storefront prototype for Seiszn. This is the **frontend-only** phase: no real authentication, database, payments, inventory, or order creation is connected yet.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Plain CSS with responsive breakpoints
- Lucide icons
- Mock catalog data in `lib/data.ts`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main routes

- `/` — editorial homepage
- `/shop` — collection grid with category and sort controls
- `/product/muse-drape-maxi` — product detail example
- `/cart` — mock cart flow
- `/account` — customer account shell

## Backend phase mapping

The UI is deliberately separated from backend concerns. Later, replace the mock layer with:

- Supabase Auth → `/account`
- Supabase Products/Variants → `lib/data.ts` consumers
- Supabase Cart/Orders → `/cart` and checkout
- Razorpay → checkout payment step
- Shiprocket → post-payment shipping/order fulfillment

## Image note

The prototype uses Unsplash-hosted editorial images for visual design. Replace these with Seiszn-owned product/editorial assets before production.

## GitHub upload

Create a new GitHub repository, then upload the contents of this folder. Do **not** upload `node_modules` or `.next`.
