'use client';

import type { SearchResult } from '@/lib/types';
import ProductCard from './ProductCard';

interface NoResultsFallbackProps {
  query: string;
  trendingProducts: SearchResult[];
  isMobile: boolean;
  onProductClick: (productId: string) => void;
}

export default function NoResultsFallback({
  query,
  trendingProducts,
  isMobile,
  onProductClick,
}: NoResultsFallbackProps) {
  return (
    <div>
      <p className="text-[#888] text-sm mb-4">
        No results for &lsquo;{query}&rsquo;. Here are some popular items:
      </p>

      <div
        className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'}`}
      >
        {trendingProducts.map((product, index) => (
          <ProductCard
            key={product.productId}
            product={product}
            index={index}
            isMobile={isMobile}
            onClick={() => onProductClick(product.productId)}
          />
        ))}
      </div>
    </div>
  );
}
