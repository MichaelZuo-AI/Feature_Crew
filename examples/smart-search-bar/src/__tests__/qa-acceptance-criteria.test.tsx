/**
 * QA Acceptance Criteria Tests
 *
 * Tests for acceptance criteria not adequately covered by existing test suites.
 * Covers: AC-13, AC-33, AC-35, AC-37, AC-39, AC-43, AC-44, AC-45, and edge cases.
 */
import React from 'react';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
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

jest.mock('next/link', () => ({
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
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}));

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

// Mock window.matchMedia
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
// AC-13: Chip removal doesn't change input text
// ---------------------------------------------------------------------------

describe('AC-13: Chip removal keeps input text unchanged', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('query text remains unchanged after chip removal', async () => {
    const bothChips = [
      { key: 'color', value: 'red', label: 'Red' },
      { key: 'size', value: '10', label: 'Size 10' },
    ];

    // All search calls return both chips so they render
    mockSmartSearch.mockResolvedValue({
      ...mockSearchResponse,
      suggestedChips: bothChips,
    });

    render(<SmartSearchBar />);

    // Flush mount (fetchPopularProducts)
    await act(async () => {
      jest.runAllTimers();
    });

    // Type a query to set the input value via the component
    const input = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'red shoes size 10' } });
    });

    // Set chips directly (simulating what search response would do)
    await act(async () => {
      useSearchStore.setState({ chips: bothChips });
    });

    // Flush debounce
    await act(async () => {
      jest.runAllTimers();
    });

    // Verify query before removal
    expect(input).toHaveValue('red shoes size 10');

    // Now configure subsequent searches to return remaining chips
    mockSmartSearch.mockResolvedValue({
      ...mockSearchResponse,
      suggestedChips: [bothChips[1]],
    });

    // Remove the 'Red' chip
    const removeButton = screen.getByLabelText('Remove filter: Red');
    await act(async () => {
      fireEvent.click(removeButton);
    });

    // Chip removal has a 150ms animation delay
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // Query text should remain unchanged per AC-13
    expect(input).toHaveValue('red shoes size 10');
  });
});

// ---------------------------------------------------------------------------
// AC-33: Enter selects highlighted suggestion
// ---------------------------------------------------------------------------

describe('AC-33: Enter selects highlighted suggestion', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Enter on highlighted suggestion selects it and triggers search', async () => {
    render(<SmartSearchBar />);

    // Flush mount effects
    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');

    // Focus the input to open suggestions
    await act(async () => {
      fireEvent.focus(input);
    });

    // Type to get suggestions
    await act(async () => {
      fireEvent.change(input, { target: { value: 'red' } });
    });

    // Advance debounce to trigger suggestions fetch
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // Verify suggestions are loaded and showing
    expect(useSearchStore.getState().showSuggestions).toBe(true);
    expect(useSearchStore.getState().suggestions.length).toBeGreaterThan(0);

    // Navigate down with ArrowDown to highlight first suggestion
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    expect(useSearchStore.getState().activeSuggestionIndex).toBe(0);

    // Press Enter to select the highlighted suggestion
    mockSmartSearch.mockClear();
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // The suggestion should have been selected
    const state = useSearchStore.getState();
    expect(state.query).toBe('red running shoes');
    expect(state.showSuggestions).toBe(false);
    // Search should have been called for the selected suggestion
    expect(mockSmartSearch).toHaveBeenCalled();
  });

  it('Enter with no highlighted suggestion submits the current query', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');

    // Type a query
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test query' } });
    });

    // Submit the form directly (no suggestion highlighted)
    const form = input.closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('search_initiated'),
      expect.objectContaining({ query: 'test query' }),
    );

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// AC-37: "/" shortcut with input guard
// ---------------------------------------------------------------------------

describe('AC-37: "/" shortcut focuses search bar with input guard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('"/" key focuses the search input when no input is focused', async () => {
    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');

    // Blur the input so nothing is focused
    input.blur();
    // Focus the body to simulate real browser state
    document.body.focus();

    expect(document.activeElement).not.toBe(input);

    // Dispatch a keydown event from the body (in a real browser,
    // when nothing is focused, keydown target is the body element)
    const event = new KeyboardEvent('keydown', {
      key: '/',
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(event);

    expect(document.activeElement).toBe(input);
  });

  it('"/" key does NOT focus search bar when another input is focused', async () => {
    render(
      <div>
        <input data-testid="other-input" type="text" />
        <SmartSearchBar />
      </div>,
    );

    await act(async () => {
      jest.runAllTimers();
    });

    const otherInput = screen.getByTestId('other-input');
    otherInput.focus();

    const searchInput = screen.getByRole('combobox');

    // Dispatch "/" event from the other input
    const event = new KeyboardEvent('keydown', {
      key: '/',
      bubbles: true,
      cancelable: true,
    });
    otherInput.dispatchEvent(event);

    expect(document.activeElement).toBe(otherInput);
    expect(document.activeElement).not.toBe(searchInput);
  });

  it('"/" key does NOT focus search bar when textarea is focused', async () => {
    render(
      <div>
        <textarea data-testid="text-area" />
        <SmartSearchBar />
      </div>,
    );

    await act(async () => {
      jest.runAllTimers();
    });

    const textarea = screen.getByTestId('text-area');
    textarea.focus();

    const event = new KeyboardEvent('keydown', {
      key: '/',
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(event);

    const searchInput = screen.getByRole('combobox');
    expect(document.activeElement).not.toBe(searchInput);
  });
});

// ---------------------------------------------------------------------------
// AC-39: Suggestions listbox role and option roles
// ---------------------------------------------------------------------------

describe('AC-39: SuggestionsDropdown ARIA roles', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('suggestions dropdown has role="listbox" and aria-label', async () => {
    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    // Focus the input to open suggestions
    const input = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.focus(input);
    });

    // Type to get query suggestions
    await act(async () => {
      fireEvent.change(input, { target: { value: 'shoes' } });
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    const listbox = screen.getByRole('listbox', { name: 'Search suggestions' });
    expect(listbox).toBeInTheDocument();
  });

  it('suggestion items have role="option"', async () => {
    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.focus(input);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // There should be options (trending items when query is empty)
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// AC-35: Tab exits dropdown
// ---------------------------------------------------------------------------

describe('AC-35: Tab exits dropdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Tab key closes suggestions dropdown', async () => {
    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');

    // Focus to open suggestions
    await act(async () => {
      fireEvent.focus(input);
    });

    expect(useSearchStore.getState().showSuggestions).toBe(true);

    // Press Tab
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Tab' });
    });

    const state = useSearchStore.getState();
    expect(state.showSuggestions).toBe(false);
    expect(state.activeSuggestionIndex).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// AC-43: suggestion_clicked analytics
// ---------------------------------------------------------------------------

describe('AC-43: suggestion_clicked analytics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fires suggestion_clicked when a suggestion is selected via keyboard', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');

    // Focus the input
    await act(async () => {
      fireEvent.focus(input);
    });

    // Type to trigger suggestions
    await act(async () => {
      fireEvent.change(input, { target: { value: 'red' } });
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // Verify suggestions are loaded
    expect(useSearchStore.getState().suggestions.length).toBeGreaterThan(0);

    // Navigate to first suggestion
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    expect(useSearchStore.getState().activeSuggestionIndex).toBe(0);

    // Select it
    consoleSpy.mockClear();
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('suggestion_clicked'),
      expect.objectContaining({ suggestion: 'red running shoes' }),
    );

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// AC-44: chip_removed analytics
// ---------------------------------------------------------------------------

describe('AC-44: chip_removed analytics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fires chip_removed when a chip is removed via X click', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const bothChips = [
      { key: 'color', value: 'red', label: 'Red' },
      { key: 'size', value: '10', label: 'Size 10' },
    ];

    // All calls return bothChips so chips stay stable
    mockSmartSearch.mockResolvedValue({
      ...mockSearchResponse,
      suggestedChips: bothChips,
    });
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);

    render(<SmartSearchBar />);

    // Flush mount
    await act(async () => {
      jest.runAllTimers();
    });

    // Type query then set chips
    const input = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'red shoes' } });
    });

    // Advance debounce — this will trigger search which returns bothChips
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // Verify chips are rendered
    expect(screen.getByLabelText('Remove filter: Red')).toBeInTheDocument();

    // Clear console spy to ignore earlier calls
    consoleSpy.mockClear();

    // Remove the 'Red' chip
    const removeButton = screen.getByLabelText('Remove filter: Red');
    await act(async () => {
      fireEvent.click(removeButton);
    });

    // Chip animation delay is 150ms
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('chip_removed'),
      expect.objectContaining({ key: 'color' }),
    );

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// AC-45: result_clicked analytics
// ---------------------------------------------------------------------------

describe('AC-45: result_clicked analytics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fires result_clicked when a product card is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<SmartSearchBar />);

    // Flush mount
    await act(async () => {
      jest.runAllTimers();
    });

    // Type a query
    const input = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'red shoes' } });
    });

    // Submit the form to set hasSearched
    const form = input.closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('Red Running Shoes')).toBeInTheDocument();
    });

    consoleSpy.mockClear();

    // Click on the product card (it uses role="button" on a div, not <button>)
    const productCard = screen.getByText('Red Running Shoes').closest('[role="button"]');
    expect(productCard).not.toBeNull();
    await act(async () => {
      fireEvent.click(productCard!);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('result_clicked'),
      expect.objectContaining({ productId: 'p1' }),
    );

    consoleSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Edge Cases
// ---------------------------------------------------------------------------

describe('Edge Cases', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
    mockSmartSearch.mockReset();
    mockFetchSuggestions.mockReset();
    localStorageMock.clear();
    mockSmartSearch.mockResolvedValue(mockSearchResponse);
    mockFetchSuggestions.mockResolvedValue(mockSuggestionsResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('empty query submission does not trigger search', async () => {
    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    // Reset mock after mount effects
    mockSmartSearch.mockClear();

    const form = screen.getByRole('combobox').closest('form')!;

    // Submit with empty query
    await act(async () => {
      fireEvent.submit(form);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // smartSearch should NOT have been called after the submit
    expect(mockSmartSearch).not.toHaveBeenCalled();
  });

  it('whitespace-only query submission does not trigger search', async () => {
    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');

    // Set whitespace-only query
    await act(async () => {
      fireEvent.change(input, { target: { value: '   ' } });
    });

    mockSmartSearch.mockClear();

    const form = input.closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // No search should have been initiated for whitespace-only
    expect(mockSmartSearch).not.toHaveBeenCalled();
  });

  it('rapid typing then clearing does not cause stale results', async () => {
    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');

    // Type rapidly
    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: 'ab' } });
    });
    await act(async () => {
      fireEvent.change(input, { target: { value: 'abc' } });
    });

    // Before debounce fires, clear the input
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });

    // Advance past debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Query should be empty
    const state = useSearchStore.getState();
    expect(state.query).toBe('');
  });

  it('multiple chip removals in sequence work correctly', async () => {
    const threeChips = [
      { key: 'color', value: 'red', label: 'Red' },
      { key: 'size', value: '10', label: 'Size 10' },
      { key: 'brand', value: 'nike', label: 'Nike' },
    ];

    // Respond with all three chips so they render
    mockSmartSearch.mockResolvedValue({
      ...mockSearchResponse,
      suggestedChips: threeChips,
    });

    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    // Type query to trigger search that returns chips
    const input = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'red nike shoes size 10' } });
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // Verify all three chips are rendered
    expect(screen.getByLabelText('Remove filter: Red')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove filter: Size 10')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove filter: Nike')).toBeInTheDocument();

    // Now configure subsequent searches to return remaining chips
    mockSmartSearch.mockResolvedValue({
      ...mockSearchResponse,
      suggestedChips: [threeChips[1], threeChips[2]],
    });

    // Remove first chip
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Remove filter: Red'));
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    await act(async () => {
      jest.runAllTimers();
    });

    let state = useSearchStore.getState();
    expect(state.chips.find((c) => c.key === 'color')).toBeUndefined();

    // Configure next removal response
    mockSmartSearch.mockResolvedValue({
      ...mockSearchResponse,
      suggestedChips: [threeChips[2]],
    });

    // Remove second chip
    const removeSizeBtn = screen.queryByLabelText('Remove filter: Size 10');
    expect(removeSizeBtn).not.toBeNull();
    await act(async () => {
      fireEvent.click(removeSizeBtn!);
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    await act(async () => {
      jest.runAllTimers();
    });

    state = useSearchStore.getState();
    expect(state.chips.find((c) => c.key === 'size')).toBeUndefined();
  });

  it('ArrowUp from first item wraps to last item', async () => {
    render(<SmartSearchBar />);

    await act(async () => {
      jest.runAllTimers();
    });

    const input = screen.getByRole('combobox');

    // Focus to open suggestions
    await act(async () => {
      fireEvent.focus(input);
    });

    // Type to get suggestions
    await act(async () => {
      fireEvent.change(input, { target: { value: 'red' } });
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    // Verify suggestions are loaded
    expect(useSearchStore.getState().suggestions.length).toBeGreaterThan(0);
    expect(useSearchStore.getState().showSuggestions).toBe(true);

    // Navigate down to highlight first item
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });
    expect(useSearchStore.getState().activeSuggestionIndex).toBe(0);

    // ArrowUp from index 0 should wrap to last
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' });
    });

    const state = useSearchStore.getState();
    // Total items: 1 QUERY + 1 PRODUCT + 2 trending = 4, last index = 3
    expect(state.activeSuggestionIndex).toBe(3);
  });
});
