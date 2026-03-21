# Feature Spec: AI-Powered Smart Search Bar

## Summary

An AI-powered smart search bar that replaces keyword-based search with natural language query understanding, real-time suggestions, auto-generated filter chips, and instant results preview. The goal is to reduce search-to-purchase time by 30% and increase search conversion rate by 15%. This is a greenfield implementation with mock API routes and seeded product data.

## User Stories

1. **US-1:** As a mobile shopper, I want to type a natural language query like "red running shoes under $50" so that I get relevant results without manually setting filters.
2. **US-2:** As a returning user, I want to see my recent searches when I focus the search bar so that I can quickly re-run past queries.
3. **US-3:** As a user, I want to see trending searches so that I can discover popular products.
4. **US-4:** As a user typing a query, I want to see real-time suggestions (query completions, matching products, categories) so that I can find what I need faster.
5. **US-5:** As a user viewing results, I want AI-generated filter chips that I can add/remove so that I can refine results without re-typing.
6. **US-6:** As a user, I want to see a preview of the top 4 matching products below the search bar as I type so that I can quickly evaluate results.
7. **US-7:** As a keyboard user, I want full keyboard navigation through suggestions, chips, and results so that I can use the feature without a mouse.
8. **US-8:** As a screen reader user, I want proper ARIA roles and live regions so that search state changes are announced.
9. **US-9:** As a user who searched and navigated away, I want my search state preserved when I hit back so that I don't lose my query and filters.

## Acceptance Criteria

### Smart Search Input
- AC-1: Search bar renders at 52px height with 12px border-radius, placeholder "Search for anything...", and search icon.
- AC-2: On focus, border color changes to accent (#6366F1). Clear button (✕) appears when query length > 0.
- AC-3: Voice button is visible only on mobile (≤768px) but is non-functional (placeholder); tap shows disabled state.
- AC-4: Camera icon placeholder is visible but disabled/grayed out (image search out of scope v1).
- AC-5: Recent searches (max 10) are persisted in localStorage and shown when search bar is focused with empty input.
- AC-6: Trending searches are displayed in the suggestions dropdown, fetched via ISR with 15-minute revalidation.

### Suggestions Dropdown
- AC-7: After 300ms debounce of no typing, suggestions API is called and dropdown appears with 150ms ease-out animation (opacity 0→1, translateY -8px→0).
- AC-8: Dropdown has three sections: "Suggestions" (query completions with result count), "Products" (with thumbnail images), "Trending" (with fire icon).
- AC-9: Dropdown has max-height 400px with scroll, shadow `0 16px 48px rgba(0,0,0,0.4)`.
- AC-10: On mobile (≤480px), suggestions open as a fullscreen overlay with a back button (←) to dismiss, sliding up with 200ms ease-out animation.

### AI Query Understanding & Filter Chips
- AC-11: When a search is submitted or results load, AI-parsed filter chips appear below the search bar (e.g., query "red nike shoes under 100" → chips: [Red] [Nike] [< $100] [Shoes]).
- AC-12: Chips are removable — clicking ✕ removes the chip with 150ms ease-in animation (scale 1→0.8, opacity 1→0, width collapse) and triggers a new search with updated filters.
- AC-13: When a chip is removed, the search input text stays unchanged; only the API filter parameters update.
- AC-14: Chip add animation: 200ms spring (scale 0.8→1, opacity 0→1).
- AC-15: No maximum chip count. On desktop, chips wrap to multiple rows. On mobile (≤480px), chips are horizontally scrollable with fade edge indicators.

### Instant Results Preview
- AC-16: After 300ms debounce, both the suggestions and search endpoints are called in parallel; top 4 product cards render below the search bar in a grid.
- AC-17: Desktop: 4-column grid, 16px gap. Mobile (≤768px): 2-column grid, 12px gap.
- AC-18: Each product card shows: thumbnail (140px height desktop / 100px mobile, object-fit cover), title (2-line clamp, 13px/500), price (16px/700, accent-light color), original price (strikethrough if discounted), rating stars (orange #F59E0B), review count.
- AC-19: Product badges (e.g., "Best Seller", "-37%") render top-left on the thumbnail, driven by product data. Badge style: background #EF4444, white text, 4px radius.
- AC-20: Cards have 200ms hover lift (translateY -2px, shadow expand). Results fade in with 300ms stagger (50ms delay per card).
- AC-21: "View all N results →" link at the bottom navigates to `/search?q={query}` route.
- AC-22: Loading state: skeleton cards with 1.5s shimmer gradient animation.

### Spell Correction
- AC-23: If the API returns a `spellCorrection` value, results are shown for the corrected query. A message "Showing results for '{corrected}'. Search instead for '{original}'" appears above results, with the original query as a clickable link.

### No Results / Error States
- AC-24: When search returns zero results, display trending/popular products as a fallback with a message like "No results for '{query}'. Here are some popular items:".
- AC-25: When the API fails (timeout, network error), show trending products as fallback with a non-intrusive error indication.

### Search State Persistence
- AC-26: Search state (query, active chips/filters, results) is preserved in both URL search params and Zustand store, with URL as the source of truth.
- AC-27: Navigating to a product and hitting back restores the full search state (query, chips, results).
- AC-28: Search URLs are shareable — opening `/search?q=red+shoes&priceMax=50` pre-populates the query and filters.

### Rate Limiting
- AC-29: Search API routes enforce per-session rate limiting (60 requests/minute). When exceeded, return 429 with graceful degradation (show cached/stale results or a "please slow down" message).

### SSR & Routing
- AC-30: The search bar is a client-side component rendered in the page header.
- AC-31: The `/search` results page is server-side rendered for initial load (SSR with query params). Subsequent interactions are client-side.

### Keyboard Navigation (WCAG 2.1 AA)
- AC-32: `↓/↑` arrow keys navigate suggestion items with wrap-around. Active item receives visual highlight and `aria-selected="true"`.
- AC-33: `Enter` selects highlighted suggestion or submits the current query.
- AC-34: `Escape` closes suggestions dropdown and clears focus.
- AC-35: `Tab` exits dropdown, moves focus to first chip, then to result cards. `Shift+Tab` reverses.
- AC-36: `Backspace` on empty input removes the last filter chip.
- AC-37: `/` (slash) globally focuses the search bar, but only when no other input/textarea/contenteditable is focused (per WCAG SC 2.1.4).

### ARIA & Screen Reader
- AC-38: Search input has `role="combobox"`, `aria-expanded`, `aria-autocomplete="list"`, `aria-activedescendant`.
- AC-39: Suggestions list has `role="listbox"`, `aria-label="Search suggestions"`. Each item has `role="option"`.
- AC-40: Filter chips have `role="button"` with `aria-label="Remove filter: {label}"`.
- AC-41: Results region has `aria-live="polite"`. Result count announcement uses `aria-live="assertive"`.

### Analytics Events
- AC-42: Fire `search_initiated` when a search is submitted.
- AC-43: Fire `suggestion_clicked` when a suggestion item is selected.
- AC-44: Fire `chip_added` / `chip_removed` when filter chips change.
- AC-45: Fire `result_clicked` when a product card is clicked.
- AC-46: Fire `search_abandoned` when the user clears or navigates away without clicking a result.

### Responsive Breakpoints
- AC-47: ≤768px: 2-column product grid, full-width search bar, voice button visible, suggestions as fullscreen overlay.
- AC-48: ≤480px: Chips horizontally scrollable (no wrap), suggestions fullscreen overlay with back button.
- AC-49: >768px: 4-column product grid, voice button hidden, suggestions as dropdown panel.

## Technical Decisions

- **Backend:** Mock Next.js API routes implementing the specified contracts (POST /api/v2/search/smart, GET /api/v2/search/suggestions). Returns realistic data from seeded JSON fixtures.
- **Product data:** Seeded JSON dataset of sample products conforming to the API response schema.
- **Recent searches:** localStorage (no auth required), keyed per browser, max 10 entries with FIFO eviction.
- **Trending searches:** ISR with 15-minute revalidation interval via Next.js App Router. Mock data for demo.
- **Multi-language:** Backend/NLU handles queries in Korean, English, Chinese. Frontend UI is English-only. Locale parameter passed to API.
- **Voice input:** Non-functional placeholder button for v1 (same treatment as camera icon).
- **Chip removal behavior:** Input text stays unchanged; only the filter params sent to the API update.
- **Results layout:** Suggestions dropdown shows product suggestions (with thumbnails) as a section. Separately, a ResultsPreview grid (4 cards) renders below the search bar.
- **Debounce strategy:** Single 300ms debounce triggers both suggestions and search endpoints in parallel. In-flight requests are cancelled (AbortController) when new input arrives.
- **Search state:** URL search params as source of truth, synced to Zustand store. Enables shareable URLs and back-button restoration.
- **Rate limiting:** Per-session, 60 req/min, with 429 response and graceful degradation.
- **SSR:** Search bar is a client component. /search results page is SSR'd for initial load.
- **Keyboard navigation:** WAI-ARIA combobox pattern — arrows for listbox, Tab exits to chips/results.
- **Spell correction:** Auto-correct with "Showing results for X. Search instead for Y" UI.
- **Loading states:** Skeleton shimmer for both suggestions dropdown and results preview.
- **Thumbnails:** Fixed height (140px desktop / 100px mobile), auto width from grid, object-fit: cover. Placeholder skeleton until loaded.
- **Badges:** Data-driven status labels from product data (e.g., "Best Seller", discount percentage).
- **"View all" action:** Navigates to /search?q=... route.
- **"/" shortcut:** Only activates when no input/textarea/contenteditable has focus.
- **Chips overflow:** No max count. Wrap on desktop, horizontal scroll with fade edge on mobile.
- **Camera icon:** Visible but disabled/grayed placeholder.

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Accent | #6366F1 | Primary CTA, focused border, voice button |
| Accent Light | #818CF8 | Prices, links, "View all" |
| Surface | #1A1A1A | Dropdown bg, frames |
| Input BG | #242424 | Search input, product card bg |
| Border | #333333 | Default borders |
| Chip BG | #2D2B55 | Filter chip background |
| Chip Text | #A5B4FC | Filter chip text |
| Success | #22C55E | - |
| Badge | #EF4444 | Product badges |
| Stars | #F59E0B | Rating stars |
| Font | Inter, system-ui, sans-serif | All text |
| Radius SM | 4px | Badges, tags |
| Radius MD | 8-10px | Cards |
| Radius LG | 12px | Search bar, dropdown |
| Radius Pill | 20px | Chips |

## API Contract

### POST /api/v2/search/smart
**Request:** `{ query, locale, page, pageSize, sessionId, filters: { priceMin, priceMax, categories, attributes } }`
**Response:** `{ results[], totalCount, parsedFilters, suggestedChips[], suggestions[], spellCorrection }`

### GET /api/v2/search/suggestions
**Query params:** `q`, `locale`, `limit` (default 8)
**Response:** `{ suggestions[]: { text, type (QUERY|PRODUCT|CATEGORY), resultCount?, productId?, thumbnail?, categoryId? }, trending[] }`

## Component Tree

```
SmartSearchBar/
├── SearchInput/
│   ├── SearchIcon
│   ├── InputField (controlled, debounced)
│   ├── ClearButton (visible when query.length > 0)
│   ├── CameraButton (disabled placeholder)
│   └── VoiceButton (mobile only, disabled placeholder)
├── SuggestionsDropdown/
│   ├── RecentSearches (when focused + empty input)
│   ├── SuggestionSection ("Suggestions" | "Products" | "Trending")
│   │   └── SuggestionItem (keyboard navigable)
│   └── SuggestionDivider
├── FilterChips/
│   └── Chip (removable, animated)
├── ResultsPreview/
│   ├── ProductCard
│   │   ├── ProductThumbnail
│   │   ├── ProductBadge (conditional)
│   │   ├── ProductTitle (2-line clamp)
│   │   ├── PriceDisplay (current + original strikethrough)
│   │   └── RatingStars
│   ├── ViewAllLink
│   └── SpellCorrectionBanner
├── NoResultsFallback/ (trending products)
└── SearchSkeleton/
    ├── SkeletonCard × 4
    └── ShimmerAnimation
```

## Out of Scope (v1)

- Image-based search (camera icon placeholder only)
- Personalized ranking based on purchase history (v2)
- Search within specific seller stores
- Voice input functionality (button is placeholder only)
- Full i18n / UI localization (UI is English-only; backend handles multilingual queries)
- Real AI/ML backend (mock API routes with fixture data)

## Evaluator Criteria Hints

- **Feature type:** UI-heavy
- **Weight overrides:** Use defaults for UI-heavy (Spec compliance 25%, Code quality 15%, Test coverage 15%, UI/UX fidelity 30%, Error handling 5%, Integration safety 10%)
- **Key quality signals:**
  - All animations match Figma spec timings exactly
  - Full keyboard navigation works end-to-end without mouse
  - ARIA roles and live regions are correct and tested
  - Mobile responsive breakpoints produce correct layouts
  - Skeleton/loading states prevent layout shift
  - URL state persistence works with back/forward navigation
  - Filter chip add/remove correctly updates API calls
  - Debounce + AbortController prevents race conditions
