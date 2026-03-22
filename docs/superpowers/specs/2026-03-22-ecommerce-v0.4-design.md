# E-Commerce Demo v0.4: 10 New Pages for UI Pattern Showcase

**Date:** 2026-03-22
**Project:** dummy-ecommerce-webapp
**Purpose:** Expand the demo app with 10 new pages that showcase diverse UI patterns, proving FeatureCrew handles varied complexity. Each page introduces unique interaction patterns not present in the existing v0.3 app.

---

## Existing Context

The app currently has 11 pages: Home, Product Detail, Search, Cart, Checkout, Payment Success, My Page, Category, Reviews, Write Review, and Membership. Stack: Next.js 14, React 18, TypeScript, Tailwind CSS. Design system: "Neo Seoul" — Plus Jakarta Sans, primary #0050cb, secondary amber #ff8a00, tonal surface layering, no 1px borders.

---

## New Pages

### Page 1: Wishlist (`/wishlist`)

**Unique UI patterns:** Selectable grid with edit mode, filter chips, price-drop detection badges, empty state illustration.

**Acceptance Criteria:**

- AC-1.1: Top bar displays "My Wishlist" title with item count badge and "Edit" toggle button.
- AC-1.2: Horizontal scrolling filter chips below app bar — "All" (default selected, primary bg), "In Stock", "On Sale", "Price Drop" (unselected, surface_container_highest bg). Single-select behavior.
- AC-1.3: 2-column product card grid with 12px gap. Each card shows: product image (1:1, rounded-lg top), filled red heart icon top-right, brand name (label-sm), product title (body-md, 2-line clamp), price in primary blue with strikethrough original price.
- AC-1.4: Items where current price < saved price show amber "↓X%" badge next to price.
- AC-1.5: Out-of-stock items show 40% white overlay on image with centered "Out of Stock" label.
- AC-1.6: Tapping "Edit" enters edit mode — cards get checkboxes. Sticky bottom action bar slides up with "Delete Selected" (error color) and "Add to Cart" (gradient CTA).
- AC-1.7: Tapping heart icon removes item with shrink animation.
- AC-1.8: Empty state: centered placeholder illustration + "Start Exploring" CTA linking to `/`.
- AC-1.9: Bottom nav visible.

**Data model:**
```typescript
interface WishlistItem {
  productId: string;
  savedAt: string;      // ISO date
  savedPrice: number;   // price when saved, for drop detection
}
// Stored in UserContext as wishlist: WishlistItem[]
```

---

### Page 2: Recently Viewed (`/recently-viewed`)

**Unique UI patterns:** Date-grouped timeline sections, clear-all confirmation bottom sheet, chronological browsing history.

**Acceptance Criteria:**

- AC-2.1: Top bar displays "Recently Viewed" title with "Clear All" tertiary text button.
- AC-2.2: Products grouped under date section headers on surface_container_low — "Today", "Yesterday", "This Week", "Earlier".
- AC-2.3: 2-column compact product cards within each group — image, name, price only. No hearts, no badges. Tap navigates to `/product/[id]`.
- AC-2.4: "Clear All" triggers bottom sheet confirmation: "Clear browsing history?" with Cancel (tertiary) and Clear (error color) buttons. Glass backdrop.
- AC-2.5: Max 50 items, auto-pruned (oldest first) when exceeded.
- AC-2.6: Empty state: clock icon + "No recent items" message.
- AC-2.7: Bottom nav visible.

**Data model:**
```typescript
interface RecentView {
  productId: string;
  viewedAt: string;  // ISO datetime
}
// Stored in UserContext as recentlyViewed: RecentView[], max 50
```

---

### Page 3: Order Detail (`/order/[id]`)

**Unique UI patterns:** Vertical timeline stepper with active/completed/pending states, delivery info island, copy-to-clipboard tracking number.

**Acceptance Criteria:**

- AC-3.1: Top bar displays "Order #CPN-{id}" with back arrow.
- AC-3.2: Status hero section on surface_container_low island: large status text (e.g., "Shipping"), estimated delivery date, order date.
- AC-3.3: Vertical timeline stepper with 4 steps: "Pending" → "Preparing" → "Shipping" → "Delivered" (matches existing `Order.status` enum).
  - Completed steps: primary blue filled dot (12px) + solid blue connector line + timestamp label.
  - Active step: pulsing primary blue dot + bold label + description text.
  - Pending steps: outline gray dot + dashed gray connector line.
- AC-3.4: Delivery details island: carrier name, tracking number with copy icon (tapping copies to clipboard with toast notification), delivery address.
- AC-3.5: Ordered items section: compact cards showing product image, name, quantity badge, individual price.
- AC-3.6: Action buttons: "Track Package" (gradient CTA) + "Request Return" (tertiary, navigates to `/returns/[orderId]`).
- AC-3.7: Bottom nav visible.

**Data model extensions:**
```typescript
interface OrderDetail extends Order {
  trackingNumber: string;
  carrier: string;
  statusHistory: {
    status: 'pending' | 'preparing' | 'shipping' | 'delivered';  // matches existing Order.status enum
    timestamp: string;
    description?: string;
  }[];
}
```

---

### Page 4: Flash Sale Event (`/flash-sale`)

**Unique UI patterns:** Countdown timer with digit cards, real-time stock progress bars, urgency pulse animations, ticker bar.

**Acceptance Criteria:**

- AC-4.1: Full-bleed hero banner with amber-to-primary gradient background. "MEGA FLASH SALE" in display-lg text. Countdown timer (HH:MM:SS) with individual digit cards on surface_container_lowest background.
- AC-4.2: Countdown timer counts down in real-time using setInterval. When timer reaches 00:00:00, show "Sale Ended" state with disabled buy buttons.
- AC-4.3: Product list below hero — full-width cards (not grid). Each card: product image left (120px square), right side shows product name, flash price in title-lg primary blue, original price strikethrough.
- AC-4.4: Each card has a stock progress bar: amber gradient fill showing claimed percentage (e.g., "73% claimed") with label.
- AC-4.5: Items with >90% claimed show pulsing red "Almost Gone!" badge.
- AC-4.6: Each card has "BUY NOW" amber CTA button. Tapping adds 1 unit to cart (or increments quantity if already in cart) and navigates to `/cart`. The `claimedPercentage` is static mock data and does not change on interaction.
- AC-4.7: Sticky bottom ticker bar: "🔥 {N} items claimed in the last hour" with scrolling animation.
- AC-4.8: Bottom nav visible.

**Data model:**
```typescript
interface FlashSaleItem {
  productId: string;
  flashPrice: number;
  originalPrice: number;
  claimedPercentage: number;  // 0-100
  totalStock: number;
}
interface FlashSale {
  id: string;
  title: string;
  endTime: string;  // ISO datetime
  items: FlashSaleItem[];
  claimsLastHour: number;
}
// Stored in flash-sale-data.ts
```

---

### Page 5: Product Comparison (`/compare`)

**Unique UI patterns:** Side-by-side sticky product header, horizontal scroll comparison table, winner highlighting with primary blue pills, add/remove product slots.

**Acceptance Criteria:**

- AC-5.1: Top bar displays "Compare Products" with back arrow.
- AC-5.2: Sticky product header row (fixed on scroll): 2-3 product columns. Each shows product image (80px), name (2-line clamp), price. "×" button to remove. Last empty slot shows "+" add button.
- AC-5.3: Comparison table below with vertically scrollable rows. Row category headers on surface_container_low: "General", "Specifications", "Reviews", "Delivery".
- AC-5.4: Comparison rows: Rating (star display), Price, Brand, Express Delivery (yes/no), Discount %, Review Count. Alternating row backgrounds: white / surface_container_low. All comparison attributes are derived from existing `Product` fields — no new fields needed.
- AC-5.5: Best value in each row gets a primary blue background pill highlight (auto-detected: lowest price wins, highest rating wins, fastest delivery wins).
- AC-5.6: Sticky bottom bar with "Add to Cart" gradient CTA for each product column.
- AC-5.7: "+" slot opens a bottom sheet with product search/selection from existing products.
- AC-5.8: If <2 products selected, show prompt message "Add at least 2 products to compare".
- AC-5.9: Max 3 products can be compared at once.

**Data model:**
```typescript
// Comparison state managed locally via useState
// Products sourced from existing products.ts data
interface ComparisonSpec {
  label: string;
  key: keyof Product;       // uses existing Product fields only
  category: 'general' | 'reviews' | 'delivery';
  bestIs: 'highest' | 'lowest' | 'none';  // for winner detection
}
// Example rows: price (lowest wins), rating (highest), discount (highest),
// review_count (highest), express_delivery (boolean display)
```

---

### Page 6: Coupon Wallet (`/coupons`)

**Unique UI patterns:** Ticket-style coupon cards with dashed cut-outs, expiry countdown badges, tabbed status views (available/used/expired).

**Acceptance Criteria:**

- AC-6.1: Top bar displays "My Coupons" with available coupon count badge.
- AC-6.2: Tab bar with underline-style tabs: "Available" (default), "Used", "Expired".
- AC-6.3: Each coupon as a full-width ticket-style card:
  - Left accent strip with primary gradient (or amber for deal coupons).
  - Discount value in display text (e.g., "₩5,000" or "15%").
  - Coupon name, minimum spend requirement, applicable categories in body text.
  - Dashed border cut-out circles on left and right edges (classic coupon aesthetic).
- AC-6.4: Expiry badge: "Expires in X days". Amber color if <7 days remaining, error red if <1 day.
- AC-6.5: "Use Now" tertiary button on each available coupon — navigates to `/` (home) or relevant category.
- AC-6.6: "Used" tab shows same cards but dimmed (opacity 0.5) with "USED" stamp overlay rotated 15deg.
- AC-6.7: "Expired" tab shows dimmed cards with strikethrough on discount value.
- AC-6.8: Empty state per tab: appropriate message ("No coupons available" / "No used coupons" / "No expired coupons").
- AC-6.9: Bottom nav visible.

**Data model:**
```typescript
interface Coupon {
  id: string;
  name: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minSpend: number;
  categories: string[];      // applicable category IDs, empty = all
  expiresAt: string;         // ISO date
  status: 'available' | 'used' | 'expired';
  usedAt?: string;           // ISO date if used
}
// Stored in UserContext as coupons: Coupon[]
```

---

### Page 7: Notification Center (`/notifications`)

**Unique UI patterns:** Grouped notification sections, typed notification icons with colored circles, unread dot indicators, time-ago formatting.

**Acceptance Criteria:**

- AC-7.1: Top bar displays "Notifications" with "Mark All Read" tertiary text button.
- AC-7.2: Notifications grouped under date section headers on surface_container_low: "Today", "This Week", "Earlier".
- AC-7.3: Each notification card (full-width, surface_container_lowest bg):
  - Left: icon in colored circle — shipping truck (primary blue) for order updates, trending-down (amber) for price drops, local-offer (amber) for promotions, info (gray) for system.
  - Center: title (bold font-weight if unread, normal if read), description (body-md, 2-line clamp), time-ago label (e.g., "2h ago", "Yesterday").
  - Right: unread indicator — 8px primary blue dot.
- AC-7.4: Tapping a notification marks it as read and navigates to relevant page (product, order, etc.).
- AC-7.5: "Mark All Read" sets all notifications' readAt to current timestamp, removes all dots.
- AC-7.6: Empty state: bell icon + "You're all caught up!" message.
- AC-7.7: Bottom nav visible.

**Data model:**
```typescript
interface Notification {
  id: string;
  type: 'order' | 'price_drop' | 'promotion' | 'system';
  title: string;
  body: string;
  link: string;          // route to navigate to
  createdAt: string;     // ISO datetime
  readAt: string | null; // null = unread
}
// Stored in UserContext as notifications: Notification[]
```

---

### Page 8: Returns Wizard (`/returns/[orderId]`)

**Unique UI patterns:** Horizontal 3-step progress stepper, conditional form fields, photo upload slots, summary review step.

**Acceptance Criteria:**

- AC-8.1: Top bar displays "Request Return" with back arrow. Bottom nav hidden (transactional flow).
- AC-8.2: Horizontal progress stepper at top with 3 steps: "Select Items" → "Reason" → "Review".
  - Completed: primary blue filled circle + blue connector line + step label.
  - Current: primary blue outlined circle with subtle pulse animation + bold label.
  - Pending: gray outlined circle + gray dashed connector line.
- AC-8.3: **Step 1 — Select Items:** Ordered items displayed as selectable cards with checkboxes. Each shows product image, name, quantity, price. At least 1 item must be selected. "Next" gradient CTA at bottom (disabled if none selected).
- AC-8.4: **Step 2 — Reason:** Radio button group with options: "Changed my mind", "Defective/Damaged", "Wrong item received", "Doesn't match description", "Other".
  - If "Defective/Damaged" selected: photo upload area appears with 3 upload slots (labeled "Main", "+", "+") using surface_container_low backgrounds. Tapping a slot shows a placeholder interaction (no actual upload) — displays a stock placeholder image.
  - Textarea for additional details (optional), character counter "0 / 500".
  - "Back" tertiary + "Next" gradient CTA.
- AC-8.5: **Step 3 — Review:** Summary on surface_container_low island showing: selected items list, return reason, photo count if any, calculated refund amount, refund method ("Original payment method"). "Back" tertiary + "Submit Return" gradient CTA.
- AC-8.6: On submit: show success state with checkmark animation + "Return request submitted" + "Return to My Page" button. Navigate to `/my-page` on tap.
- AC-8.7: Returns are only available for orders with status `delivered`. If the order status is not `delivered`, redirect to `/order/[id]` with a toast message "Returns are only available for delivered orders".

**Data model:**
```typescript
interface ReturnRequest {
  orderId: string;
  items: { productId: string; quantity: number }[];
  reason: string;
  details?: string;
  photos: string[];  // placeholder URLs
  refundAmount: number;
  status: 'submitted';
}
// Managed via local component state (useState) — not persisted in context
```

---

### Page 9: Brand Store (`/brand/[brandId]`)

**Unique UI patterns:** Full-bleed editorial hero with gradient overlay, brand stats bar, pull-quote typography, curated collection carousels.

**Acceptance Criteria:**

- AC-9.1: Full-bleed brand hero image (300px height) with bottom gradient overlay (transparent to surface). Brand logo centered on image. Brand tagline in display-md text, white color.
- AC-9.2: Top bar initially transparent, becomes opaque (glass effect) on scroll down.
- AC-9.3: Brand stats bar on surface_container_low: 3 columns — "X Products" | "X.X★ Avg" | "Since YYYY". Centered text, separated by subtle vertical dividers.
- AC-9.4: "Our Story" section with editorial layout: pull-quote in title-lg primary blue with left border accent, body text below in body-md.
- AC-9.5: Curated collection carousels (horizontal scroll):
  - "Best Sellers" — standard product cards from brand's products.
  - "New Arrivals" — product cards with "NEW" primary badge top-left.
  - Each carousel has section title + "See All" tertiary link.
- AC-9.6: "Shop All Products" full-width gradient CTA at bottom.
- AC-9.7: Bottom nav visible.

**Data model:**
```typescript
interface Brand {
  id: string;
  name: string;
  logo: string;           // placeholder image path
  heroImage: string;      // placeholder image path
  tagline: string;
  story: string;          // paragraph text
  pullQuote: string;      // featured quote
  foundedYear: number;
  avgRating: number;
  productCount: number;
  // productIds auto-derived: filter products.ts where product.brand matches brand.name
}
// Stored in brands.ts data file
// Create Brand entries for 3-4 curated brands that appear most in products.ts
// (e.g., the brands with the most products). Not every brand needs a store page.
```

---

### Page 10: Address Book (`/addresses`)

**Unique UI patterns:** CRUD list with radio default selection, bottom sheet form with form fields, delete confirmation, map placeholder.

**Acceptance Criteria:**

- AC-10.1: Top bar displays "My Addresses" with "Add New" primary text button.
- AC-10.2: Address cards (full-width, surface_container_lowest bg):
  - Radio button left for default selection (selected = primary blue filled).
  - "Default" primary badge on the default address card.
  - Recipient name in title-md bold, phone number in body-md.
  - Full address in body-md, on_surface_variant color.
  - "Edit" | "Delete" tertiary action links bottom-right.
- AC-10.3: Tapping radio button sets that address as default (deselects others).
- AC-10.4: "Add New" or "Edit" opens bottom sheet form (slides up with glass backdrop):
  - Form fields: Recipient Name, Phone Number, Address Line 1, Address Line 2, Postal Code, City/Province. All using surface_container_low background, ghost border on focus.
  - Map placeholder: gray rectangle (200px height) with pin icon and "Map integration coming soon" label.
  - "Set as default" checkbox.
  - "Save Address" gradient CTA (disabled until required fields filled).
- AC-10.5: "Delete" shows confirmation bottom sheet: "Remove this address?" with Cancel/Remove buttons. Cannot delete default address (show toast warning).
- AC-10.6: Empty state: location pin icon + "No saved addresses" + "Add New Address" CTA.
- AC-10.7: Bottom nav visible.

**Data model:**
```typescript
interface SavedAddress {
  id: string;
  name: string;          // recipient name
  phone: string;
  line1: string;         // matches existing Address field names
  line2?: string;
  postal_code: string;
  city: string;
  isDefault: boolean;
}
// Stored in UserContext as savedAddresses: SavedAddress[]
// Note: uses field names consistent with existing Address type (line1/line2/postal_code)
```

---

## Navigation Updates

The following navigation links need to be added to existing pages:

- **My Page (`/my-page`):** Add menu links to "Wishlist", "Recently Viewed", "Coupons", "Notifications", "Address Book".
- **Product Detail (`/product/[id]`):** Add heart icon to save/unsave from wishlist. Add "Compare" icon button. Track in recently viewed on page load. Brand name links to `/brand/[brandId]`.
- **Order cards on My Page:** Tapping an order navigates to `/order/[id]`.
- **Cart:** Add link to `/coupons` in checkout flow.
- **Home (`/`):** "FLASH SALE" banner in Gold Box section links to `/flash-sale`. Flash sale promo card added if not present.
- **Top App Bar (`TopAppBar.tsx`):** Add notification bell icon with unread count badge (primary blue dot with count), linking to `/notifications`.
- **Category Page (`/category`):** "Popular Brands" section brand cards link to `/brand/[brandId]`.
- **Search Results (`/search`):** Add "Compare" checkbox on product cards — selecting 2-3 items shows a floating "Compare (N)" CTA that navigates to `/compare?ids=p001,p002`.

---

## Stitch Design Specs

Each page should have a corresponding Stitch HTML design spec generated and saved to `design_spec/stitch/stitch/{page_name}/code.html`. The design prompts follow the Neo Seoul design system documented in `design_spec/stitch/stitch/neo_seoul/DESIGN.md`.

---

## Technical Notes

- All pages use `'use client'` directive (interactive components).
- Path alias `@/*` maps to `./src/*`.
- Mobile-first responsive (max-width: 448px container).
- Shared components: TopAppBar, BottomNavBar from `@/components/layout/`.
- State management: React Context (UserContext, CartContext, ToastContext).
- Mock data in `src/data/` files — no API calls.
- All prices formatted with `formatPrice()` from `@/lib/format.ts`.

## Evaluator Hints

- **Feature type:** UI-heavy
- **Weight overrides:** UI/UX fidelity 30%, Spec compliance 30%, Code quality 20%, Test coverage 10%, Error handling 5%, Integration safety 5%
- **Quality signals:** Each page must introduce its unique UI pattern. Design system compliance is critical — no 1px borders, correct surface layering, gradient CTAs, Plus Jakarta Sans throughout.
