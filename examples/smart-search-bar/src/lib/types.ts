// ---------------------------------------------------------------------------
// Smart Search API – Type Definitions
// POST /api/v2/search/smart | GET /api/v2/search/suggestions
// ---------------------------------------------------------------------------

// ---- Enums ----------------------------------------------------------------

export enum SuggestionType {
  QUERY = "QUERY",
  PRODUCT = "PRODUCT",
  CATEGORY = "CATEGORY",
}

// ---- Shared / Reusable Types ----------------------------------------------

export interface SearchFilters {
  priceMin: number | null;
  priceMax: number | null;
  categories: string[];
  attributes: Record<string, string>;
}

export interface FilterChip {
  key: string;
  value: string | number;
  label: string;
}

// ---- POST /api/v2/search/smart --------------------------------------------

export interface SmartSearchRequest {
  query: string;
  locale: string;
  page: number;
  pageSize: number;
  sessionId: string;
  filters: SearchFilters;
}

export interface ProductPrice {
  current: number;
  original: number | null;
  currency: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface SearchResult {
  productId: string;
  title: string;
  thumbnail: string;
  price: ProductPrice;
  rating: ProductRating;
  badges: string[];
}

export interface SpellCorrection {
  corrected: string;
  original: string;
}

export interface SmartSearchResponse {
  results: SearchResult[];
  totalCount: number;
  parsedFilters: Record<string, string | number>;
  suggestedChips: FilterChip[];
  suggestions: string[];
  spellCorrection: SpellCorrection | null;
}

// ---- GET /api/v2/search/suggestions ---------------------------------------

export interface Suggestion {
  text: string;
  type: SuggestionType;
  resultCount?: number;
  productId?: string;
  thumbnail?: string;
  categoryId?: string;
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
  trending: string[];
}

// ---- Analytics ------------------------------------------------------------

export type AnalyticsEventName =
  | "search_initiated"
  | "suggestion_clicked"
  | "chip_added"
  | "chip_removed"
  | "result_clicked"
  | "search_abandoned";

export interface AnalyticsEvent {
  event: AnalyticsEventName;
  timestamp: number;
  sessionId: string;
  payload: Record<string, unknown>;
}
