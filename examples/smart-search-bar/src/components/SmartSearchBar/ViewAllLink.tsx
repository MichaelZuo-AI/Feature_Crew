'use client';

import Link from 'next/link';

interface ViewAllLinkProps {
  query: string;
  totalCount: number;
}

export default function ViewAllLink({ query, totalCount }: ViewAllLinkProps) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(query)}`}
      className="block text-center py-3 text-[#818CF8] text-sm font-medium cursor-pointer hover:underline"
    >
      View all {totalCount.toLocaleString('en-US')} results &rarr;
    </Link>
  );
}
