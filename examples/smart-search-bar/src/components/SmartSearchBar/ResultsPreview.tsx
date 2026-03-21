'use client';

import type { SearchResult, SpellCorrection } from '@/lib/types';
import ProductCard from './ProductCard';
import SearchSkeleton from './SearchSkeleton';
import SpellCorrectionBanner from './SpellCorrectionBanner';
import NoResultsFallback from './NoResultsFallback';
import ViewAllLink from './ViewAllLink';

interface ResultsPreviewProps {
  results: SearchResult[];
  totalCount: number;
  query: string;
  isLoading: boolean;
  spellCorrection: SpellCorrection | null;
  error: string | null;
  trending: SearchResult[];
  isMobile: boolean;
  onProductClick: (productId: string) => void;
  onSearchOriginal: (query: string) => void;
}

export default function ResultsPreview({
  results,
  totalCount,
  query,
  isLoading,
  spellCorrection,
  error,
  trending,
  isMobile,
  onProductClick,
  onSearchOriginal,
}: ResultsPreviewProps) {
  if (isLoading) {
    return <SearchSkeleton isMobile={isMobile} />;
  }

  if (error) {
    return (
      <div>
        <p className="text-[#EF4444] text-sm mb-4">{error}</p>
        {trending.length > 0 && (
          <NoResultsFallback
            query={query}
            trendingProducts={trending}
            isMobile={isMobile}
            onProductClick={onProductClick}
          />
        )}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <NoResultsFallback
        query={query}
        trendingProducts={trending}
        isMobile={isMobile}
        onProductClick={onProductClick}
      />
    );
  }

  if (results.length === 0) {
    return null;
  }

  const visibleResults = results.slice(0, 4);

  return (
    <div>
      {spellCorrection && (
        <div className="mb-3">
          <SpellCorrectionBanner
            corrected={spellCorrection.corrected}
            original={spellCorrection.original}
            onSearchOriginal={onSearchOriginal}
          />
        </div>
      )}

      <div aria-live="polite">
        <span className="sr-only" aria-live="assertive">
          {totalCount} results found
        </span>

        <div
          className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'}`}
        >
          {visibleResults.map((product, index) => (
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

      <ViewAllLink query={query} totalCount={totalCount} />
    </div>
  );
}
