# Design System Specification: Editorial E-Commerce Excellence

## 1. Overview & Creative North Star: "The Hyper-Lucid Curator"
This design system moves beyond the "grid of boxes" typical of mass-market e-commerce. Our Creative North Star is **The Hyper-Lucid Curator**. In the South Korean market, density is often equated with value and efficiency, but to achieve a premium feel, we must balance that density with "breathable precision." 

We replace rigid structural lines with **Tonal Architecture**. By using layered surfaces and intentional white space, we create a high-speed shopping experience that feels like a high-end digital editorial rather than a warehouse catalog. We break the template through asymmetrical product hero placements and a typography scale that favors dramatic contrast between massive price displays and delicate micro-copy.

---

## 2. Colors & Surface Philosophy
We utilize a sophisticated palette where "White" is not just one color, but a spectrum of depth.

### The Palette
- **Primary (`#0050cb`):** Our "Trust Blue." Use for core brand actions and primary CTAs.
- **Secondary (`#914c00`) & Secondary Container (`#ff8a00`):** Our "Urgency Amber." Reserved strictly for deals, "Rocket" delivery badges, and limited-time offers.
- **Surface Tiers:**
    - `surface_container_lowest` (#ffffff): Use for the main product cards to make them "pop."
    - `surface` (#f7f9fc): The base canvas for the entire application.
    - `surface_container_low` (#f2f4f7): Use for secondary content sections like "Recommended for You."

### Key Constraints
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined by shifting from `surface` to `surface_container_low`. 
*   **Signature Textures:** For Primary CTAs, do not use flat hex codes. Apply a subtle linear gradient from `primary` (#0050cb) to `primary_container` (#0066ff) at a 135° angle to add a "liquid" premium finish.
*   **The Glass Rule:** Floating navigation bars or "Quick Buy" sheets must use `surface_container_lowest` at 85% opacity with a `20px` backdrop-blur to maintain context of the product underneath.

---

## 3. Typography: The Plus Jakarta Scale
We use **Plus Jakarta Sans** (a modern relative to Pretendard) to provide a geometric, clean aesthetic that excels in high-density Korean/English mixed layouts.

*   **Display (lg/md):** Reserved for major promotional headers. Use `-0.02em` letter spacing to create an authoritative, editorial "tightness."
*   **Headline (sm/md):** Used for product titles in detail views.
*   **Title (md/lg):** The workhorse for product names in grids. Bold weight is mandatory for price formatting using `title-lg`.
*   **Body (md):** Standard descriptions. Use `on_surface_variant` (#424656) to reduce eye strain.
*   **Label (sm/md):** Micro-copy for "Delivery Info" or "Tax Inclusive."

**Visual Hierarchy Tip:** Always pair a `title-lg` price in `primary` blue with a `label-sm` strikethrough original price in `outline`. The size contrast should be at least 2:1.

---

## 4. Elevation & Depth: Tonal Layering
Traditional dropshadows look "muddy." We achieve lift through the **Layering Principle**.

*   **The Stack:** 
    1.  Base: `surface` (#f7f9fc)
    2.  Section: `surface_container_low` (#f2f4f7)
    3.  Card: `surface_container_lowest` (#ffffff)
*   **Ambient Shadows:** For "Floating Action Buttons" or "Cart Previews," use a shadow color tinted with the brand: `rgba(0, 80, 203, 0.08)` with a `24px` blur and `8px` Y-offset.
*   **The Ghost Border:** If a boundary is required for accessibility (e.g., input fields), use `outline_variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** High-gloss gradient (`primary` to `primary_container`), `DEFAULT` (8px) roundedness. Text must be `on_primary`.
*   **Secondary/Deal:** `secondary_container` (#ff8a00) background with `on_secondary_container` (#613100) text. Use for "Buy Now" or "Flash Sale" triggers.
*   **Tertiary:** No background. Use `primary` text with a `label-md` weight.

### Cards & Grids
*   **Product Card:** No borders. Use `surface_container_lowest` background. 
*   **Spacing:** Use `spacing.4` (0.9rem) for internal padding.
*   **The "No-Divider" Rule:** Use `spacing.8` (1.75rem) of vertical white space to separate list items instead of horizontal lines.

### Badges (Rocket/Pay)
*   **The "Rocket" Badge:** Use `secondary` (#914c00) with a `full` (9999px) corner radius. Use `label-sm` bold typography.
*   **Status Chips:** Selection chips should toggle between `surface_container_highest` (unselected) and `primary` (selected).

### Input Fields
*   **Style:** `surface_container_low` background, no border. On focus, transition to a 1px `primary` "Ghost Border" (20% opacity).

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins (e.g., `spacing.6` on the left, `spacing.8` on the right) for hero banners to create a high-end fashion magazine feel.
*   **Do** group related information (Price + Shipping + ETA) using background "islands" of `surface_container_low`.
*   **Do** use `xl` (1.5rem) roundedness for large promotional banners, but keep functional cards at `DEFAULT` (0.5rem).

### Don’t
*   **Don't** use `#000000` for text. Always use `on_surface` (#191c1e) to keep the "Hyper-Lucid" softness.
*   **Don't** use 1px dividers to separate products in a list. If you must separate them, use a 4px tall bar of `surface_container_high`.
*   **Don't** use standard "drop shadows" on cards. Rely on the contrast between `surface` and `surface_container_lowest` to define the shape.