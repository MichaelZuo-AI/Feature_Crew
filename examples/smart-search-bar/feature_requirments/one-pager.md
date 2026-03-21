# Feature One-Pager: AI-Powered Smart Search Bar

## Overview

Replace the existing keyword-based search bar with an AI-powered smart search experience that supports natural language queries, real-time suggestions, and contextual filters. The goal is to reduce search-to-purchase time by 30% and increase search conversion rate by 15%.

## Problem Statement

Current search relies on exact keyword matching, leading to poor results for natural language queries (e.g., "red running shoes under $50 for wide feet"). Users frequently refine searches 3-4 times before finding what they need, resulting in high drop-off rates. Analytics show 40% of users abandon after the first failed search.

## Target Users

- **Primary:** Mobile-first shoppers (65% of traffic) who prefer conversational search
- **Secondary:** Power users who want advanced filtering without navigating complex filter UIs

## Proposed Solution

### Core Components

1. **Smart Search Input**
   - Expandable search bar with typeahead suggestions
   - Recent searches (persisted per user, max 10)
   - Trending searches (updated every 15 min)
   - Voice input button (mobile only)

2. **AI Query Understanding**
   - Parse natural language into structured filters (category, price range, attributes)
   - Spell correction and synonym expansion
   - Multi-language support (Korean, English, Chinese)

3. **Instant Results Preview**
   - Show top 4 product cards below search bar as user types (debounced 300ms)
   - Each card: thumbnail, title (2-line truncate), price, rating stars, review count
   - "View all N results" link at the bottom

4. **Smart Filter Chips**
   - Auto-generated filter chips based on AI query parsing
   - Removable chips that dynamically update results
   - Example: query "red nike shoes under 100" → chips: [Red] [Nike] [< $100] [Shoes]

## API Contract

### POST /api/v2/search/smart

**Request:**
```json
{
  "query": "red running shoes under $50",
  "locale": "en-US",
  "page": 1,
  "pageSize": 20,
  "sessionId": "uuid",
  "filters": {
    "priceMin": null,
    "priceMax": null,
    "categories": [],
    "attributes": {}
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "productId": "string",
      "title": "string",
      "thumbnail": "url",
      "price": { "current": 49.99, "original": 79.99, "currency": "USD" },
      "rating": { "average": 4.5, "count": 1234 },
      "badges": ["BEST_SELLER", "FREE_SHIPPING"]
    }
  ],
  "totalCount": 342,
  "parsedFilters": {
    "color": "red",
    "category": "running-shoes",
    "priceMax": 50
  },
  "suggestedChips": [
    { "key": "color", "value": "red", "label": "Red" },
    { "key": "priceMax", "value": 50, "label": "Under $50" }
  ],
  "suggestions": ["red running shoes nike", "red trail running shoes"],
  "spellCorrection": null
}
```

### GET /api/v2/search/suggestions

**Query Params:** `q` (partial query), `locale`, `limit` (default 8)

**Response:**
```json
{
  "suggestions": [
    { "text": "red running shoes", "type": "QUERY", "resultCount": 342 },
    { "text": "Red Nike Air Max", "type": "PRODUCT", "productId": "abc123", "thumbnail": "url" },
    { "text": "Running Shoes", "type": "CATEGORY", "categoryId": "cat-456" }
  ],
  "trending": ["wireless earbuds", "spring jacket", "protein powder"]
}
```

## Non-Functional Requirements

- **Latency:** Suggestions < 100ms (p95), full search < 300ms (p95)
- **Availability:** 99.95% uptime
- **Accessibility:** WCAG 2.1 AA compliant, full keyboard navigation, screen reader support
- **Analytics Events:** `search_initiated`, `suggestion_clicked`, `chip_added`, `chip_removed`, `result_clicked`, `search_abandoned`

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Search-to-purchase time | 4.2 min | < 3.0 min |
| Search conversion rate | 12% | > 14% |
| Avg. search refinements | 3.1 | < 1.5 |
| Zero-result rate | 18% | < 8% |

## Technical Constraints

- Frontend: React 18 + TypeScript, must integrate with existing Next.js app router
- State management: Zustand (existing pattern in codebase)
- Styling: Tailwind CSS + existing design system tokens
- Must support SSR for initial search page load
- Mobile viewport breakpoint: 768px

## Out of Scope (v1)

- Image-based search (camera icon placeholder only)
- Personalized ranking based on purchase history (v2)
- Search within specific seller stores

## Timeline

- **Design Review:** Week 1
- **Frontend Dev:** Weeks 2-4
- **Backend Integration:** Weeks 3-5
- **QA & A/B Test:** Week 6
- **Rollout:** Week 7 (10% → 50% → 100%)

## Dependencies

- AI/ML team: NLU model endpoint ready by Week 2
- Platform team: Search indexing pipeline supports new schema
- Design: Final Figma handoff by end of Week 1

---

*Author: Product Team | Last Updated: 2026-03-20 | Status: Approved*
