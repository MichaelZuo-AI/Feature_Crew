# E-Commerce v0.4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 10 new pages to the dummy-ecommerce-webapp demo showcasing diverse UI patterns (wishlist, recently viewed, order detail, flash sale, product comparison, coupon wallet, notification center, returns wizard, brand store, address book) plus navigation integration with existing pages.

**Architecture:** Each page is a Next.js `'use client'` page component under `src/app/`. New data models extend `src/types/index.ts`. Shared state lives in `UserContext` (5 new collections: wishlist, recentlyViewed, coupons, notifications, savedAddresses). Mock data in `src/data/` files. All pages follow the Neo Seoul design system.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Vitest

**Spec:** `docs/superpowers/specs/2026-03-22-ecommerce-v0.4-design.md`

---

## File Structure

### New files
| File | Responsibility |
|------|---------------|
| `src/types/v04.ts` | New type definitions (WishlistItem, RecentView, FlashSale, Coupon, Notification, SavedAddress, ReturnRequest, Brand, OrderDetail, ComparisonSpec) |
| `src/data/flash-sale-data.ts` | Flash sale mock data |
| `src/data/coupons-data.ts` | Coupons mock data |
| `src/data/notifications-data.ts` | Notifications mock data |
| `src/data/brands-data.ts` | Brands mock data |
| `src/data/addresses-data.ts` | Addresses mock data |
| `src/data/wishlist-data.ts` | Wishlist mock data |
| `src/app/wishlist/page.tsx` | Wishlist page |
| `src/app/recently-viewed/page.tsx` | Recently viewed page |
| `src/app/order/[id]/page.tsx` | Order detail page |
| `src/app/flash-sale/page.tsx` | Flash sale event page |
| `src/app/compare/page.tsx` | Product comparison page |
| `src/app/coupons/page.tsx` | Coupon wallet page |
| `src/app/notifications/page.tsx` | Notification center page |
| `src/app/returns/[orderId]/page.tsx` | Returns wizard page |
| `src/app/brand/[brandId]/page.tsx` | Brand store page |
| `src/app/addresses/page.tsx` | Address book page |

### Modified files
| File | Changes |
|------|---------|
| `src/types/index.ts` | Re-export from `v04.ts` |
| `src/context/UserContext.tsx` | Add 5 new collections + CRUD methods |
| `src/components/layout/TopAppBar.tsx` | Add notification bell icon |
| `src/components/layout/BottomNavBar.tsx` | Add returns route to HIDDEN_ROUTES |
| `src/app/my-page/page.tsx` | Add menu links + order tap navigation |
| `src/app/product/[id]/page.tsx` | Add wishlist heart, compare button, brand link, recently viewed tracking |
| `src/app/page.tsx` | Link flash sale banner to `/flash-sale` |
| `src/app/search/page.tsx` | Add compare checkbox + floating CTA |
| `src/app/category/page.tsx` | Link brand cards to `/brand/[brandId]` |

---

## Task 1: Types & Mock Data Foundation

**Files:**
- Create: `src/types/v04.ts`
- Modify: `src/types/index.ts`
- Create: `src/data/wishlist-data.ts`
- Create: `src/data/flash-sale-data.ts`
- Create: `src/data/coupons-data.ts`
- Create: `src/data/notifications-data.ts`
- Create: `src/data/brands-data.ts`
- Create: `src/data/addresses-data.ts`

- [ ] **Step 1: Create v04 types**

Create `src/types/v04.ts`:
```typescript
import { Product, Order } from './index';

export interface WishlistItem {
  productId: string;
  savedAt: string;
  savedPrice: number;
}

export interface RecentView {
  productId: string;
  viewedAt: string;
}

export interface OrderDetail extends Order {
  trackingNumber: string;
  carrier: string;
  statusHistory: {
    status: 'pending' | 'preparing' | 'shipping' | 'delivered';
    timestamp: string;
    description?: string;
  }[];
}

export interface FlashSaleItem {
  productId: string;
  flashPrice: number;
  originalPrice: number;
  claimedPercentage: number;
  totalStock: number;
}

export interface FlashSale {
  id: string;
  title: string;
  endTime: string;
  items: FlashSaleItem[];
  claimsLastHour: number;
}

export interface ComparisonSpec {
  label: string;
  key: keyof Product;
  category: 'general' | 'reviews' | 'delivery';
  bestIs: 'highest' | 'lowest' | 'none';
}

export interface Coupon {
  id: string;
  name: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minSpend: number;
  categories: string[];
  expiresAt: string;
  status: 'available' | 'used' | 'expired';
  usedAt?: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'price_drop' | 'promotion' | 'system';
  title: string;
  body: string;
  link: string;
  createdAt: string;
  readAt: string | null;
}

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  postal_code: string;
  city: string;
  isDefault: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  heroImage: string;
  tagline: string;
  story: string;
  pullQuote: string;
  foundedYear: number;
  avgRating: number;
  productCount: number;
}

export interface ReturnRequest {
  orderId: string;
  items: { productId: string; quantity: number }[];
  reason: string;
  details?: string;
  photos: string[];
  refundAmount: number;
  status: 'submitted';
}
```

- [ ] **Step 2: Re-export from index.ts**

Add to end of `src/types/index.ts`:
```typescript
export type {
  WishlistItem, RecentView, OrderDetail, FlashSaleItem, FlashSale,
  ComparisonSpec, Coupon, Notification, SavedAddress, Brand, ReturnRequest
} from './v04';
```

- [ ] **Step 3: Create all mock data files**

Create 6 data files with mock data. Each file exports arrays of the corresponding types, using product IDs from existing `products.ts` (p001-p020). Brands data should reference the 4 most common brands in products.ts. Flash sale endTime set to 8 hours from now. Coupons include 3 available, 2 used, 1 expired. Notifications include 5 mixed-type entries. Addresses include 2 entries (one default). Wishlist includes 6 items with varied savedAt dates and some with price drops.

- [ ] **Step 4: Verify types compile**

Run: `cd examples/dummy-ecommerce-webapp && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/types/ src/data/
git commit -m "feat(v0.4): add types and mock data for 10 new pages"
```

---

## Task 2: Extend UserContext with New Collections

**Files:**
- Modify: `src/context/UserContext.tsx`

- [ ] **Step 1: Add imports and state**

Add imports for new types and mock data. Add 5 new `useState` hooks:
- `wishlist` initialized from `mockWishlistItems`
- `recentlyViewed` initialized as `[]`
- `coupons` initialized from `mockCoupons`
- `notifications` initialized from `mockNotifications`
- `savedAddresses` initialized from `mockAddresses`

- [ ] **Step 2: Add CRUD methods**

Add `useCallback` methods:
- `addToWishlist(productId, savedPrice)`, `removeFromWishlist(productId)`
- `addRecentView(productId)` — prepends, dedupes, max 50
- `markNotificationRead(id)`, `markAllNotificationsRead()`
- `addAddress(address)`, `updateAddress(id, address)`, `deleteAddress(id)`, `setDefaultAddress(id)`
- `useCoupon(couponId)`

- [ ] **Step 3: Update context value and interface**

Extend `UserContextValue` interface with all new state + methods. Add to `useMemo` value object and dependency array.

- [ ] **Step 4: Verify types compile**

Run: `cd examples/dummy-ecommerce-webapp && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/context/UserContext.tsx
git commit -m "feat(v0.4): extend UserContext with wishlist, recently viewed, coupons, notifications, addresses"
```

---

## Task 3: Wishlist Page

**Files:**
- Create: `src/app/wishlist/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- TopAppBar with "My Wishlist" title, back arrow, "Edit" toggle
- Filter chips: All, In Stock, On Sale, Price Drop (horizontal scroll, single-select)
- 2-column product grid using products lookup from `useUser().wishlist`
- Each card: image, filled heart, brand, name, price with strikethrough, price drop badge
- Edit mode: checkboxes, sticky bottom bar with Delete Selected + Add to Cart
- Empty state
- BottomNavBar

Key patterns: `useState` for editMode, selectedIds, activeFilter. Product lookup via `products.find(p => p.id === item.productId)`. Price drop detection: `product.price < item.savedPrice`.

- [ ] **Step 2: Verify renders**

Run: `cd examples/dummy-ecommerce-webapp && npm run dev`
Navigate to `/wishlist`, verify layout, filter chips, edit mode toggle.

- [ ] **Step 3: Commit**

```bash
git add src/app/wishlist/
git commit -m "feat(v0.4): add wishlist page with filter chips and edit mode"
```

---

## Task 4: Recently Viewed Page

**Files:**
- Create: `src/app/recently-viewed/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- TopAppBar with "Recently Viewed" title, "Clear All" tertiary button
- Date-grouped sections: "Today", "Yesterday", "This Week", "Earlier"
- 2-column compact product cards (image, name, price only)
- Clear all confirmation bottom sheet with glass backdrop
- Empty state

Key patterns: Group `recentlyViewed` by date using helper function. Bottom sheet state via `useState`.

- [ ] **Step 2: Verify renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/recently-viewed/
git commit -m "feat(v0.4): add recently viewed page with date grouping"
```

---

## Task 5: Order Detail Page

**Files:**
- Create: `src/app/order/[id]/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- TopAppBar with "Order #CPN-{id}" title, back arrow
- Status hero section on surface_container_low
- Vertical timeline stepper (4 steps: Pending → Preparing → Shipping → Delivered)
  - Completed: blue dot + solid line + timestamp
  - Active: pulsing dot + bold label
  - Pending: gray dot + dashed line
- Delivery details island with copy-to-clipboard tracking number
- Ordered items list
- "Track Package" gradient CTA + "Request Return" tertiary (links to `/returns/[orderId]`)

Key patterns: Look up order from `useUser().user.orders.find(o => o.id === id)`. Mock `trackingNumber` and `carrier` inline (or extend order data). Timeline stepper is the star component — use CSS animations for pulse.

- [ ] **Step 2: Verify renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/order/
git commit -m "feat(v0.4): add order detail page with timeline stepper"
```

---

## Task 6: Flash Sale Event Page

**Files:**
- Create: `src/app/flash-sale/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- Full-bleed amber-to-primary gradient hero with "MEGA FLASH SALE" display text
- Countdown timer (HH:MM:SS) with individual digit cards, real-time via `useEffect` + `setInterval`
- Product cards (full-width): image left, name + flash price + original strikethrough right
- Stock progress bar per item (amber gradient fill, percentage label)
- Items >90% claimed: pulsing "Almost Gone!" badge
- BUY NOW amber button → `addToCart` + navigate to `/cart`
- Sticky bottom ticker bar
- Sale ended state when timer hits 0

Key patterns: `useEffect` for countdown. `useCart().addToCart` for BUY NOW. Mock data from `flash-sale-data.ts`.

- [ ] **Step 2: Verify renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/flash-sale/
git commit -m "feat(v0.4): add flash sale page with countdown timer and stock bars"
```

---

## Task 7: Product Comparison Page

**Files:**
- Create: `src/app/compare/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- TopAppBar with "Compare Products" title, back arrow
- Read product IDs from URL search params (`?ids=p001,p002`)
- Sticky product header row: product image, name, price, "×" remove button, "+" add slot
- Comparison table with category headers (General, Reviews, Delivery)
- Rows: Rating, Price, Brand, Rocket Delivery, Discount %, Review Count
- Winner highlighting: primary blue pill on best value per row
- Sticky bottom bar: "Add to Cart" per column
- "+" opens bottom sheet with product selector
- Min 2, max 3 products

Key patterns: `useSearchParams()` for initial IDs. `useState` for product list. Comparison spec array defines rows. Winner detection logic per `bestIs` field.

- [ ] **Step 2: Verify renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/compare/
git commit -m "feat(v0.4): add product comparison page with winner highlighting"
```

---

## Task 8: Coupon Wallet Page

**Files:**
- Create: `src/app/coupons/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- TopAppBar with "My Coupons" title, available count badge
- Tab bar: Available, Used, Expired (underline-style)
- Ticket-style coupon cards:
  - Left gradient accent strip
  - Large discount value
  - Coupon name, min spend, categories
  - Dashed cut-out circles on edges (CSS `radial-gradient` trick)
  - Expiry badge with color coding (<7 days amber, <1 day red)
- "Use Now" button on available coupons
- Used tab: dimmed + "USED" stamp
- Expired tab: dimmed + strikethrough
- Empty states per tab

Key patterns: Tab state via `useState`. Filter coupons by status. CSS pseudo-elements for ticket cut-outs.

- [ ] **Step 2: Verify renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/coupons/
git commit -m "feat(v0.4): add coupon wallet page with ticket-style cards"
```

---

## Task 9: Notification Center Page

**Files:**
- Create: `src/app/notifications/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- TopAppBar with "Notifications" title, "Mark All Read" tertiary button
- Grouped sections: Today, This Week, Earlier
- Notification cards: typed icon in colored circle, title (bold if unread), body, time-ago
- Unread blue dot (8px)
- Tap → mark read + navigate to `notification.link`
- Empty state

Key patterns: `useUser().notifications` + `markNotificationRead`. Time-ago helper function. Icon mapping by notification type.

- [ ] **Step 2: Verify renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/notifications/
git commit -m "feat(v0.4): add notification center with grouped sections"
```

---

## Task 10: Returns Wizard Page

**Files:**
- Create: `src/app/returns/[orderId]/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- TopAppBar with "Request Return" title, back arrow
- Guard: redirect if order status ≠ 'delivered' (with toast)
- Horizontal 3-step stepper: Select Items → Reason → Review
- Step 1: selectable item cards with checkboxes, "Next" CTA
- Step 2: radio buttons for reason, conditional photo upload area, textarea, "Back"/"Next"
- Step 3: summary island, refund calculation, "Submit Return" CTA
- Success state with checkmark animation
- Bottom nav hidden

Key patterns: `useState` for step (1-3), selectedItems, reason, details, photos, submitted. Multi-step form with conditional rendering. Add `/returns` to BottomNavBar HIDDEN_ROUTES.

- [ ] **Step 2: Update BottomNavBar**

Add `'/returns'` to `HIDDEN_ROUTES` array in `src/components/layout/BottomNavBar.tsx`.

- [ ] **Step 3: Verify renders**

- [ ] **Step 4: Commit**

```bash
git add src/app/returns/ src/components/layout/BottomNavBar.tsx
git commit -m "feat(v0.4): add returns wizard with 3-step form"
```

---

## Task 11: Brand Store Page

**Files:**
- Create: `src/app/brand/[brandId]/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- Full-bleed hero image with gradient overlay, brand logo, tagline
- TopAppBar initially transparent, opaque on scroll (via `useEffect` + scroll listener)
- Brand stats bar: product count, avg rating, founded year
- "Our Story" section with pull-quote in primary blue + body text
- Curated collection carousels: "Best Sellers", "New Arrivals" with "NEW" badge
- "Shop All Products" gradient CTA
- Products filtered from `products.ts` by matching `product.brand === brand.name`

Key patterns: Brand lookup from `brands-data.ts` by `brandId`. `useEffect` for scroll-based TopAppBar opacity. ProductCard component reuse for carousels.

- [ ] **Step 2: Verify renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/brand/
git commit -m "feat(v0.4): add brand store page with editorial hero"
```

---

## Task 12: Address Book Page

**Files:**
- Create: `src/app/addresses/page.tsx`

- [ ] **Step 1: Implement page**

Create page with:
- TopAppBar with "My Addresses" title, "Add New" primary text button
- Address cards: radio default selector, "Default" badge, recipient info, Edit/Delete links
- Add/Edit bottom sheet form: name, phone, address fields, map placeholder, "Set as default" checkbox, "Save Address" CTA
- Delete confirmation bottom sheet
- Cannot delete default address (toast warning)
- Empty state

Key patterns: `useState` for showForm, editingId, formData, showDeleteConfirm. CRUD via `useUser()` address methods. Form validation: required fields check.

- [ ] **Step 2: Verify renders**

- [ ] **Step 3: Commit**

```bash
git add src/app/addresses/
git commit -m "feat(v0.4): add address book page with CRUD and default selection"
```

---

## Task 13: Navigation Integration

**Files:**
- Modify: `src/components/layout/TopAppBar.tsx`
- Modify: `src/app/my-page/page.tsx`
- Modify: `src/app/product/[id]/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/search/page.tsx`
- Modify: `src/app/category/page.tsx`

- [ ] **Step 1: Add notification bell to TopAppBar**

Add `showNotifications` prop to TopAppBar. When true, render bell icon with unread count badge (primary blue dot). Uses `useUser().notifications.filter(n => !n.readAt).length` for count. Links to `/notifications`.

- [ ] **Step 2: Update My Page**

Add menu links section below existing content: "Wishlist", "Recently Viewed", "Coupons", "Notifications", "Address Book" — each as a tappable row with icon, label, and chevron_right. Make order cards tappable → navigate to `/order/[id]`.

- [ ] **Step 3: Update Product Detail**

Add wishlist heart icon (top-right of image carousel). Toggle via `addToWishlist` / `removeFromWishlist`. Add "Compare" icon button. Brand name as Link to `/brand/[brandId]`. Call `addRecentView(product.id)` in `useEffect` on mount.

- [ ] **Step 4: Update Home page**

Link existing FLASH SALE banner to `/flash-sale`.

- [ ] **Step 5: Update Search page**

Add compare checkbox on product cards. When 2-3 selected, show floating "Compare (N)" CTA button → navigates to `/compare?ids=...`.

- [ ] **Step 6: Update Category page**

Link Popular Brands cards to `/brand/[brandId]`.

- [ ] **Step 7: Verify all navigation flows**

Test: My Page → Wishlist, My Page → order detail, Product → brand store, Home → flash sale, Search → compare.

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/TopAppBar.tsx src/app/my-page/ src/app/product/ src/app/page.tsx src/app/search/ src/app/category/
git commit -m "feat(v0.4): wire navigation — wishlist, notifications, compare, brand store, flash sale entry points"
```

---

## Task 14: Final Verification & Cleanup

- [ ] **Step 1: Type check**

Run: `cd examples/dummy-ecommerce-webapp && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Lint check**

Run: `cd examples/dummy-ecommerce-webapp && npx next lint`
Expected: No errors

- [ ] **Step 3: Build check**

Run: `cd examples/dummy-ecommerce-webapp && npm run build`
Expected: Build succeeds

- [ ] **Step 4: Smoke test all 10 new routes**

Visit each route in dev server and verify it renders without errors:
`/wishlist`, `/recently-viewed`, `/order/20260320-1928374`, `/flash-sale`, `/compare?ids=p001,p002`, `/coupons`, `/notifications`, `/returns/20260320-1928374`, `/brand/samsung`, `/addresses`

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore(v0.4): final verification — all 10 pages build and render"
```
