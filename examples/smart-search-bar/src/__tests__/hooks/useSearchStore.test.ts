// ---------------------------------------------------------------------------
// Mock the search-api module — must be before imports that use it
// ---------------------------------------------------------------------------

const mockSmartSearch = jest.fn();
const mockFetchSuggestions = jest.fn();

jest.mock('@/lib/search-api', () => {
  class RateLimitError extends Error {
    constructor(msg = 'Too many requests. Please try again later.') {
      super(msg);
      this.name = 'RateLimitError';
    }
  }
  return {
    smartSearch: (...args: unknown[]) => mockSmartSearch(...args),
    fetchSuggestions: (...args: unknown[]) => mockFetchSuggestions(...args),
    RateLimitError,
  };
});

import { useSearchStore, type SearchState } from '@/hooks/useSearchStore';
import type {
  SmartSearchResponse,
  SuggestionsResponse,
  FilterChip,
} from '@/lib/types';
import { SuggestionType } from '@/lib/types';
import { RateLimitError } from '@/lib/search-api';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getState(): SearchState {
  return useSearchStore.getState();
}

function resetStore() {
  useSearchStore.setState({
    query: '',
    results: [],
    totalCount: 0,
    isLoading: false,
    error: null,
    suggestions: [],
    isSuggestionsLoading: false,
    showSuggestions: false,
    activeSuggestionIndex: -1,
    chips: [],
    spellCorrection: null,
    trending: [],
    abortController: null,
  });
}

const mockSearchResponse: SmartSearchResponse = {
  results: [
    {
      productId: 'p1',
      title: 'Test Product',
      thumbnail: '/img.jpg',
      price: { current: 29.99, original: null, currency: 'USD' },
      rating: { average: 4.5, count: 100 },
      badges: ['BEST_SELLER'],
    },
  ],
  totalCount: 1,
  parsedFilters: {},
  suggestedChips: [{ key: 'category', value: 'shoes', label: 'Shoes' }],
  suggestions: [],
  spellCorrection: null,
};

const mockSuggestionsResponse: SuggestionsResponse = {
  suggestions: [
    { text: 'running shoes', type: SuggestionType.QUERY, resultCount: 10 },
    {
      text: 'Nike Air Zoom',
      type: SuggestionType.PRODUCT,
      productId: 'p1',
      thumbnail: '/img.jpg',
    },
  ],
  trending: ['wireless earbuds', 'spring jacket'],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useSearchStore', () => {
  beforeEach(() => {
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
  });

  // -- Initial state --------------------------------------------------------

  describe('initial state', () => {
    it('has empty query', () => {
      expect(getState().query).toBe('');
    });

    it('has empty results', () => {
      expect(getState().results).toEqual([]);
      expect(getState().totalCount).toBe(0);
    });

    it('is not loading', () => {
      expect(getState().isLoading).toBe(false);
    });

    it('has no error', () => {
      expect(getState().error).toBeNull();
    });

    it('has empty chips', () => {
      expect(getState().chips).toEqual([]);
    });

    it('has no spell correction', () => {
      expect(getState().spellCorrection).toBeNull();
    });

    it('has suggestions hidden', () => {
      expect(getState().showSuggestions).toBe(false);
      expect(getState().activeSuggestionIndex).toBe(-1);
    });
  });

  // -- setQuery -------------------------------------------------------------

  describe('setQuery', () => {
    it('updates the query', () => {
      getState().setQuery('shoes');
      expect(getState().query).toBe('shoes');
    });
  });

  // -- clearSearch ----------------------------------------------------------

  describe('clearSearch', () => {
    it('resets all search state', () => {
      useSearchStore.setState({
        query: 'shoes',
        results: mockSearchResponse.results,
        totalCount: 5,
        chips: [{ key: 'color', value: 'red', label: 'Red' }],
        spellCorrection: { corrected: 'shoes', original: 'sheos' },
        error: 'some error',
        showSuggestions: true,
        activeSuggestionIndex: 2,
      });

      getState().clearSearch();

      const s = getState();
      expect(s.query).toBe('');
      expect(s.results).toEqual([]);
      expect(s.totalCount).toBe(0);
      expect(s.chips).toEqual([]);
      expect(s.spellCorrection).toBeNull();
      expect(s.error).toBeNull();
      expect(s.showSuggestions).toBe(false);
      expect(s.activeSuggestionIndex).toBe(-1);
    });
  });

  // -- Chips ----------------------------------------------------------------

  describe('addChip / removeChip', () => {
    it('adds a chip', () => {
      const chip: FilterChip = { key: 'color', value: 'blue', label: 'Blue' };
      getState().addChip(chip);
      expect(getState().chips).toEqual([chip]);
    });

    it('replaces a chip with the same key', () => {
      getState().addChip({ key: 'color', value: 'blue', label: 'Blue' });
      getState().addChip({ key: 'color', value: 'red', label: 'Red' });
      expect(getState().chips).toHaveLength(1);
      expect(getState().chips[0].value).toBe('red');
    });

    it('adds multiple chips with different keys', () => {
      getState().addChip({ key: 'color', value: 'blue', label: 'Blue' });
      getState().addChip({ key: 'priceMax', value: 50, label: 'Under $50' });
      expect(getState().chips).toHaveLength(2);
    });

    it('removes a chip by key', () => {
      getState().addChip({ key: 'color', value: 'blue', label: 'Blue' });
      getState().addChip({ key: 'priceMax', value: 50, label: 'Under $50' });
      getState().removeChip('color');
      expect(getState().chips).toHaveLength(1);
      expect(getState().chips[0].key).toBe('priceMax');
    });

    it('does nothing when removing a non-existent key', () => {
      getState().addChip({ key: 'color', value: 'blue', label: 'Blue' });
      getState().removeChip('nonexistent');
      expect(getState().chips).toHaveLength(1);
    });
  });

  // -- search() -------------------------------------------------------------

  describe('search', () => {
    it('calls smartSearch API and updates results', async () => {
      mockSmartSearch.mockResolvedValueOnce(mockSearchResponse);

      await getState().search('shoes');

      expect(mockSmartSearch).toHaveBeenCalledTimes(1);
      expect(mockSmartSearch).toHaveBeenCalledWith(
        expect.objectContaining({ query: 'shoes' }),
        expect.any(AbortSignal),
      );
      expect(getState().results).toEqual(mockSearchResponse.results);
      expect(getState().totalCount).toBe(1);
      expect(getState().chips).toEqual(mockSearchResponse.suggestedChips);
      expect(getState().isLoading).toBe(false);
    });

    it('sets isLoading to true while searching', async () => {
      let resolveSearch!: (value: SmartSearchResponse) => void;
      mockSmartSearch.mockReturnValueOnce(
        new Promise<SmartSearchResponse>((resolve) => {
          resolveSearch = resolve;
        }),
      );

      const searchPromise = getState().search('shoes');
      expect(getState().isLoading).toBe(true);

      resolveSearch(mockSearchResponse);
      await searchPromise;

      expect(getState().isLoading).toBe(false);
    });

    it('handles RateLimitError (429)', async () => {
      mockSmartSearch.mockRejectedValueOnce(
        new RateLimitError('Too many requests. Please try again later.'),
      );

      await getState().search('shoes');

      expect(getState().error).toBe(
        'Too many requests. Please try again later.',
      );
      expect(getState().isLoading).toBe(false);
    });

    it('handles generic errors with a user-friendly message', async () => {
      mockSmartSearch.mockRejectedValueOnce(new Error('Network error'));

      await getState().search('shoes');

      expect(getState().error).toBe(
        'An unexpected error occurred. Please try again.',
      );
      expect(getState().isLoading).toBe(false);
    });

    it('aborts previous in-flight request when a new search starts', async () => {
      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      // First search: resolves with AbortError (simulating abort behavior)
      mockSmartSearch.mockRejectedValueOnce(
        new DOMException('Aborted', 'AbortError'),
      );

      // Start the first search
      const firstSearch = getState().search('first');

      // Second search: resolves immediately
      mockSmartSearch.mockResolvedValueOnce(mockSearchResponse);
      const secondSearch = getState().search('second');

      // abort() should have been called for the first request
      expect(abortSpy).toHaveBeenCalledTimes(1);

      await firstSearch;
      await secondSearch;
      expect(getState().results).toEqual(mockSearchResponse.results);

      abortSpy.mockRestore();
    });

    it('ignores AbortError (does not set error state)', async () => {
      const abortError = new DOMException('Aborted', 'AbortError');
      mockSmartSearch.mockRejectedValueOnce(abortError);

      await getState().search('shoes');

      expect(getState().error).toBeNull();
    });

    it('updates spellCorrection from response', async () => {
      const responseWithCorrection: SmartSearchResponse = {
        ...mockSearchResponse,
        spellCorrection: { corrected: 'shoes', original: 'sheos' },
      };
      mockSmartSearch.mockResolvedValueOnce(responseWithCorrection);

      await getState().search('sheos');

      expect(getState().spellCorrection).toEqual({
        corrected: 'shoes',
        original: 'sheos',
      });
    });
  });

  // -- fetchSuggestions() ---------------------------------------------------

  describe('fetchSuggestions', () => {
    it('calls fetchSuggestions API and updates suggestions', async () => {
      mockFetchSuggestions.mockResolvedValueOnce(mockSuggestionsResponse);

      await getState().fetchSuggestions('run');

      expect(mockFetchSuggestions).toHaveBeenCalledWith('run');
      expect(getState().suggestions).toEqual(
        mockSuggestionsResponse.suggestions,
      );
      expect(getState().trending).toEqual(mockSuggestionsResponse.trending);
      expect(getState().isSuggestionsLoading).toBe(false);
    });

    it('sets isSuggestionsLoading during fetch', async () => {
      let resolveFetch!: (value: SuggestionsResponse) => void;
      mockFetchSuggestions.mockReturnValueOnce(
        new Promise<SuggestionsResponse>((resolve) => {
          resolveFetch = resolve;
        }),
      );

      const fetchPromise = getState().fetchSuggestions('run');
      expect(getState().isSuggestionsLoading).toBe(true);

      resolveFetch(mockSuggestionsResponse);
      await fetchPromise;

      expect(getState().isSuggestionsLoading).toBe(false);
    });

    it('silently swallows non-abort errors', async () => {
      mockFetchSuggestions.mockRejectedValueOnce(new Error('Network failure'));

      await getState().fetchSuggestions('run');

      // Should not set error, just stop loading
      expect(getState().error).toBeNull();
      expect(getState().isSuggestionsLoading).toBe(false);
    });
  });

  // -- URL sync -------------------------------------------------------------

  describe('syncFromURL', () => {
    it('parses query from URL params', () => {
      const params = new URLSearchParams('q=running+shoes');
      getState().syncFromURL(params);
      expect(getState().query).toBe('running shoes');
    });

    it('parses priceMin and priceMax into chips', () => {
      const params = new URLSearchParams('q=shoes&priceMin=20&priceMax=100');
      getState().syncFromURL(params);

      const chips = getState().chips;
      expect(chips).toHaveLength(2);
      expect(chips.find((c) => c.key === 'priceMin')?.value).toBe(20);
      expect(chips.find((c) => c.key === 'priceMax')?.value).toBe(100);
    });

    it('parses category params into chips', () => {
      const params = new URLSearchParams(
        'q=shoes&categories=running+shoes&categories=sneakers',
      );
      getState().syncFromURL(params);

      const categoryChips = getState().chips.filter(
        (c) => c.key === 'category',
      );
      expect(categoryChips).toHaveLength(2);
    });

    it('defaults to empty query when q param is absent', () => {
      const params = new URLSearchParams('priceMax=50');
      getState().syncFromURL(params);
      expect(getState().query).toBe('');
    });
  });

  describe('toURLParams', () => {
    it('serializes query to URL params', () => {
      getState().setQuery('headphones');
      const params = getState().toURLParams();
      expect(params.get('q')).toBe('headphones');
    });

    it('serializes priceMax chip to URL params', () => {
      getState().setQuery('shoes');
      getState().addChip({ key: 'priceMax', value: 50, label: 'Under $50' });
      const params = getState().toURLParams();
      expect(params.get('priceMax')).toBe('50');
    });

    it('serializes category chips to URL params', () => {
      getState().setQuery('shoes');
      getState().addChip({
        key: 'category',
        value: 'running shoes',
        label: 'running shoes',
      });
      const params = getState().toURLParams();
      expect(params.get('categories')).toBe('running shoes');
    });

    it('returns empty params when state is empty', () => {
      const params = getState().toURLParams();
      expect(params.toString()).toBe('');
    });
  });
});
