import React from 'react';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import ResultsPreview from '@/components/SmartSearchBar/ResultsPreview';
import type { SearchResult, SpellCorrection } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockResults: SearchResult[] = [
  {
    productId: 'p1',
    title: 'Nike Air Zoom',
    thumbnail: '/img1.jpg',
    price: { current: 99.99, original: 119.99, currency: 'USD' },
    rating: { average: 4.5, count: 500 },
    badges: ['BEST_SELLER'],
  },
  {
    productId: 'p2',
    title: 'Adidas Ultraboost',
    thumbnail: '/img2.jpg',
    price: { current: 189.99, original: null, currency: 'USD' },
    rating: { average: 4.8, count: 300 },
    badges: [],
  },
  {
    productId: 'p3',
    title: 'New Balance 1080',
    thumbnail: '/img3.jpg',
    price: { current: 159.99, original: null, currency: 'USD' },
    rating: { average: 4.7, count: 200 },
    badges: [],
  },
  {
    productId: 'p4',
    title: 'Asics Gel Kayano',
    thumbnail: '/img4.jpg',
    price: { current: 179.99, original: null, currency: 'USD' },
    rating: { average: 4.6, count: 150 },
    badges: [],
  },
];

const mockTrending: SearchResult[] = [
  {
    productId: 't1',
    title: 'Trending Product',
    thumbnail: '/trending.jpg',
    price: { current: 29.99, original: null, currency: 'USD' },
    rating: { average: 4.0, count: 50 },
    badges: [],
  },
];

const defaultProps = {
  results: mockResults,
  totalCount: 42,
  query: 'running shoes',
  isLoading: false,
  spellCorrection: null as SpellCorrection | null,
  error: null as string | null,
  trending: mockTrending,
  isMobile: false,
  onProductClick: jest.fn(),
  onSearchOriginal: jest.fn(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ResultsPreview', () => {
  it('shows skeleton loading state when isLoading is true', () => {
    const { container } = render(
      <ResultsPreview {...defaultProps} isLoading={true} results={[]} />,
    );

    // SearchSkeleton renders shimmer divs
    const shimmerElements = container.querySelectorAll('.shimmer');
    expect(shimmerElements.length).toBeGreaterThan(0);
  });

  it('shows NoResultsFallback when results are empty and query is present', () => {
    render(
      <ResultsPreview {...defaultProps} results={[]} query="zzzzzzz" />,
    );

    expect(screen.getByText(/no results for/i)).toBeInTheDocument();
  });

  it('renders nothing when results are empty and query is empty', () => {
    const { container } = render(
      <ResultsPreview {...defaultProps} results={[]} query="" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows product cards when results exist', () => {
    render(<ResultsPreview {...defaultProps} />);

    expect(screen.getByText('Nike Air Zoom')).toBeInTheDocument();
    expect(screen.getByText('Adidas Ultraboost')).toBeInTheDocument();
    expect(screen.getByText('New Balance 1080')).toBeInTheDocument();
    expect(screen.getByText('Asics Gel Kayano')).toBeInTheDocument();
  });

  it('limits visible results to 4', () => {
    const fiveResults = [
      ...mockResults,
      {
        productId: 'p5',
        title: 'Fifth Product',
        thumbnail: '/img5.jpg',
        price: { current: 59.99, original: null, currency: 'USD' },
        rating: { average: 4.0, count: 50 },
        badges: [],
      },
    ];

    render(
      <ResultsPreview {...defaultProps} results={fiveResults} />,
    );

    expect(screen.getByText('Nike Air Zoom')).toBeInTheDocument();
    expect(screen.queryByText('Fifth Product')).not.toBeInTheDocument();
  });

  it('shows spell correction banner when spellCorrection is provided', () => {
    const spellCorrection: SpellCorrection = {
      corrected: 'running shoes',
      original: 'runing sheos',
    };

    render(
      <ResultsPreview
        {...defaultProps}
        spellCorrection={spellCorrection}
      />,
    );

    expect(screen.getByText(/showing results for/i)).toBeInTheDocument();
    // The banner shows the original query as a clickable button for searching the original
    const searchOriginalBtn = screen.getByText(/runing sheos/);
    expect(searchOriginalBtn.closest('button')).toBeInTheDocument();
  });

  it('does not show spell correction banner when spellCorrection is null', () => {
    render(<ResultsPreview {...defaultProps} spellCorrection={null} />);
    expect(screen.queryByText(/showing results for/i)).not.toBeInTheDocument();
  });

  it('shows "View all" link with correct total count', () => {
    render(<ResultsPreview {...defaultProps} totalCount={1234} />);

    const viewAllLink = screen.getByRole('link');
    expect(viewAllLink).toHaveTextContent('1,234');
    expect(viewAllLink).toHaveAttribute(
      'href',
      '/search?q=running%20shoes',
    );
  });

  it('has aria-live region', () => {
    const { container } = render(<ResultsPreview {...defaultProps} />);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('has sr-only text announcing result count', () => {
    render(<ResultsPreview {...defaultProps} totalCount={42} />);

    const srOnly = screen.getByText('42 results found');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly.className).toContain('sr-only');
  });

  it('shows error message when error is present', () => {
    render(
      <ResultsPreview
        {...defaultProps}
        error="Too many requests"
        results={[]}
      />,
    );

    expect(screen.getByText('Too many requests')).toBeInTheDocument();
  });
});
