# Feature Spec: Neo Seoul E-Commerce ("The Curator")

## Summary

The Curator is a mobile-first premium e-commerce application targeting the South Korean market, built with Next.js, React, and Tailwind CSS. It replicates the core shopping experience of platforms like Coupang — spanning discovery, search, product detail, cart, checkout, and post-purchase flows across 7 screens. All data is served from structured mock JSON, all currency is KRW (₩), all UI copy is in English (accessible to non-Korean speakers), and the visual language follows a strict design system centered on Plus Jakarta Sans, Trust Blue (#0050cb), and tonal surface layering without 1px borders.

---

## User Stories

1. As a shopper, I want to browse a curated home feed with category tabs, a flash sale banner, and editorial sections so that I can discover products without knowing exactly what I'm looking for.
2. As a shopper, I want to tap the search bar and filter/sort results by price, brand, and popularity so that I can quickly narrow down to relevant products.
3. As a shopper, I want to view a full product detail page with images, pricing, delivery guarantees, reviews, and Q&A so that I can make an informed purchase decision.
4. As a shopper, I want to add items to my cart and see the cart badge update instantly so that I know my selections are saved.
5. As a shopper, I want to review my cart grouped by delivery type with order summary math so that I understand exactly what I'm paying before proceeding.
6. As a shopper, I want to complete checkout by selecting a shipping address, applying coupons/points, and choosing a payment method so that I can finalize my purchase in a single flow.
7. As a shopper, I want to see a clear payment success screen with my order number, ETA, and a "Track My Order" CTA so that I have confidence my order was placed correctly.
8. As a shopper, I want a My Page screen that shows my profile, Rocket Member status, loyalty points/coupons, and a full order tracking pipeline so that I can manage my account and follow active deliveries.
9. As a shopper, I want a persistent BottomNavBar (Home, Category, Search, Cart, My Page) so that I can navigate the app from any screen without losing context.
10. As a shopper, I want to use "Buy Now" to skip the cart and go directly to checkout so that I can purchase a single item without modifying my saved cart.

---

## Acceptance Criteria

**Navigation**
- AC-1: A BottomNavBar with five tabs — Home, Category, Search, Cart, My Page — is visible and functional on all 7 screens. The active tab is highlighted with the primary color (#0050cb).
- AC-2: The Cart tab displays a numeric badge reflecting the current total item count in the cart. The badge updates immediately when an item is added.
- AC-3: Tapping the Back affordance (TopAppBar back arrow or browser back) on Search Results, Product Detail, Cart, Checkout, Payment Success, and My Page returns the user to the previous logical screen.

**Home / Discovery (Screen 1)**
- AC-4: The TopAppBar renders the app name or logo on the left and a tappable search icon on the right. Tapping the search icon navigates to the Search Results screen with an empty/focused search bar.
- AC-5: Category tabs (Home, Rocket Fresh, Best, Gold Box, Rocket Delivery) scroll horizontally. The active tab has a bottom indicator in #0050cb. Tab switching does not navigate away — it filters the content area.
- AC-6: A hero banner for "Flash Sale" occupies full width below the category tabs with a gradient overlay and promotional copy.
- AC-7: The Gold Box section includes a live countdown timer (HH:MM:SS) counting down to the end of the sale. On reaching 00:00:00 the timer resets or shows "Ended".
- AC-8: The Gold Box section renders a 2-column product grid with at minimum 4 products, each showing image, name, discounted price (₩), and discount percentage badge.
- AC-9: The Rocket Delivery section renders as a horizontal scrollable row of product cards. Each card shows image, name, and price.
- AC-10: "The Weekly Edit" section renders at least 2 editorial cards with large images and overlaid title text, styled as tall portrait cards.
- AC-11: A FAB (Floating Action Button) is rendered above the BottomNavBar, consistent with the Glass Rule (85% opacity, 20px backdrop-blur).

**Search Results (Screen 2)**
- AC-12: The screen has a search bar pre-populated with the current query. The user can edit the query and re-search.
- AC-13: A "Rocket Delivery" filter toggle pill is rendered. When active, the product grid is filtered to only show items with `rocket_delivery: true`.
- AC-14: Sort/filter chips are rendered for Price Range, Brand, and Most Popular. Tapping each chip applies the corresponding sort to the displayed products.
- AC-15: A product count label (e.g., "128 Products") is shown above the product grid.
- AC-16: Products render in a 2-column grid. Each card shows: product image, brand name, product title, discounted price (₩), original price with strikethrough (if discounted), discount percentage badge, and a Rocket Delivery icon/label if applicable.
- AC-17: A "Loading more results" skeleton or spinner appears at the bottom of the list when there are additional mock items to load.

**Product Detail (Screen 3)**
- AC-18: The product image is displayed at full width at the top of the screen with a discount badge overlaid.
- AC-19: Product title, discounted price (₩, large), and original price (₩, strikethrough, smaller) are rendered below the image.
- AC-20: A star rating (filled stars to one decimal) and review count (e.g., "(2,847)") are displayed inline.
- AC-21: A "Tomorrow Arrival Guaranteed" delivery info row is rendered if the product has `rocket_delivery: true`.
- AC-22: A "Product Description" section is collapsible/expandable.
- AC-23: A Reviews section shows the aggregate star rating, total review count, and at least 3 sample review cards.
- AC-24: A Q&A section shows at least 2 sample Q&A entries.
- AC-25: A sticky bottom action bar is always visible containing "Add to Cart" and "Buy Now" buttons.
- AC-26: Tapping "Add to Cart" shows a toast notification and increments the cart badge. It does NOT navigate away.
- AC-27: Tapping "Buy Now" navigates directly to the Checkout screen, passing the single product as the order item.

**Shopping Cart (Screen 4)**
- AC-28: A "Select All" checkbox toggles the selected state of all cart items.
- AC-29: A "Delete Selected" action removes all checked items from the cart.
- AC-30: Cart items are grouped into sections by delivery type: "Rocket Delivery" and "Standard Delivery".
- AC-31: Each cart item card shows: product image, brand, product name, price (₩), quantity stepper (− / count / +), and delete control.
- AC-32: The quantity stepper enforces a minimum of 1 and a maximum of 99.
- AC-33: The Order Summary section shows subtotal, delivery fee, discounts, and total — all updating reactively.
- AC-34: "Proceed to Checkout" CTA navigates to the Checkout screen with all current cart items.

**Checkout / Payment (Screen 5)**
- AC-35: A shipping address block shows the mock user's default address with a non-functional "Change" button.
- AC-36: An order summary section lists each item in a compact format.
- AC-37: A Points & Benefits section allows applying Coupang Cash, reducing the total reactively.
- AC-38: Payment method tabs (CoupangPay, NaverPay, KakaoPay, Credit/Debit) are selectable with CoupangPay as default.
- AC-39: The price breakdown shows subtotal, delivery fee, discounts, and final total.
- AC-40: The "Pay Now" CTA navigates to Payment Success.

**Payment Success (Screen 6)**
- AC-41: A success icon with entrance animation is displayed prominently.
- AC-42: A success headline and subheadline confirm the order was placed.
- AC-43: Rocket Delivery ETA is shown.
- AC-44: Order number, total paid, and payment method are displayed.
- AC-45: A purchased item summary is rendered.
- AC-46: "Track My Order" navigates to My Page; "Continue Shopping" navigates to Home.

**My Page / Order Tracking (Screen 7)**
- AC-47: A profile header shows avatar, display name, and "Rocket Member" badge.
- AC-48: A stats row shows Coupons, Points, Gift Cards tiles.
- AC-49: An order tracking pipeline renders four stages with the current stage highlighted.
- AC-50: A "Recent Orders" section lists at least 2 mock orders with status badges.
- AC-51: A menu list renders 7 items as tappable rows.
- AC-52: Menu rows follow the No-Line Rule (no 1px dividers).

**Design System Compliance**
- AC-53: No 1px border lines are used for section separation. Tonal surface shifts are the sole sectioning mechanism.
- AC-54: All floating elements use 85% opacity and 20px backdrop-blur per the Glass Rule.
- AC-55: All primary CTA buttons use `linear-gradient(135deg, #0050cb, #0066ff)`.
- AC-56: All ambient shadows use `box-shadow: 0 8px 24px rgba(0, 80, 203, 0.08)`.
- AC-57: Ghost borders use outline_variant at 15% opacity.
- AC-58: Plus Jakarta Sans is loaded and applied globally.

---

## Screen Specifications

### Screen 1: Home / Discovery

**Layout:**
- Fixed TopAppBar (56px): logo/wordmark left, search icon right. Glass Rule applied.
- Horizontally scrollable category tabs below TopAppBar. Active: #0050cb text + 2px bottom indicator.
- Vertical scroll content: Hero Banner → Gold Box → Rocket Delivery → Weekly Edit.
- FAB: bottom-right, 56x56px, Trust Blue gradient, Glass Rule.
- Fixed BottomNavBar (64px), Glass Rule.

**Hero Banner:** Full-width, ~200px height. Gradient overlay (dark navy to transparent) over lifestyle image. "FLASH SALE" badge + promotional copy.

**Gold Box:** Section header with countdown timer (HH:MM:SS) in Urgency Amber. 2-column grid, minimum 4 products. Each card: white surface, ambient shadow, 8px radius, discount badge, product name, price.

**Rocket Delivery:** Horizontal scroll, hidden scrollbar. Cards ~160px wide with image, name, price, rocket icon.

**The Weekly Edit:** 2 portrait editorial cards (~280px tall) with lifestyle images, overlaid labels, and title text.

### Screen 2: Search Results

**Layout:** TopAppBar with full-width search input. Filter/sort row below. Product count label. 2-column grid. BottomNavBar.

**Filters:** "Rocket Delivery" toggle pill. Sort chips: Price, Brand, Most Popular. Active chip: Trust Blue filled.

**Product Grid:** 2-column, 8px gap. Cards show image, discount badge, rocket badge, brand, name, prices.

**Pagination:** IntersectionObserver or button loads next batch from mock array. Skeleton loading state.

### Screen 3: Product Detail

**Layout:** No TopAppBar — transparent back arrow over product image. Full-width hero image. Scrollable content below. Sticky bottom action bar.

**Content:** Brand → Title → Prices → Rating → Delivery Info → Expandable Description → Reviews (3 samples) → Q&A (2 samples).

**Sticky Bar:** Glass Rule. Two equal buttons: "Add to Cart" (ghost) + "Buy Now" (primary gradient).

### Screen 4: Shopping Cart

**Layout:** TopAppBar with "Shopping Cart" title. Select-all/delete row. Grouped delivery sections. Order Summary. Fixed CTA bar.

**Cart Items:** Grouped by rocket_delivery. Each card: image (72x72), brand, name, price, quantity stepper, delete, checkbox.

**Order Summary:** surface_container_low background. Subtotal, delivery fee, discounts, total — all reactive.

### Screen 5: Checkout / Payment

**Layout:** TopAppBar with "Checkout" title. Shipping address → Order items → Points/Benefits → Payment method tabs → Price breakdown → Fixed CTA.

**Payment Methods:** CoupangPay (default), NaverPay, KakaoPay, Credit/Debit as segmented tabs.

### Screen 6: Payment Success

**Layout:** Full-screen centered. Animated success icon → headline → ETA row → order summary → two CTA buttons stacked.

**Success Icon:** 80x80px circle, Trust Blue gradient, white checkmark, scale animation on mount.

### Screen 7: My Page / Order Tracking

**Layout:** TopAppBar → Profile Header → Stats Row → Order Pipeline → Recent Orders → Menu List → BottomNavBar.

**Order Pipeline:** 4-stage horizontal stepper. Completed=filled blue, Current=blue with ring, Future=gray outline.

**Menu List:** 7 rows, no dividers (No-Line Rule), right chevrons, tonal shifts.

---

## Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) + React 18 | App Router enables per-route layouts. Architecture is production-realistic. |
| Styling | Tailwind CSS v3 + custom tokens | Design system tokens as Tailwind config. No magic numbers. |
| State | React Context (`CartContext`, `UserContext`) | Sufficient for mock scope. No persistence needed. |
| Routing | Next.js file-based (App Router) | 1:1 route-to-screen mapping. Dynamic `/product/[id]`. |
| Data | Static TS files in `/src/data/` | Structured like real API responses. Zero network dependency. |
| Currency | KRW (₩), no decimals | `Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })` |
| Fonts | Plus Jakarta Sans via `next/font/google` | Zero-flash loading with Next.js font optimization. |
| Auth | None; static mock user | Always "logged in" via hardcoded user in UserContext. |
| Animation | CSS transitions + Tailwind animate classes | No animation library needed. |
| Toast | Custom `useToast` hook + portal | Auto-dismiss 2500ms, positioned above BottomNavBar. |
| UI Language | English throughout | All labels, buttons, headings, toasts, and mock content in English. Currency remains KRW (₩). Accessible to non-Korean speakers. |

---

## Data Model

### Types (`/src/types/index.ts`)

```typescript
export interface Product {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;           // discounted price in KRW
  original_price: number;  // pre-discount price (= price if no discount)
  discount_pct: number;    // 0 if none, else integer e.g. 38
  rocket_delivery: boolean;
  rating: number;
  review_count: number;
  popularity_score: number;
  description: string;
  reviews: Review[];
  qa: QAItem[];
}

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  date: string;
  body: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'preparing' | 'shipping' | 'delivered';
  items: { product: Product; quantity: number }[];
  total: number;
  payment_method: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  coupang_cash: number;
  stats: { coupons: number; points: number; gift_cards: number };
  orders: Order[];
  is_rocket_member: boolean;
}

export interface Address {
  recipient: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  postal_code: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta_label: string;
}
```

### Mock Data (`/src/data/`)

- `products.ts` — 20+ products with full details, reviews, Q&A
- `mock-data.ts` — user profile, banners, goldbox config, rocket products, weekly edit, initial cart items

---

## Navigation & Routing

### Routes

```
/                    → Home / Discovery
/search?q={query}    → Search Results
/product/[id]        → Product Detail
/cart                → Shopping Cart
/checkout            → Checkout / Payment
/payment-success     → Payment Success
/my-page             → My Page / Order Tracking
```

### File Structure

```
src/app/
  layout.tsx              ← root: font, contexts, BottomNavBar, ToastContainer
  page.tsx                ← Home
  search/page.tsx         ← Search Results
  product/[id]/page.tsx   ← Product Detail
  cart/page.tsx            ← Shopping Cart
  checkout/page.tsx        ← Checkout
  payment-success/page.tsx ← Payment Success
  my-page/page.tsx         ← My Page

src/components/
  layout/    ← BottomNavBar, TopAppBar, FAB
  ui/        ← ProductCard, Toast, Skeleton, StepperButton, Badge, CountdownTimer
  home/      ← HeroBanner, GoldBoxSection, RocketDeliverySection, WeeklyEdit, CategoryTabs
  search/    ← FilterRow, ProductGrid
  product/   ← ProductImages, DeliveryInfo, ExpandableDescription, ReviewsSection, QASection, StickyActionBar
  cart/      ← CartItemCard, DeliveryGroup, OrderSummary
  checkout/  ← AddressBlock, PointsBenefits, PaymentMethodTabs, PriceBreakdown
  my-page/   ← ProfileHeader, StatsRow, OrderTrackingPipeline, RecentOrders, MenuList

src/context/ ← CartContext, UserContext
src/hooks/   ← useToast, useCountdown
src/data/    ← products, mock-data
src/types/   ← index.ts
```

### BottomNavBar

| Tab | Icon | Route |
|---|---|---|
| Home | home | `/` |
| Category | grid_view | `/` (no-op) |
| Search | search | `/search` |
| Cart | shopping_bag | `/cart` |
| My Page | person | `/my-page` |

Active tab determined by `usePathname()`. Cart badge shows item count from CartContext.

---

## Out of Scope

1. Real authentication / login flow
2. Real payment processing
3. Real API calls
4. Category browse screen
5. Address management screen
6. Notifications / push alerts
7. Image search / barcode scan
8. Wishlist / saved items
9. Product image carousel (single image only)
10. Network-backed infinite scroll
11. Internationalization (i18n)
12. Dark mode
13. Accessibility audit
14. Unit / integration tests
15. SEO / metadata
16. Server-side rendering of dynamic data

---

## Evaluator Criteria Hints

- **Feature type:** UI-heavy / frontend implementation
- **Weight overrides:**
  - Design fidelity: **35%** — No-Line Rule, Glass Rule, gradient CTAs, ambient shadows, font compliance
  - Functionality completeness: **30%** — All 7 screens reachable, cart math correct, timer works, filters work
  - Code quality & consistency: **20%** — Component decomposition, TypeScript types, Tailwind config tokens
  - Copy accuracy: **10%** — All labels in English as specified, currency in KRW
  - Navigation correctness: **5%** — All user flow paths reachable without dead ends
- **Key quality signals:**
  - Zero 1px border lines — all sectioning via tonal surface shifts
  - BottomNavBar and sticky bars visually "floating" with Glass Rule
  - Countdown timer updates every second without layout shift
  - Cart total flows consistently through Cart → Checkout → Payment Success
  - Search + Rocket Delivery filter produces correct filtered grid
  - Order tracking pipeline highlights correct stage
  - All interactive elements have hover/active states
  - Prices formatted as Korean Won with thousands separators (e.g., ₩149,000)
