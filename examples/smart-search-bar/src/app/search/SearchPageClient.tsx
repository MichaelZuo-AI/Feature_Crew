'use client';

import { useEffect } from 'react';
import SmartSearchBar from '@/components/SmartSearchBar/SmartSearchBar';
import { useSearchStore } from '@/hooks/useSearchStore';

interface SearchPageClientProps {
  initialQuery: string;
  initialParams: { q?: string; priceMin?: string; priceMax?: string; categories?: string | string[] };
}

export default function SearchPageClient({ initialQuery, initialParams }: SearchPageClientProps) {
  const { setQuery, syncFromURL, search } = useSearchStore();

  // Sync state from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams();
    if (initialParams.q) params.set('q', initialParams.q);
    if (initialParams.priceMin) params.set('priceMin', initialParams.priceMin);
    if (initialParams.priceMax) params.set('priceMax', initialParams.priceMax);
    if (initialParams.categories) {
      const cats = Array.isArray(initialParams.categories)
        ? initialParams.categories
        : [initialParams.categories];
      cats.forEach((c) => params.append('categories', c));
    }

    syncFromURL(params);

    if (initialQuery) {
      search(initialQuery);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      <SmartSearchBar />
    </div>
  );
}
