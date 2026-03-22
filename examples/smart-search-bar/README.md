# Smart Search Bar

An AI-powered e-commerce search bar with natural language understanding, real-time suggestions, auto-generated filter chips, and instant results preview. Built end-to-end with [Feature Crew](../../README.md).

## Try It

```bash
npm install
npm run dev    # → http://localhost:3000
npm test       # 12 test suites
```

No environment variables needed — uses mock data with 50+ seeded products.

## Features

- **Natural language queries** — "red running shoes under $50" auto-generates price/color/category filter chips
- **Real-time suggestions** — query completions, product matches, and categories with 300ms debounce
- **Spell correction** — auto-corrects typos with option to search original term
- **Instant results preview** — top 4 product cards appear as you type
- **Recent & trending searches** — recent persisted in localStorage, trending via ISR
- **Full keyboard navigation** — arrow keys, Enter, Escape, Tab, `/` to focus (WCAG 2.1 AA)
- **URL state persistence** — shareable search URLs with back-button support
- **Rate limiting** — 60 requests/minute per session

## Tech Stack

Next.js 14 · React 18 · TypeScript · Zustand · Tailwind CSS

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── search/page.tsx             # Search results page
│   └── api/v2/search/
│       ├── smart/route.ts          # POST — NLU search with filter extraction
│       └── suggestions/route.ts    # GET — autocomplete suggestions
├── components/SmartSearchBar/      # 12 React components
├── hooks/
│   ├── useSearchStore.ts           # Zustand store
│   ├── useDebounce.ts              # 300ms debounce
│   └── useRecentSearches.ts        # localStorage persistence
├── data/products.json              # Mock product catalog
└── __tests__/                      # 12 test suites
```

## How It Was Built

This example went through the full Feature Crew pipeline:

| Phase | Result |
|-------|--------|
| **Clarify** | PO Agent auto-answered 18/22 questions → [spec.md](docs/superpowers/feature-crew/smart-search-bar/spec.md) with 49 acceptance criteria |
| **Implement** | 4 evaluation rounds (72% → 82% → 78% → 93% PASS) |
| **QA** | All tests passing, ALL_CLEAR on first round → [qa-report-1.md](docs/superpowers/feature-crew/smart-search-bar/qa-report-1.md) |
