# Implementation Plan: E-Commerce v0.3

## Task 1: Data Layer — Types, Categories, Reviews Mock Data
**Files:** `src/types/index.ts`, `src/data/categories.ts`, `src/data/reviews.ts`, `src/data/mock-data.ts`
- Add `SubmittedReview`, `PendingReview`, `Category`, `Subcategory` types
- Create categories data file with 8 categories, each having 3-5 subcategories, brands, trending products
- Create reviews data file with mock submitted reviews and pending review items
- Update mock-data to include initial reviews in user data
- **ACs:** Foundation for AC-1.9, AC-2.9, AC-3.7

## Task 2: Context Updates — UserContext with Reviews & Membership Actions
**Files:** `src/context/UserContext.tsx`
- Add `submittedReviews` and `pendingReviews` to user state
- Add `submitReview(review)` — moves product from pending to submitted, adds review
- Add `deleteReview(reviewId)` — removes from submitted reviews
- Add `toggleMembership()` — sets `is_rocket_member = true`
- **ACs:** AC-3.6, AC-3.7, AC-4.8, AC-5.7

## Task 3: Category Navigation Page
**Files:** `src/app/category/page.tsx`, `src/components/category/CategorySidebar.tsx`, `src/components/category/CategoryContent.tsx`
- Split-pane layout: fixed sidebar + scrollable content
- Active category state with highlight styling
- Promo banner, subcategory grid, popular brands, trending products sections
- **ACs:** AC-1.1 through AC-1.9

## Task 4: Reviews Page (Pending + Submitted Tabs)
**Files:** `src/app/reviews/page.tsx`, `src/components/reviews/PendingReviews.tsx`, `src/components/reviews/SubmittedReviews.tsx`
- Tab switching (client-side, no route change)
- Pending: summary stats, product cards with Write Review / View Item buttons
- Submitted: summary stats (total + avg rating), review cards with helpful count, Edit/Delete
- **ACs:** AC-2.1 through AC-2.9, AC-3.1 through AC-3.7

## Task 5: Write a Review Page
**Files:** `src/app/write-review/[productId]/page.tsx`
- Product summary section from product data
- Interactive star rating (1-5, tap to fill)
- Photo upload placeholders (3 slots, mock only)
- Textarea with character counter (0/2000)
- Terms checkbox + disabled submit until rating + terms
- On submit: call context, navigate to /reviews submitted tab
- **ACs:** AC-4.1 through AC-4.9

## Task 6: Rocket Wow Membership Page
**Files:** `src/app/membership/page.tsx`
- Hero section with editorial headline + savings calculator card
- Benefits bento grid (5 cards)
- Comparison table (Regular vs Wow)
- Pricing plans (Annual + Monthly)
- Fixed CTA: "Start 30-Day Free Trial" → sets is_rocket_member
- Already-member disabled state
- **ACs:** AC-5.1 through AC-5.9

## Task 7: Membership-Aware Cart & Checkout Variants
**Files:** `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`
- Cart: Add WOW membership banner when is_rocket_member
- Cart: Group items by delivery type (Rocket vs Standard)
- Cart: Show ₩0 shipping with strikethrough when member
- Checkout: WOW badge in header + shipping address
- Checkout: Free shipping line with WOW badge
- **ACs:** AC-6.1 through AC-6.6

## Task 8: Navigation & Integration Updates
**Files:** `src/components/layout/BottomNavBar.tsx`, `src/app/my-page/page.tsx`
- BottomNavBar: Category tab links to /category
- My Page: Add "My Reviews" link → /reviews
- My Page: Add "Rocket Wow" link → /membership
- **ACs:** AC-7.1 through AC-7.4

## Execution Order
Tasks 1-2 first (data foundation), then Tasks 3-8 in parallel (independent pages).
