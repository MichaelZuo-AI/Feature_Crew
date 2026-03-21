import React from 'react';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchStore } from '@/hooks/useSearchStore';
import type {
  SmartSearchResponse,
  SuggestionsResponse,
} from '@/lib/types';
import { SuggestionType } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSmartSearch = jest.fn<Promise<SmartSearchResponse>, [unknown, unknown?]>();
const mockFetchSuggestions = jest.fn<Promise<SuggestionsResponse>, [string, string?, number?, AbortSignal?]>();

jest.mock('@/lib/search-api', () => ({
  smartSearch: (...args: [unknown, unknown?]) => mockSmartSearch(...args),
  fetchSuggestions: (...args: [string, string?, number?, AbortSignal?]) =>
    mockFetchSuggestions(...args),
  RateLimitError: class RateLimitError extends Error {
    constructor(message = 'Too many requests. Please try again later.') {
      super(message);
      this.name = 'RateLimitError';
    }
  },
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({
      href,
      children,
      ...rest
    }: {
      href: string;
      children: React.ReactNode;
      [key: string]: unknown;
    }) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
    ),
  };
});

jest.mock('@/components/icons', () => ({
  SearchIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="search-icon" {...props} />
  ),
  CameraIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="camera-icon" {...props} />
  ),
  MicrophoneIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="microphone-icon" {...props} />
  ),
  CloseIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="close-icon" {...props} />
  ),
  ClockIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="clock-icon" {...props} />
  ),
  FireIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="fire-icon" {...props} />
  ),
  ArrowLeftIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="arrow-left-icon" {...props} />
  ),
  FolderIcon: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="folder-icon" {...props} />
  ),
}));

// Mock window.matchMedia for useMediaQuery
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// Mock localStorage
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
    key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockSearchResponse: SmartSearchResponse = {
  results: [
    {
      productId: 'p1',
      title: 'Red Running Shoes',
      thumbnail: '/img/p1.jpg',
      price: { current: 49.99, original: 79.99, currency: 'USD' },
      rating: { average: 4.5, count: 100 },
      badges: ['SALE'],
    },
  ],
  totalCount: 1,
  parsedFilters: { color: 'red' },
  suggestedChips: [{ key: 'color', value: 'red', label: 'Red' }],
  suggestions: ['red running shoes nike'],
  spellCorrection: null,
};

const mockSuggestionsResponse: SuggestionsResponse = {
  suggestions: [
    { text: 'red running shoes', type: SuggestionType.QUERY, resultCount: 10 },
    {
      text: 'Red Nike Air Max',
      type: SuggestionType.PRODUCT,
      productId: 'p2',
      thumbnail: '/img/p2.jpg',
    },
  ],
  trending: ['wireless earbuds', 'spring jacket'],
};

// ---------------------------------------------------------------------------
// Import component under test (AFTER mocks are set up)
// ---------------------------------------------------------------------------

import SmartSearchBar from '@/components/SmartSearchBar/SmartSearchBar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
    popularProducts: [],
    abortController: null,
  });
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('SmartSearchBar (orchestrator)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockPush.mockReset();
    mockReplace.mockReset();

    // Default mock implementations: resolve immediately
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // 1
  it('renders search input with placeholder', () => {
    render(<SmartSearchBar />);
    expect(
      screen.getByPlaceholderText('Search for anything...'),
    ).toBeInTheDocument();
  });

  // 2
  it('shows suggestions on focus', async () => {
    render(<SmartSearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
    });

    // fetchSuggestions is called with empty string on focus when query is empty
    await act(async () => {
      jest.runAllTimers();
    });

    // The store's fetchSuggestions calls apiFetchSuggestions
    expect(mockFetchSuggestions).toHaveBeenCalled();
  });

  // 3
  it('debounces search and suggestions in parallel', async () => {
    render(<SmartSearchBar />);

    const input = screen.getByRole('combobox');

    // Type "red shoes" by setting state directly (simulating typing)
    await act(async () => {
      fireEvent.change(input, { target: { value: 'red shoes' } });
    });

    // At this point the debounce timer has not fired yet
    expect(mockSmartSearch).not.toHaveBeenCalledWith(
      expect.objectContaining({ query: 'red shoes' }),
      expect.anything(),
    );

    // Advance past debounce delay (300ms)
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Now both search and fetchSuggestions should have been called
    // smartSearch is called through the store's search action
    await waitFor(() => {
      expect(mockSmartSearch).toHaveBeenCalled();
      expect(mockFetchSuggestions).toHaveBeenCalledWith('red shoes');
    });
  });

  // 4
  it('fires search_initiated analytics on submit', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<SmartSearchBar />);

    // Set query in store and re-render
    await act(async () => {
      useSearchStore.setState({ query: 'red shoes' });
    });

    const form = screen.getByRole('combobox').closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    // Flush promises for the search call
    await act(async () => {
      jest.runAllTimers();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('search_initiated'),
      expect.objectContaining({ query: 'red shoes' }),
    );

    consoleSpy.mockRestore();
  });

  // 5
  it('shows results after search', async () => {
    // Pre-populate the store with results as if a search completed
    await act(async () => {
      useSearchStore.setState({
        query: 'red shoes',
        results: mockSearchResponse.results,
        totalCount: mockSearchResponse.totalCount,
      });
    });

    render(<SmartSearchBar />);

    // Trigger a search so hasSearched ref becomes true
    const form = screen.getByRole('combobox').closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Red Running Shoes')).toBeInTheDocument();
    });
  });

  // 6
  it('removes chip on X click', async () => {
    const bothChips = [
      { key: 'color', value: 'red', label: 'Red' },
      { key: 'size', value: '10', label: 'Size 10' },
    ];
    const sizeOnlyChip = [{ key: 'size', value: '10', label: 'Size 10' }];

    // fetchPopularProducts (mount) => both chips
    // debounce search => both chips
    // After chip removal re-search => only size chip
    mockSmartSearch
      .mockResolvedValueOnce({ ...mockSearchResponse, suggestedChips: bothChips }) // fetchPopularProducts
      .mockResolvedValueOnce({ ...mockSearchResponse, suggestedChips: bothChips }) // debounce search
      .mockResolvedValue({ ...mockSearchResponse, suggestedChips: sizeOnlyChip }); // re-search after removal

    render(<SmartSearchBar />);

    // Flush mount effects (fetchPopularProducts)
    await act(async () => {
      jest.runAllTimers();
    });

    // Set query and chips after mount settled
    await act(async () => {
      useSearchStore.setState({
        query: 'red shoes',
        chips: bothChips,
      });
    });

    // Flush debounce effect triggered by query change
    await act(async () => {
      jest.runAllTimers();
    });

    // Both chips should be visible now
    expect(screen.getByLabelText('Remove filter: Red')).toBeInTheDocument();

    // Click the X on the 'Red' chip
    const removeButton = screen.getByLabelText('Remove filter: Red');
    await act(async () => {
      fireEvent.click(removeButton);
    });

    // Chip removal has a 150ms animation delay in the Chip component
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    // Flush re-search triggered by chip removal
    await act(async () => {
      jest.runAllTimers();
    });

    // After removal, the 'color' chip should be gone from store
    const state = useSearchStore.getState();
    expect(state.chips.find((c) => c.key === 'color')).toBeUndefined();
  });

  // 7
  it('Backspace on empty input removes last chip', async () => {
    await act(async () => {
      useSearchStore.setState({
        query: '',
        chips: [
          { key: 'color', value: 'red', label: 'Red' },
          { key: 'size', value: '10', label: 'Size 10' },
        ],
      });
    });

    render(<SmartSearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Backspace' });
    });

    const state = useSearchStore.getState();
    // The last chip ('size') should be removed
    expect(state.chips).toHaveLength(1);
    expect(state.chips[0].key).toBe('color');
  });

  // 8
  it('Escape closes suggestions and blurs input', async () => {
    render(<SmartSearchBar />);

    const input = screen.getByRole('combobox');

    // Focus to open suggestions
    await act(async () => {
      fireEvent.focus(input);
    });

    // Verify suggestions are shown
    expect(useSearchStore.getState().showSuggestions).toBe(true);

    // Press Escape
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Escape' });
    });

    expect(useSearchStore.getState().showSuggestions).toBe(false);
    // Input should be blurred
    expect(document.activeElement).not.toBe(input);
  });

  // 9
  it('clears search and fires search_abandoned', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Prevent fetchPopularProducts from populating results
    mockSmartSearch.mockResolvedValue({
      ...mockSearchResponse,
      results: [],
      totalCount: 0,
      suggestedChips: [],
    });

    await act(async () => {
      useSearchStore.setState({
        query: 'red shoes',
        results: mockSearchResponse.results,
        totalCount: 1,
      });
    });

    render(<SmartSearchBar />);

    // Flush the fetchPopularProducts on mount
    await act(async () => {
      jest.runAllTimers();
    });

    // The clear button appears when query is non-empty
    const clearButton = screen.getByLabelText('Clear search');

    await act(async () => {
      fireEvent.click(clearButton);
    });

    // Flush any pending timers
    await act(async () => {
      jest.runAllTimers();
    });

    // Store query should be cleared
    const state = useSearchStore.getState();
    expect(state.query).toBe('');

    // Analytics should be fired
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('search_abandoned'),
      expect.objectContaining({ query: 'red shoes' }),
    );

    consoleSpy.mockRestore();
  });

  // 10
  it('keyboard arrow navigation wraps around', async () => {
    // Setup suggestions in store so there are items to navigate
    await act(async () => {
      useSearchStore.setState({
        query: 'red',
        suggestions: mockSuggestionsResponse.suggestions,
        trending: mockSuggestionsResponse.trending,
        showSuggestions: true,
      });
    });

    render(<SmartSearchBar />);

    const input = screen.getByRole('combobox');

    // Total items: 1 QUERY + 1 PRODUCT + 0 CATEGORY + 2 trending = 4
    // Press ArrowDown 4 times to go past last item => should wrap to 0
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });
    expect(useSearchStore.getState().activeSuggestionIndex).toBe(0);

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });
    expect(useSearchStore.getState().activeSuggestionIndex).toBe(1);

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });
    expect(useSearchStore.getState().activeSuggestionIndex).toBe(2);

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });
    expect(useSearchStore.getState().activeSuggestionIndex).toBe(3);

    // One more should wrap to 0
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });
    expect(useSearchStore.getState().activeSuggestionIndex).toBe(0);
  });

  // 11
  it('shows no-results fallback with popular products', async () => {
    const popularProduct = {
      productId: 'pop1',
      title: 'Popular Sneakers',
      thumbnail: '/img/pop1.jpg',
      price: { current: 59.99, original: null, currency: 'USD' },
      rating: { average: 4.2, count: 200 },
      badges: [],
    };

    const emptySearchResponse = {
      results: [],
      totalCount: 0,
      parsedFilters: {},
      suggestedChips: [],
      suggestions: [],
      spellCorrection: null,
    };

    // First call is fetchPopularProducts (mount) — return the popular product
    // Subsequent calls (search) — return empty results
    mockSmartSearch
      .mockResolvedValueOnce({
        ...emptySearchResponse,
        results: [popularProduct],
      })
      .mockResolvedValue(emptySearchResponse);

    await act(async () => {
      useSearchStore.setState({
        query: 'xyznonexistent',
        results: [],
        totalCount: 0,
        isLoading: false,
      });
    });

    render(<SmartSearchBar />);

    // Flush fetchPopularProducts on mount
    await act(async () => {
      jest.runAllTimers();
    });

    // Verify popularProducts is set
    expect(useSearchStore.getState().popularProducts).toHaveLength(1);

    // Submit form to set hasSearched ref
    const form = screen.getByRole('combobox').closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText(/No results for/)).toBeInTheDocument();
      expect(screen.getByText('Popular Sneakers')).toBeInTheDocument();
    });
  });
});
