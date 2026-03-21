import React from 'react';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/SmartSearchBar/ProductCard';
import type { SearchResult } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const baseProduct: SearchResult = {
  productId: 'prod-001',
  title: 'Nike Air Zoom Pegasus 41 Running Shoes',
  thumbnail: '/images/products/placeholder.svg',
  price: { current: 119.99, original: 139.99, currency: 'USD' },
  rating: { average: 4.6, count: 2341 },
  badges: ['BEST_SELLER'],
};

const productNoDiscount: SearchResult = {
  productId: 'prod-002',
  title: 'Adidas Ultraboost Light Running Shoes',
  thumbnail: '/images/products/placeholder.svg',
  price: { current: 189.99, original: null, currency: 'USD' },
  rating: { average: 4.8, count: 1876 },
  badges: [],
};

const productLargeCount: SearchResult = {
  productId: 'prod-003',
  title: 'Popular Headphones',
  thumbnail: '',
  price: { current: 49.99, original: null, currency: 'USD' },
  rating: { average: 3.5, count: 12345 },
  badges: ['FREE_SHIPPING'],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProductCard', () => {
  it('renders the product title', () => {
    render(
      <ProductCard
        product={baseProduct}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByText(baseProduct.title)).toBeInTheDocument();
  });

  it('renders the current price', () => {
    render(
      <ProductCard
        product={baseProduct}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByText('$119.99')).toBeInTheDocument();
  });

  it('shows original price with strikethrough when discounted', () => {
    render(
      <ProductCard
        product={baseProduct}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );

    const originalPrice = screen.getByText('$139.99');
    expect(originalPrice).toBeInTheDocument();
    expect(originalPrice.className).toContain('line-through');
  });

  it('does not show original price when there is no discount', () => {
    render(
      <ProductCard
        product={productNoDiscount}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );

    expect(screen.getByText('$189.99')).toBeInTheDocument();
    // There should be no line-through element
    const allSpans = screen.getAllByText(/\$/);
    const lineThroughSpans = allSpans.filter((el) =>
      el.className.includes('line-through'),
    );
    expect(lineThroughSpans).toHaveLength(0);
  });

  it('shows badge when present', () => {
    render(
      <ProductCard
        product={baseProduct}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByText('Best Seller')).toBeInTheDocument();
  });

  it('shows FREE_SHIPPING badge correctly', () => {
    render(
      <ProductCard
        product={productLargeCount}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
  });

  it('does not show badge when badges array is empty', () => {
    render(
      <ProductCard
        product={productNoDiscount}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );

    expect(screen.queryByText('Best Seller')).not.toBeInTheDocument();
    expect(screen.queryByText('Free Shipping')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(
      <ProductCard
        product={baseProduct}
        index={0}
        isMobile={false}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on Enter keydown', () => {
    const onClick = jest.fn();
    render(
      <ProductCard
        product={baseProduct}
        index={0}
        isMobile={false}
        onClick={onClick}
      />,
    );

    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('formats review count with commas', () => {
    render(
      <ProductCard
        product={productLargeCount}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );

    // 12345 → (12,345)
    expect(screen.getByText('(12,345)')).toBeInTheDocument();
  });

  it('formats rating count of 2341 with comma', () => {
    render(
      <ProductCard
        product={baseProduct}
        index={0}
        isMobile={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByText('(2,341)')).toBeInTheDocument();
  });
});
