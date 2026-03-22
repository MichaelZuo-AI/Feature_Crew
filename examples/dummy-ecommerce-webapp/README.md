# Dummy E-Commerce Webapp

A mobile-first e-commerce app inspired by Coupang, with a full shopping flow from product discovery to checkout. Built end-to-end with [Feature Crew](../../README.md) from a Stitch design spec.

## Try It

```bash
npm install
npm run dev    # → http://localhost:3000
npm test       # Vitest
```

No environment variables needed — uses mock data only.

## Features

- **Discovery feed** — category tabs (Home, Rocket Fresh, Best, Gold Box, Rocket Delivery) with hero banner
- **Gold Box deals** — limited-time offers with live countdown timer
- **Product search** — full-text search with price range, brand, and popularity filters
- **Product detail** — images, KRW pricing, delivery guarantees, reviews, Q&A
- **Shopping cart** — add/remove, quantity adjustment, item selection for checkout
- **Checkout flow** — shipping address, coupons/points, payment methods (CoupangPay, NaverPay, KakaoPay, Credit/Debit)
- **Order confirmation** — order number, ETA, tracking CTA
- **My Page** — profile, Rocket Member status, loyalty points, full order history with status tracking
- **Bottom navigation** — persistent 5-tab navbar (Home, Category, Search, Cart, My Page)
- **Buy Now** — skip cart for single-item purchases

## Tech Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Vitest

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home/discovery feed
│   ├── product/[id]/page.tsx    # Product detail
│   ├── search/page.tsx          # Search results
│   ├── cart/page.tsx            # Shopping cart
│   ├── checkout/page.tsx        # Checkout flow
│   ├── payment-success/page.tsx # Order confirmation
│   └── my-page/page.tsx         # User profile & orders
├── components/
│   ├── layout/                  # TopAppBar, BottomNavBar, FAB
│   ├── home/                    # CategoryTabs, HeroBanner, GoldBoxSection, etc.
│   └── ui/                      # ProductCard, Badge, Skeleton
├── context/                     # CartContext, UserContext, ToastContext
├── data/
│   ├── products.ts              # ~25 mock products with reviews & Q&A
│   └── mock-data.ts             # Initial cart, user data
├── hooks/                       # useCountdown, useToast
├── lib/format.ts                # KRW price formatting utilities
└── types/index.ts               # Product, CartItem, Order, User types
```

## Design

Mobile-first with 448px max-width. Editorial aesthetic — no 1px borders, tonal surface shifts, gradient CTAs, glass-effect floating elements. All prices in KRW (₩). See the full design system in [`design_spec/`](design_spec/).

## How It Was Built

This example went through the full Feature Crew pipeline starting from a Stitch design spec. The `docs/superpowers/feature-crew/` directory contains the spec, implementation plan, evaluation rounds, and QA reports.
