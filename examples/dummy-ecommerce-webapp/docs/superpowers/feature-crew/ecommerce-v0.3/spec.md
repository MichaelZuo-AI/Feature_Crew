# Spec: E-Commerce v0.3 — Category Navigation, Reviews System, Membership

## Overview

Append 4 new pages and 2 conditional screen variants to the existing dummy e-commerce webapp. These features cover category browsing, a review system (pending + submitted + write), a membership benefits page, and membership-aware cart/checkout variants.

Design spec source: `stitch_v0.3`

---

## Feature 1: Category Navigation (`/category`)

### Description
A split-pane category browser with a fixed sidebar of top-level categories and a scrollable main content area showing subcategories, promotional banners, popular brands, and trending products.

### Acceptance Criteria

**AC-1.1** Page renders at route `/category` with "Categories" as the page title.

**AC-1.2** Left sidebar shows 8 category icons stacked vertically: Fashion, Electronics, Beauty, Home Decor, Food, Baby, Sports, Kitchen. Each has a Material Symbols icon and label.

**AC-1.3** Tapping a category highlights it with a left blue border (`#0050cb`) and white background. The previously active category deselects.

**AC-1.4** Main content area shows a promotional banner at the top with gradient background, seasonal event badge, and discount callout.

**AC-1.5** Below the banner, a "Sub Categories" section displays a grid of subcategory items (icon + label). For Fashion: Men's Clothing, Women's Clothing, Shoes, Accessories, Bags.

**AC-1.6** A "Popular Brands" section shows 4 brand cards in a 2-column grid with placeholder brand names (generic names, no real brands).

**AC-1.7** A "Trending in [Category]" section shows product cards with image, name, price, and rating.

**AC-1.8** Bottom navigation "Category" tab is active (filled icon, blue text). Tapping other nav items navigates to the correct routes.

**AC-1.9** Subcategory data is driven by mock data — each top-level category has 3-5 subcategories defined in a data file.

---

## Feature 2: My Reviews — Pending Tab (`/reviews`)

### Description
A reviews management page with two tabs. The Pending tab shows products the user has purchased but not yet reviewed, with a summary of total pending items and earnable points.

### Acceptance Criteria

**AC-2.1** Page renders at route `/reviews` with "Reviews" or "My Reviews" as the page title and a back arrow.

**AC-2.2** Two tabs at the top: "Pending Reviews" and "Submitted Reviews". Default tab is Pending.

**AC-2.3** Summary section shows "Total Pending" count and "Points Earnable" total with a star icon.

**AC-2.4** Each pending review card shows: product image, brand name, product title (line-clamp-2), purchase date, and a points badge (e.g., "+500P").

**AC-2.5** Each card has two buttons: "Write Review" (primary gradient CTA) and "View Item" (secondary).

**AC-2.6** "Write Review" navigates to `/write-review/[productId]`.

**AC-2.7** "View Item" navigates to `/product/[productId]`.

**AC-2.8** "Load More Items" button at the bottom (mock — no pagination needed, just show the button).

**AC-2.9** Pending reviews are derived from mock data — products from delivered orders that haven't been reviewed.

---

## Feature 3: My Reviews — Submitted Tab (`/reviews` with tab switch)

### Description
The Submitted tab shows reviews the user has already written, with summary stats and edit/delete actions.

### Acceptance Criteria

**AC-3.1** Switching to "Submitted Reviews" tab shows a different content view (no page navigation, client-side tab switch).

**AC-3.2** Summary section shows two cards in a 2-column grid: "Total Reviews" count (large number on blue background) and "Avg Rating" with star visualization.

**AC-3.3** Each submitted review card shows: product thumbnail (smaller, 64px), product name, purchase date, star rating (filled stars), review text (line-clamp-3).

**AC-3.4** Below each review: "X people found this helpful" count with thumbs-up icon, plus "Edit" and "Delete" action buttons.

**AC-3.5** "Edit" navigates to `/write-review/[productId]` pre-filled with existing review data.

**AC-3.6** "Delete" removes the review from state (with no confirmation dialog needed for demo).

**AC-3.7** Submitted reviews are stored in UserContext and populated with mock data.

---

## Feature 4: Write a Review (`/write-review/[productId]`)

### Description
A full-screen review composition form for a specific product, with star rating, photo upload placeholders, text input, and terms agreement.

### Acceptance Criteria

**AC-4.1** Page renders at route `/write-review/[productId]` with "Write a Review" as the page title.

**AC-4.2** Product summary section shows: product image, brand/series label, product name, color variant, current price with original price strikethrough.

**AC-4.3** Star rating section: 5 tappable star icons. Tapping a star fills it and all stars to its left (1-5 rating). Label shows "WHAT IS YOUR OVERALL RATING?" before selection.

**AC-4.4** Photo upload section: 3 upload slots labeled "Main", "+", "+". Tapping shows a placeholder interaction (no actual upload). Label shows "Up to 3 photos".

**AC-4.5** Text input: Textarea with placeholder text, character counter showing "0 / 2000" that updates as user types.

**AC-4.6** Terms checkbox: "I confirm that this review is based on my own experience..."

**AC-4.7** Fixed bottom "Submit Review" button (gradient CTA with send icon). Button is disabled until rating is selected AND terms checkbox is checked.

**AC-4.8** On submit: review is added to UserContext submitted reviews, user is navigated back to `/reviews` with the Submitted tab active, and the product is removed from pending reviews.

**AC-4.9** Bottom navigation is hidden on this page (transactional flow).

---

## Feature 5: Rocket Wow Membership (`/membership`)

### Description
A marketing/benefits landing page for the Rocket Wow membership program with hero section, benefits grid, comparison table, pricing plans, and trial CTA.

### Acceptance Criteria

**AC-5.1** Page renders at route `/membership` with "Membership Benefits" as the page title and a back arrow.

**AC-5.2** Hero section shows: "Rocket Wow Exclusive" badge, large editorial headline ("Experience the Future of Shopping"), description text, and a glassmorphism savings calculator card showing "Potential Monthly Savings: ₩12,500" with a progress bar.

**AC-5.3** Benefits grid (bento-style): 5 benefit cards — Free Shipping (full-width), Rocket Delivery, 30-Day Returns, Rocket Fresh, Wow Video. Each has an icon, title, and short description.

**AC-5.4** Comparison table: "Regular vs. Wow" with rows for Shipping Fee (₩3,000 vs Free), Delivery Speed (2-3 Days vs 1 Day), Streaming (- vs Included).

**AC-5.5** Pricing section: Two plans — Annual (₩49,900/year, "Best Value" badge, "Save 20%") and Monthly (₩4,990/month).

**AC-5.6** Fixed bottom CTA: "Start 30-Day Free Trial" button with chevron icon. Below it: "Cancel anytime. No commitment required."

**AC-5.7** Tapping the CTA sets `is_rocket_member = true` in UserContext and navigates back to the previous page.

**AC-5.8** If user is already a member, the CTA changes to "You're a Wow Member" (disabled state).

**AC-5.9** Bottom navigation is hidden on this page.

---

## Feature 6: Membership-Aware Cart & Checkout (Conditional Variants)

### Description
The existing cart and checkout pages conditionally render membership benefits when `is_rocket_member` is true.

### Acceptance Criteria

**AC-6.1** When `is_rocket_member` is true, the cart page shows a "Rocket Wow Membership Applied" banner with a star icon and "Enjoy unlimited free shipping on all orders!" message.

**AC-6.2** When `is_rocket_member` is true, the cart's delivery fee shows ₩0 with the original fee (₩3,000) struck through, and a "WOW" badge next to it.

**AC-6.3** When `is_rocket_member` is true, the checkout page shows a "WOW" badge in the top bar and next to the user's name in the shipping address section.

**AC-6.4** When `is_rocket_member` is true, the checkout's shipping fee line shows ₩0 with strikethrough original and "FREE ROCKET DELIVERY" label with WOW badge.

**AC-6.5** Cart items are grouped by delivery type: "Rocket Delivery" group and "Standard Delivery" group, each with its own header badge.

**AC-6.6** When `is_rocket_member` is false, cart and checkout render as they currently do (no WOW badges, standard delivery fees).

---

## Feature 7: Navigation & Integration Updates

### Acceptance Criteria

**AC-7.1** BottomNavBar "Category" tab navigates to `/category` (currently dead button).

**AC-7.2** My Page links to `/reviews` (add a "My Reviews" card/link on the my-page screen).

**AC-7.3** My Page links to `/membership` (add a "Rocket Wow" card/link on the my-page screen).

**AC-7.4** Product detail page "Reviews" section links to `/reviews` for the current product's review.

---

## Data Model Changes

### New Types

```typescript
interface SubmittedReview {
  id: string;
  productId: number;
  rating: number;          // 1-5
  text: string;
  photos: string[];        // URLs (mock)
  date: string;
  helpfulCount: number;
}

interface PendingReview {
  productId: number;
  purchaseDate: string;
  pointsEarnable: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;            // Material Symbol name
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  icon: string;
}
```

### User Type Extension

```typescript
interface User {
  // ... existing fields
  is_rocket_member: boolean;       // already exists
  submittedReviews: SubmittedReview[];
  pendingReviews: PendingReview[];
}
```

### New Data Files

- `src/data/categories.ts` — 8 categories with subcategories, brands, trending products
- `src/data/reviews.ts` — Mock submitted reviews and pending review items

---

## New Routes Summary

| Route | Page | Bottom Nav |
|-------|------|------------|
| `/category` | Category Navigation | Visible (Category active) |
| `/reviews` | My Reviews (Pending/Submitted tabs) | Visible |
| `/write-review/[productId]` | Write a Review form | Hidden |
| `/membership` | Rocket Wow Membership | Hidden |

---

## Non-Functional Requirements

- All new pages follow existing patterns: `'use client'`, React Context, Tailwind CSS, Material Symbols
- Mobile-first, max-width 448px
- Glass-effect floating elements (85% opacity + backdrop-blur)
- No 1px borders — use tonal surface shifts per design system
- Gradient CTAs: `linear-gradient(135deg, #0050cb → #0066ff)`
- All prices in KRW (₩) formatted with `formatPrice` utility
