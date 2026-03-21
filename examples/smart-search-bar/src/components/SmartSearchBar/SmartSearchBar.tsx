'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useSearchStore } from '@/hooks/useSearchStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import {
  useMediaQuery,
  MOBILE_BREAKPOINT,
  SMALL_MOBILE_BREAKPOINT,
} from '@/hooks/useMediaQuery';
import {
  trackSearchInitiated,
  trackSuggestionClicked,
  trackChipAdded,
  trackChipRemoved,
  trackResultClicked,
  trackSearchAbandoned,
} from '@/lib/analytics';
import SearchInput from './SearchInput';
import SuggestionsDropdown from './SuggestionsDropdown';
import FilterChips from './FilterChips';
import ResultsPreview from './ResultsPreview';
import type { SearchResult } from '@/lib/types';

export default function SmartSearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasSearched = useRef(false);

  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
  const isSmallMobile = useMediaQuery(SMALL_MOBILE_BREAKPOINT);

  const { recentSearches, addRecentSearch, removeRecentSearch } =
    useRecentSearches();

  const {
    query,
    setQuery,
    results,
    totalCount,
    isLoading,
    error,
    suggestions,
    isSuggestionsLoading,
    showSuggestions,
    setShowSuggestions,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    chips,
    removeChip,
    spellCorrection,
    trending,
    popularProducts,
    search,
    fetchSuggestions,
    fetchPopularProducts,
    clearSearch,
    toURLParams,
  } = useSearchStore();

  const debouncedQuery = useDebounce(query, 300);

  // Fetch popular products on mount for no-results fallback (AC-24/25)
  useEffect(() => {
    fetchPopularProducts();
  }, [fetchPopularProducts]);

  // Track chip_added when chips change from API response (AC-44)
  const prevChipKeysRef = useRef<string>('');
  useEffect(() => {
    const currentKeys = chips.map((c) => c.key).join(',');
    if (prevChipKeysRef.current !== '' && currentKeys !== prevChipKeysRef.current) {
      const prevKeys = new Set(prevChipKeysRef.current.split(',').filter(Boolean));
      for (const chip of chips) {
        if (!prevKeys.has(chip.key)) {
          trackChipAdded(chip.key, chip.value);
        }
      }
    }
    prevChipKeysRef.current = currentKeys;
  }, [chips]);

  // Fetch suggestions AND search in parallel when debounced query changes (AC-16)
  useEffect(() => {
    if (debouncedQuery.trim()) {
      fetchSuggestions(debouncedQuery);
      search(debouncedQuery);
      hasSearched.current = true;
    }
  }, [debouncedQuery, fetchSuggestions, search]);

  // Update URL after search completes (AC-26)
  useEffect(() => {
    if (hasSearched.current && !isLoading && typeof window !== 'undefined') {
      const params = toURLParams();
      const url = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', url);
    }
  }, [isLoading, toURLParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  const handleSubmit = useCallback(
    (q: string) => {
      setShowSuggestions(false);
      addRecentSearch(q);
      search(q);
      hasSearched.current = true;
      trackSearchInitiated(q, 0);
    },
    [setShowSuggestions, addRecentSearch, search],
  );

  const handleSuggestionSelect = useCallback(
    (text: string) => {
      setQuery(text);
      setShowSuggestions(false);
      addRecentSearch(text);
      search(text);
      hasSearched.current = true;
      trackSuggestionClicked(text, 0);
    },
    [setQuery, setShowSuggestions, addRecentSearch, search],
  );

  const handleClear = useCallback(() => {
    trackSearchAbandoned(query);
    clearSearch();
    hasSearched.current = false;
    inputRef.current?.focus();
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [clearSearch, query]);

  const handleFocus = useCallback(() => {
    setShowSuggestions(true);
    if (!query.trim()) {
      fetchSuggestions('');
    }
  }, [setShowSuggestions, query, fetchSuggestions]);

  // Build a flat list of all suggestion texts for keyboard nav
  // MUST match the render order in SuggestionsDropdown: QUERY, PRODUCT, CATEGORY, trending
  const allSuggestionTexts = (() => {
    if (query.trim()) {
      const querySugs = suggestions.filter((s) => s.type === 'QUERY').map((s) => s.text);
      const productSugs = suggestions.filter((s) => s.type === 'PRODUCT').slice(0, 3).map((s) => s.text);
      const categorySugs = suggestions.filter((s) => s.type === 'CATEGORY').map((s) => s.text);
      return [...querySugs, ...productSugs, ...categorySugs, ...trending];
    }
    return [...recentSearches, ...trending];
  })();
  const totalSuggestionItems = allSuggestionTexts.length;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Backspace on empty input removes last chip (AC-36)
      if (e.key === 'Backspace' && query === '' && chips.length > 0) {
        const lastChip = chips[chips.length - 1];
        removeChip(lastChip.key);
        trackChipRemoved(lastChip.key);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!showSuggestions) {
          setShowSuggestions(true);
          return;
        }
        // Wrap-around (AC-32)
        const next = activeSuggestionIndex + 1;
        setActiveSuggestionIndex(next >= totalSuggestionItems ? 0 : next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!showSuggestions) return;
        // Wrap-around (AC-32)
        const prev = activeSuggestionIndex - 1;
        setActiveSuggestionIndex(prev < 0 ? totalSuggestionItems - 1 : prev);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        // Clear focus per AC-34
        inputRef.current?.blur();
      } else if (e.key === 'Enter') {
        if (showSuggestions && activeSuggestionIndex >= 0) {
          e.preventDefault();
          const selectedText = allSuggestionTexts[activeSuggestionIndex];
          if (selectedText) {
            handleSuggestionSelect(selectedText);
          }
        }
      } else if (e.key === 'Tab') {
        // AC-35: Tab exits dropdown, moves focus to chips then results
        if (showSuggestions) {
          setShowSuggestions(false);
          setActiveSuggestionIndex(-1);
          // Let browser handle natural Tab focus order to chips/results
        }
      }
    },
    [
      query,
      chips,
      removeChip,
      showSuggestions,
      activeSuggestionIndex,
      totalSuggestionItems,
      allSuggestionTexts,
      setActiveSuggestionIndex,
      setShowSuggestions,
      handleSuggestionSelect,
    ],
  );

  // Reset active suggestion index when query changes
  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [query, setActiveSuggestionIndex]);

  const handleChipRemove = useCallback(
    (key: string) => {
      const chip = chips.find((c) => c.key === key);
      removeChip(key);
      trackChipRemoved(key);
    },
    [chips, removeChip],
  );

  // Re-search when chips change (after removal)
  const chipKeys = chips.map((c) => c.key).join(',');
  useEffect(() => {
    if (hasSearched.current && query.trim()) {
      search(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chipKeys]);

  const handleProductClick = useCallback((productId: string) => {
    trackResultClicked(productId, 0);
  }, []);

  const handleSearchOriginal = useCallback(
    (originalQuery: string) => {
      setQuery(originalQuery);
      search(originalQuery);
      trackSearchInitiated(originalQuery, 0);
    },
    [setQuery, search],
  );

  // Use popular products for no-results/error fallback (AC-24/25)

  return (
    <div ref={containerRef} className="relative w-full">
      <SearchInput
        query={query}
        onQueryChange={setQuery}
        onFocus={handleFocus}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        isMobile={isMobile}
        ariaExpanded={showSuggestions}
        ariaActiveDescendant={
          activeSuggestionIndex >= 0
            ? `suggestion-${activeSuggestionIndex}`
            : undefined
        }
        ariaControls="suggestions-listbox"
      />

      {showSuggestions && (
        <SuggestionsDropdown
          suggestions={suggestions}
          trending={trending}
          recentSearches={recentSearches}
          query={query}
          activeSuggestionIndex={activeSuggestionIndex}
          isLoading={isSuggestionsLoading}
          isVisible={showSuggestions}
          isMobileOverlay={isSmallMobile}
          onSelect={handleSuggestionSelect}
          onClose={() => setShowSuggestions(false)}
          onRemoveRecent={removeRecentSearch}
        />
      )}

      {chips.length > 0 && (
        <FilterChips
          chips={chips}
          onRemoveChip={handleChipRemove}
          isSmallMobile={isSmallMobile}
        />
      )}

      {hasSearched.current && (
        <ResultsPreview
          results={results}
          totalCount={totalCount}
          query={query}
          isLoading={isLoading}
          spellCorrection={spellCorrection}
          error={error}
          trending={popularProducts}
          isMobile={isMobile}
          onProductClick={handleProductClick}
          onSearchOriginal={handleSearchOriginal}
        />
      )}
    </div>
  );
}
