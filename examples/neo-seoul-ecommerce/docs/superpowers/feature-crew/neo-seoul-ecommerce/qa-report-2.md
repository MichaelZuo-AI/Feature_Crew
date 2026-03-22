## QA Report — Round 2

**Tests run:** 76
**Tests passed:** 76
**Tests failed:** 0

### Bug Fix Verification

1. [FIXED] — next/image remotePatterns
   `next.config.mjs` correctly configures `images.remotePatterns` with `protocol: 'https'` and `hostname: 'picsum.photos'`.

2. [FIXED] — clearCart on checkout
   `src/app/checkout/page.tsx` destructures `removeSelected` from `useCart()` (line 24) and calls `removeSelected()` on payment (line 86). Only selected/checked-out items are removed; remaining cart items are preserved. The `clearCart` function is no longer imported or used in checkout.

3. [FIXED] — total memoization
   `src/context/CartContext.tsx` wraps `total` in `useMemo` (line 107). Additionally, `totalItems`, `selectedItems`, `subtotal`, `deliveryFee`, and the entire context `value` object are also memoized. All callbacks use `useCallback`.

4. [FIXED] — CategoryTabs Glass Rule
   `src/components/home/CategoryTabs.tsx` applies the `glass` class on the sticky container div (line 18): `className="sticky top-16 z-40 glass"`.

5. [FIXED] — Sticky bar spacing
   `src/app/product/[id]/page.tsx` positions the sticky bar at `bottom-[84px]` (line 212), clearing the 80px-tall BottomNavBar with a 4px gap. Page content uses `pb-40` (line 73) to prevent content from being hidden behind the sticky bar.

### New Issues Found

1. **Low — `discount` missing from `useMemo` dependency array** (CartContext.tsx line 107)
   `total` is computed as `subtotal + deliveryFee - discount` but the dependency array is `[subtotal, deliveryFee]` — `discount` is omitted. Currently harmless because `discount` is a hardcoded constant (`0`), but if `discount` becomes stateful in the future this will cause stale values. Recommend adding `discount` to the dependency array.

2. **Low — `<img>` tags used instead of `next/image`** in cart, checkout, my-page, and payment-success pages.
   The build produces `@next/next/no-img-element` warnings for `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`, `src/app/my-page/page.tsx`, and `src/app/payment-success/page.tsx`. These are not blocking but reduce image optimization benefits.

### Status
ALL_CLEAR
