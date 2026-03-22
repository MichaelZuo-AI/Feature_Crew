'use client';

import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { products } from '@/data/products';

type SortOption = 'popular' | 'price' | 'brand';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [expressOnly, setExpressOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [visibleCount, setVisibleCount] = useState(8);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const filtered = useMemo(() => {
    let result = products;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (expressOnly) {
      result = result.filter((p) => p.express_delivery);
    }

    switch (sortBy) {
      case 'price':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'brand':
        result = [...result].sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      case 'popular':
      default:
        result = [...result].sort((a, b) => b.popularity_score - a.popularity_score);
        break;
    }

    return result;
  }, [query, expressOnly, sortBy]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    // Simulate brief loading delay for skeleton visibility
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsLoading(false);
    }, 500);
  }, [hasMore, isLoading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'popular', label: 'Most Popular' },
    { key: 'price', label: 'Price' },
    { key: 'brand', label: 'Brand' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 z-40 glass shadow-ambient px-3 py-3 flex items-center gap-2">
        <button onClick={() => router.back()} className="p-1">
          <span className="material-symbols-outlined text-on-surface">
            arrow_back
          </span>
        </button>
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-surface-container-low rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>
      </div>

      {/* Filter Row */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setExpressOnly(!expressOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            expressOnly
              ? 'bg-primary text-white'
              : 'bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-sm">local_shipping</span>
          Express Delivery
        </button>

        <div className="w-3" />

        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              sortBy === option.key
                ? 'bg-primary text-white'
                : 'ghost-border text-on-surface-variant'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Product Count */}
      <div className="px-4 py-2">
        <p className="text-xs text-on-surface-variant font-medium">
          {filtered.length} Products
        </p>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {visibleProducts.map((product) => {
            const isChecked = compareIds.includes(product.id);
            return (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  className={`absolute top-2 left-2 z-10 w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${
                    isChecked
                      ? 'bg-primary border-primary'
                      : 'bg-white/80 border-surface-container-high'
                  }`}
                  title="Compare"
                >
                  {isChecked && (
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">
            search_off
          </span>
          <p className="text-sm text-on-surface-variant text-center">
            No products found{query ? ` for "${query}"` : ''}
          </p>
        </div>
      )}

      {/* Compare floating CTA */}
      {compareIds.length >= 2 && (
        <div className="fixed bottom-24 left-0 right-0 z-50 mx-auto max-w-md px-4">
          <Link
            href={`/compare?ids=${compareIds.join(',')}`}
            className="flex items-center justify-center gap-2 w-full py-3 gradient-primary text-white rounded-xl font-bold shadow-ambient"
          >
            <span className="material-symbols-outlined text-lg">compare</span>
            Compare ({compareIds.length})
          </Link>
        </div>
      )}

      {/* Loading skeleton / sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="px-4 py-4">
          {isLoading && (
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <div key={i} className="bg-surface-container-low rounded-lg animate-pulse">
                  <div className="aspect-square rounded-t-lg bg-surface-container-high" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-surface-container-high rounded w-3/4" />
                    <div className="h-3 bg-surface-container-high rounded w-1/2" />
                    <div className="h-4 bg-surface-container-high rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant animate-spin">
            progress_activity
          </span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
