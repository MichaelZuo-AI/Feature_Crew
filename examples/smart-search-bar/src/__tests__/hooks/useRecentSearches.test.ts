import { renderHook, act } from '@testing-library/react';
import { useRecentSearches } from '@/hooks/useRecentSearches';

// ---------------------------------------------------------------------------
// Mock localStorage
// ---------------------------------------------------------------------------

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((_index: number) => null),
    _store: store,
    _reset() {
      store = {};
      this.getItem.mockClear();
      this.setItem.mockClear();
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useRecentSearches', () => {
  beforeEach(() => {
    localStorageMock._reset();
  });

  it('initializes with an empty array', () => {
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recentSearches).toEqual([]);
  });

  it('adds a search and persists to localStorage', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addRecentSearch('wireless earbuds');
    });

    expect(result.current.recentSearches).toEqual(['wireless earbuds']);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'smart-search-recent',
      JSON.stringify(['wireless earbuds']),
    );
  });

  it('prepends new searches (most recent first)', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addRecentSearch('shoes');
    });
    act(() => {
      result.current.addRecentSearch('headphones');
    });

    expect(result.current.recentSearches).toEqual(['headphones', 'shoes']);
  });

  it('caps entries at 10 (FIFO)', () => {
    const { result } = renderHook(() => useRecentSearches());

    for (let i = 1; i <= 12; i++) {
      act(() => {
        result.current.addRecentSearch(`search-${i}`);
      });
    }

    expect(result.current.recentSearches).toHaveLength(10);
    // Most recent should be first
    expect(result.current.recentSearches[0]).toBe('search-12');
    // Oldest kept should be search-3
    expect(result.current.recentSearches[9]).toBe('search-3');
  });

  it('deduplicates by moving existing entry to the top', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addRecentSearch('alpha');
    });
    act(() => {
      result.current.addRecentSearch('beta');
    });
    act(() => {
      result.current.addRecentSearch('gamma');
    });

    // Now re-add "alpha" — it should move to top, not duplicate
    act(() => {
      result.current.addRecentSearch('alpha');
    });

    expect(result.current.recentSearches).toEqual(['alpha', 'gamma', 'beta']);
  });

  it('removes a specific search', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addRecentSearch('one');
    });
    act(() => {
      result.current.addRecentSearch('two');
    });
    act(() => {
      result.current.addRecentSearch('three');
    });

    act(() => {
      result.current.removeRecentSearch('two');
    });

    expect(result.current.recentSearches).toEqual(['three', 'one']);
  });

  it('clears all searches', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addRecentSearch('a');
    });
    act(() => {
      result.current.addRecentSearch('b');
    });

    act(() => {
      result.current.clearRecentSearches();
    });

    expect(result.current.recentSearches).toEqual([]);
  });

  it('ignores empty/whitespace-only strings', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addRecentSearch('   ');
    });
    act(() => {
      result.current.addRecentSearch('');
    });

    expect(result.current.recentSearches).toEqual([]);
  });

  it('trims whitespace from added searches', () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addRecentSearch('  shoes  ');
    });

    expect(result.current.recentSearches).toEqual(['shoes']);
  });
});
