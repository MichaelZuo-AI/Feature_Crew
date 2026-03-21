"use client";

import { create } from "zustand";

import type {
  FilterChip,
  SearchFilters,
  SearchResult,
  SpellCorrection,
  Suggestion,
} from "@/lib/types";
import {
  smartSearch as apiSmartSearch,
  fetchSuggestions as apiFetchSuggestions,
  RateLimitError,
} from "@/lib/search-api";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface SearchState {
  // Query
  query: string;
  setQuery: (query: string) => void;

  // Results
  results: SearchResult[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;

  // Suggestions
  suggestions: Suggestion[];
  isSuggestionsLoading: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  activeSuggestionIndex: number;
  setActiveSuggestionIndex: (index: number) => void;

  // Filter chips
  chips: FilterChip[];
  addChip: (chip: FilterChip) => void;
  removeChip: (key: string) => void;
  setChips: (chips: FilterChip[]) => void;

  // Spell correction
  spellCorrection: SpellCorrection | null;

  // Trending
  trending: string[];

  // Popular products (for no-results fallback)
  popularProducts: SearchResult[];

  // Actions
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  fetchSuggestions: (query: string) => Promise<void>;
  fetchPopularProducts: () => Promise<void>;
  clearSearch: () => void;

  // URL sync
  syncFromURL: (params: URLSearchParams) => void;
  toURLParams: () => URLSearchParams;

  // Internal
  abortController: AbortController | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function filtersFromChips(chips: FilterChip[]): SearchFilters {
  let priceMin: number | null = null;
  let priceMax: number | null = null;
  const categories: string[] = [];
  const attributes: Record<string, string> = {};

  for (const chip of chips) {
    if (chip.key === "priceMin") {
      priceMin = Number(chip.value);
    } else if (chip.key === "priceMax") {
      priceMax = Number(chip.value);
    } else if (chip.key === "category") {
      categories.push(String(chip.value));
    } else {
      attributes[chip.key] = String(chip.value);
    }
  }

  return { priceMin, priceMax, categories, attributes };
}

function chipsToURLParams(query: string, chips: FilterChip[]): URLSearchParams {
  const params = new URLSearchParams();
  if (query) params.set("q", query);

  for (const chip of chips) {
    if (chip.key === "priceMin") params.set("priceMin", String(chip.value));
    else if (chip.key === "priceMax") params.set("priceMax", String(chip.value));
    else if (chip.key === "category") params.append("categories", String(chip.value));
  }

  return params;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSearchStore = create<SearchState>()((set, get) => ({
  // -- Query -----------------------------------------------------------------
  query: "",
  setQuery: (query) => set({ query }),

  // -- Results ---------------------------------------------------------------
  results: [],
  totalCount: 0,
  isLoading: false,
  error: null,

  // -- Suggestions -----------------------------------------------------------
  suggestions: [],
  isSuggestionsLoading: false,
  showSuggestions: false,
  setShowSuggestions: (show) => set({ showSuggestions: show }),
  activeSuggestionIndex: -1,
  setActiveSuggestionIndex: (index) => set({ activeSuggestionIndex: index }),

  // -- Chips -----------------------------------------------------------------
  chips: [],
  addChip: (chip) =>
    set((state) => ({
      chips: [...state.chips.filter((c) => c.key !== chip.key), chip],
    })),
  removeChip: (key) =>
    set((state) => ({
      chips: state.chips.filter((c) => c.key !== key),
    })),
  setChips: (chips) => set({ chips }),

  // -- Spell correction ------------------------------------------------------
  spellCorrection: null,

  // -- Trending --------------------------------------------------------------
  trending: [],

  // -- Popular products (fallback) -----------------------------------------
  popularProducts: [],

  // -- Actions ---------------------------------------------------------------

  search: async (query, filters) => {
    const state = get();

    // Abort any in-flight request
    state.abortController?.abort();

    const controller = new AbortController();
    set({ isLoading: true, error: null, abortController: controller });

    const resolvedFilters = filters ?? filtersFromChips(state.chips);

    try {
      const response = await apiSmartSearch(
        {
          query,
          locale: "en-US",
          page: 1,
          pageSize: 20,
          sessionId: "",
          filters: resolvedFilters,
        },
        controller.signal,
      );

      set({
        results: response.results,
        totalCount: response.totalCount,
        chips: response.suggestedChips,
        spellCorrection: response.spellCorrection,
        isLoading: false,
        abortController: null,
      });
    } catch (err: unknown) {
      // Ignore aborted requests
      if (err instanceof DOMException && err.name === "AbortError") return;

      const message =
        err instanceof RateLimitError
          ? err.message
          : "An unexpected error occurred. Please try again.";

      set({ error: message, isLoading: false, abortController: null });
    }
  },

  fetchSuggestions: async (query) => {
    set({ isSuggestionsLoading: true });

    try {
      const response = await apiFetchSuggestions(query);
      set({
        suggestions: response.suggestions,
        trending: response.trending,
        isSuggestionsLoading: false,
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      // Silently swallow suggestion errors — non-critical
      set({ isSuggestionsLoading: false });
    }
  },

  fetchPopularProducts: async () => {
    try {
      const response = await apiSmartSearch(
        {
          query: "",
          locale: "en-US",
          page: 1,
          pageSize: 4,
          sessionId: "",
          filters: { priceMin: null, priceMax: null, categories: [], attributes: {} },
        },
      );
      set({ popularProducts: response.results });
    } catch {
      // Silently fail — popular products are non-critical
    }
  },

  clearSearch: () =>
    set({
      query: "",
      results: [],
      totalCount: 0,
      chips: [],
      suggestions: [],
      showSuggestions: false,
      activeSuggestionIndex: -1,
      spellCorrection: null,
      error: null,
    }),

  // -- URL sync --------------------------------------------------------------

  syncFromURL: (params) => {
    const q = params.get("q") ?? "";
    const chips: FilterChip[] = [];

    const priceMin = params.get("priceMin");
    if (priceMin) {
      chips.push({ key: "priceMin", value: Number(priceMin), label: `Min $${priceMin}` });
    }

    const priceMax = params.get("priceMax");
    if (priceMax) {
      chips.push({ key: "priceMax", value: Number(priceMax), label: `Max $${priceMax}` });
    }

    const categories = params.getAll("categories");
    for (const cat of categories) {
      chips.push({ key: "category", value: cat, label: cat });
    }

    set({ query: q, chips });
  },

  toURLParams: () => {
    const { query, chips } = get();
    return chipsToURLParams(query, chips);
  },

  // -- Internal --------------------------------------------------------------
  abortController: null,
}));
