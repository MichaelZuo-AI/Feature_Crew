import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; priceMin?: string; priceMax?: string; categories?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  return (
    <main className="min-h-screen bg-[#0E0E0E] text-[#E8E8E8]">
      <Suspense fallback={<div className="p-8 text-center text-[#888]">Loading...</div>}>
        <SearchPageClient initialQuery={params.q ?? ''} initialParams={params} />
      </Suspense>
    </main>
  );
}
