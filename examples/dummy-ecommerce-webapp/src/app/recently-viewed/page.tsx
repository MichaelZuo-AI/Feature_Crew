'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import BottomNavBar from '@/components/layout/BottomNavBar';
import type { RecentView } from '@/types';

// ── Date grouping helpers ─────────────────────────────────────────────────────

type DateGroup = 'Today' | 'Yesterday' | 'This Week' | 'Earlier';

function getDateGroup(viewedAt: string): DateGroup {
  const now = new Date();
  const viewed = new Date(viewedAt);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  if (viewed >= todayStart) return 'Today';
  if (viewed >= yesterdayStart) return 'Yesterday';
  if (viewed >= weekStart) return 'This Week';
  return 'Earlier';
}

const GROUP_ORDER: DateGroup[] = ['Today', 'Yesterday', 'This Week', 'Earlier'];

interface GroupedViews {
  group: DateGroup;
  views: RecentView[];
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RecentlyViewedPage() {
  const router = useRouter();
  const { recentlyViewed } = useUser();

  const [cleared, setCleared] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  const grouped = useMemo<GroupedViews[]>(() => {
    if (cleared) return [];

    const map = new Map<DateGroup, RecentView[]>();
    for (const view of recentlyViewed) {
      const g = getDateGroup(view.viewedAt);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(view);
    }

    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
      group: g,
      views: map.get(g)!,
    }));
  }, [recentlyViewed, cleared]);

  const isEmpty = grouped.length === 0;

  function handleClearConfirm() {
    setCleared(true);
    setShowSheet(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-24">
      {/* ── Top Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-md">
        <div className="glass shadow-ambient-up h-16 flex items-center px-4 gap-3">
          {/* Back arrow */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>

          {/* Center title */}
          <h1 className="flex-1 text-center text-base font-bold text-on-surface truncate">
            Recently Viewed
          </h1>

          {/* Clear All */}
          <button
            type="button"
            onClick={() => !isEmpty && setShowSheet(true)}
            className={`text-sm font-semibold w-16 text-right transition-opacity ${
              isEmpty ? 'text-on-surface-variant opacity-40 pointer-events-none' : 'text-primary'
            }`}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="pt-16">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-8">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">
              schedule
            </span>
            <p className="text-base font-semibold text-on-surface text-center">No recent items</p>
            <p className="text-sm text-on-surface-variant text-center">
              Products you view will appear here.
            </p>
          </div>
        ) : (
          /* Date-grouped sections */
          <div className="px-3 py-4 flex flex-col gap-5">
            {grouped.map(({ group, views }) => (
              <section key={group}>
                {/* Section header */}
                <div className="bg-[#eef1f8] rounded-lg px-4 py-2 mb-3">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                    {group}
                  </span>
                </div>

                {/* 2-column product grid */}
                <div className="grid grid-cols-2 gap-3">
                  {views.map((view) => {
                    const product = products.find((p) => p.id === view.productId);
                    if (!product) return null;

                    return (
                      <Link
                        key={view.productId}
                        href={`/product/${product.id}`}
                        className="bg-white rounded-xl overflow-hidden shadow-ambient active:scale-[0.97] transition-transform"
                      >
                        {/* Product image */}
                        <div className="relative aspect-square">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded-t-xl"
                            sizes="(max-width: 768px) 50vw, 200px"
                          />
                        </div>

                        {/* Card body */}
                        <div className="p-2.5">
                          <p className="text-sm text-on-surface font-medium line-clamp-1 leading-snug mb-1">
                            {product.name}
                          </p>
                          <p className="text-sm font-bold text-primary">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* ── Clear All Bottom Sheet ── */}
      {showSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center mx-auto max-w-md bg-black/30 backdrop-blur-sm"
          onClick={() => setShowSheet(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl px-6 pt-6 pb-10 shadow-ambient-up animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

            <h2 className="text-base font-bold text-on-surface text-center mb-2">
              Clear browsing history?
            </h2>
            <p className="text-sm text-on-surface-variant text-center mb-6">
              All recently viewed items will be removed.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSheet(false)}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold text-primary border border-primary/20 active:bg-primary/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearConfirm}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-error text-white active:opacity-80 transition-opacity"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
}
