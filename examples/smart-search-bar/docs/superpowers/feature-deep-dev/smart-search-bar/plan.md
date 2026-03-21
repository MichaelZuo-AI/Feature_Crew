# Implementation Plan: AI-Powered Smart Search Bar

## Architecture Overview

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Inter font
│   ├── page.tsx                # Home page with SmartSearchBar
│   ├── search/
│   │   └── page.tsx            # SSR search results page
│   └── api/v2/search/
│       ├── smart/route.ts      # POST smart search endpoint
│       └── suggestions/route.ts # GET suggestions endpoint
├── components/
│   ├── SmartSearchBar/
│   │   ├── SmartSearchBar.tsx  # Orchestrator component
│   │   ├── SearchInput.tsx     # Input + icons + clear/voice/camera
│   │   ├── SuggestionsDropdown.tsx
│   │   ├── SuggestionItem.tsx
│   │   ├── FilterChips.tsx
│   │   ├── Chip.tsx
│   │   ├── ResultsPreview.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SearchSkeleton.tsx
│   │   ├── SpellCorrectionBanner.tsx
│   │   ├── NoResultsFallback.tsx
│   │   └── ViewAllLink.tsx
│   └── icons/                  # SVG icon components
├── hooks/
│   ├── useSearchStore.ts       # Zustand store
│   ├── useDebounce.ts          # Debounce hook
│   ├── useMediaQuery.ts        # Responsive breakpoint hook
│   └── useRecentSearches.ts    # localStorage recent searches
├── lib/
│   ├── analytics.ts            # Analytics event helpers
│   ├── rate-limiter.ts         # Per-session rate limiter
│   ├── search-api.ts           # API client with AbortController
│   └── types.ts                # Shared TypeScript types
├── data/
│   └── products.json           # Seeded product fixture data
└── __tests__/
    ├── components/             # Component tests
    ├── hooks/                  # Hook tests
    ├── api/                    # API route tests
    └── integration/            # Integration tests
```

## Tasks (Ordered by Dependency)

### Task 1: Project Scaffolding
**Goal:** Initialize Next.js 14 app with TypeScript, Tailwind CSS, Zustand, and testing infrastructure.
**Files:** package.json, tsconfig.json, tailwind.config.ts, next.config.ts, src/app/layout.tsx, src/app/page.tsx, jest.config.ts, postcss.config.js
**ACs:** Foundation for all other tasks
**Dependencies:** None

### Task 2: Type Definitions & Design Tokens
**Goal:** Define all TypeScript types from API contract and configure Tailwind with design tokens.
**Files:** src/lib/types.ts, tailwind.config.ts (update)
**ACs:** Types used by all components; tokens from Figma spec
**Dependencies:** Task 1

### Task 3: Mock Data & API Routes
**Goal:** Create seeded product data and implement mock API routes with rate limiting.
**Files:** src/data/products.json, src/app/api/v2/search/smart/route.ts, src/app/api/v2/search/suggestions/route.ts, src/lib/rate-limiter.ts
**ACs:** AC-6 (trending), AC-23 (spell correction data), AC-24/25 (error fallback data), AC-29 (rate limiting)
**Dependencies:** Task 2

### Task 4: Zustand Store & Hooks
**Goal:** Search state store with URL sync, debounce hook, media query hook, recent searches hook.
**Files:** src/hooks/useSearchStore.ts, src/hooks/useDebounce.ts, src/hooks/useMediaQuery.ts, src/hooks/useRecentSearches.ts, src/lib/search-api.ts
**ACs:** AC-5 (recent searches), AC-26/27/28 (URL state persistence)
**Dependencies:** Task 2

### Task 5: SearchInput Component
**Goal:** Search input with focus states, clear button, voice/camera placeholders, "/" global shortcut.
**Files:** src/components/SmartSearchBar/SearchInput.tsx, src/components/icons/*.tsx
**ACs:** AC-1, AC-2, AC-3, AC-4, AC-37
**Dependencies:** Task 4

### Task 6: SuggestionsDropdown Component
**Goal:** Dropdown with sections (suggestions, products, trending, recent), keyboard navigation, mobile overlay.
**Files:** src/components/SmartSearchBar/SuggestionsDropdown.tsx, src/components/SmartSearchBar/SuggestionItem.tsx
**ACs:** AC-7, AC-8, AC-9, AC-10, AC-32, AC-33, AC-34, AC-38, AC-39
**Dependencies:** Task 4, Task 5

### Task 7: FilterChips Component
**Goal:** Animated filter chips with add/remove, responsive layout.
**Files:** src/components/SmartSearchBar/FilterChips.tsx, src/components/SmartSearchBar/Chip.tsx
**ACs:** AC-11, AC-12, AC-13, AC-14, AC-15, AC-35, AC-36, AC-40
**Dependencies:** Task 4

### Task 8: ProductCard & ResultsPreview
**Goal:** Product cards with hover effects, staggered fade-in, skeleton loading, badges.
**Files:** src/components/SmartSearchBar/ProductCard.tsx, src/components/SmartSearchBar/ResultsPreview.tsx, src/components/SmartSearchBar/SearchSkeleton.tsx, src/components/SmartSearchBar/SpellCorrectionBanner.tsx, src/components/SmartSearchBar/NoResultsFallback.tsx, src/components/SmartSearchBar/ViewAllLink.tsx
**ACs:** AC-16, AC-17, AC-18, AC-19, AC-20, AC-21, AC-22, AC-23, AC-24, AC-25, AC-41
**Dependencies:** Task 2

### Task 9: SmartSearchBar Orchestrator
**Goal:** Wire all components together with debounce, AbortController, parallel API calls.
**Files:** src/components/SmartSearchBar/SmartSearchBar.tsx
**ACs:** AC-16 (parallel calls), AC-46 (search_abandoned), all orchestration
**Dependencies:** Tasks 5-8

### Task 10: Search Results Page (/search)
**Goal:** SSR search results page with full results, pagination, URL state.
**Files:** src/app/search/page.tsx
**ACs:** AC-21 (View all navigates here), AC-30, AC-31
**Dependencies:** Task 9

### Task 11: Analytics Integration
**Goal:** Analytics event helpers and integration across components.
**Files:** src/lib/analytics.ts, updates to components
**ACs:** AC-42, AC-43, AC-44, AC-45, AC-46
**Dependencies:** Task 9

### Task 12: Tests
**Goal:** Component tests, hook tests, API route tests, integration tests.
**Files:** src/__tests__/**
**ACs:** Verify all acceptance criteria are testable and tested
**Dependencies:** All above tasks
