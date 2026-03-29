'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { stores } from '@/data/stores-data';
import { products } from '@/data/products';
import TopAppBar from '@/components/layout/TopAppBar';
import ProductCard from '@/components/ui/ProductCard';
import { useToastContext } from '@/context/ToastContext';

type Tab = 'reviews' | 'products' | 'info';

export default function StoreRatingsPage() {
  const params = useParams();
  const { showToast } = useToastContext();
  const [activeTab, setActiveTab] = useState<Tab>('reviews');
  const [following, setFollowing] = useState(false);

  const store = stores.find((s) => s.id === params.id);

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">
          storefront
        </span>
        <p className="text-lg font-semibold text-on-surface mb-1">Store not found</p>
        <p className="text-sm text-on-surface-variant mb-6">
          The store you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="gradient-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const storeProducts = products.filter((p) => store.productIds.includes(p.id));
  const totalRatings = store.ratingBreakdown.reduce((sum, r) => sum + r.count, 0);

  const handleFollow = () => {
    setFollowing((prev) => {
      const next = !prev;
      showToast(next ? `Following ${store.name}` : `Unfollowed ${store.name}`);
      return next;
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const filled = Math.floor(rating);
    const sizeClass = size === 'sm' ? 'text-sm' : 'text-base';
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined ${sizeClass} ${
              i < filled ? 'text-yellow-400' : 'text-gray-300'
            }`}
            style={i < filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <TopAppBar title={store.name} showBack />

      {/* Store Header */}
      <div className="pt-16">
        <div className="bg-surface-container-lowest shadow-ambient px-4 pt-6 pb-5">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-ambient">
              <Image
                src={store.logo}
                alt={store.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            {/* Name & meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-on-surface leading-tight truncate">
                  {store.name}
                </h1>
                {store.verified && (
                  <span
                    className="material-symbols-outlined text-[#0050cb] text-lg flex-shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Member since {store.memberSince}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(store.stats.rating)}
                <span className="text-xs font-semibold text-on-surface ml-0.5">
                  {store.stats.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { label: 'Rating', value: store.stats.rating.toString(), icon: 'star' },
              { label: 'Sales', value: store.stats.totalSales, icon: 'shopping_bag' },
              { label: 'Response', value: `${store.stats.responseRate}%`, icon: 'chat_bubble' },
              { label: 'On Time', value: `${store.stats.onTimeRate}%`, icon: 'local_shipping' },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-surface-container-low rounded-xl p-2.5 flex flex-col items-center gap-1"
              >
                <span className="material-symbols-outlined text-[#0050cb] text-lg">{icon}</span>
                <span className="text-sm font-bold text-on-surface leading-none">{value}</span>
                <span className="text-[10px] text-on-surface-variant text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Follow CTA */}
          <button
            onClick={handleFollow}
            className={`mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-all ${
              following
                ? 'bg-surface-container-low text-on-surface-variant border border-outline/20'
                : 'gradient-primary text-white shadow-ambient'
            }`}
          >
            {following ? 'Following' : 'Follow Store'}
          </button>
        </div>
      </div>

      {/* Segmented Tab Control */}
      <div className="px-4 mt-4">
        <div className="bg-surface-container-low rounded-xl p-1 flex gap-1">
          {(['reviews', 'products', 'info'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-surface-container-lowest text-[#0050cb] shadow-ambient font-semibold'
                  : 'text-on-surface-variant'
              }`}
            >
              {tab === 'info' ? 'Store Info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4">
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {/* Rating Breakdown */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <span className="text-4xl font-black text-on-surface leading-none">
                    {store.stats.rating}
                  </span>
                  <span className="text-base text-on-surface-variant">/5</span>
                </div>
                <div>
                  {renderStars(store.stats.rating, 'md')}
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {totalRatings.toLocaleString()} ratings
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[...store.ratingBreakdown].sort((a, b) => b.stars - a.stars).map((row) => {
                  const pct = totalRatings > 0 ? Math.round((row.count / totalRatings) * 100) : 0;
                  return (
                    <div key={row.stars} className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant w-3 text-right flex-shrink-0">
                        {row.stars}
                      </span>
                      <span
                        className="material-symbols-outlined text-yellow-400 text-sm flex-shrink-0"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0050cb] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-on-surface-variant w-7 text-right flex-shrink-0">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review Cards */}
            {store.reviews.map((review) => {
              const reviewProduct = products.find((p) => p.id === review.productId);
              return (
                <div
                  key={review.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{review.reviewer}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{review.date}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-sm text-on-surface mt-2.5 leading-relaxed">{review.body}</p>

                  {reviewProduct && (
                    <Link
                      href={`/product/${reviewProduct.id}`}
                      className="mt-3 flex items-center gap-2.5 bg-surface-container-low rounded-xl p-2 active:opacity-70 transition-opacity"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={reviewProduct.image}
                          alt={reviewProduct.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <p className="text-xs text-on-surface font-medium line-clamp-2 flex-1 leading-snug">
                        {reviewProduct.name}
                      </p>
                      <span className="material-symbols-outlined text-on-surface-variant text-base flex-shrink-0">
                        chevron_right
                      </span>
                    </Link>
                  )}

                  <div className="flex items-center gap-1.5 mt-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                      thumb_up
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {review.helpful} found this helpful
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 gap-3">
            {storeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-3">
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#0050cb]">info</span>
                <h2 className="text-sm font-bold text-on-surface">About</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {store.description}
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#0050cb]">replay</span>
                <h2 className="text-sm font-bold text-on-surface">Return Policy</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {store.returnPolicy}
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#0050cb]">local_shipping</span>
                <h2 className="text-sm font-bold text-on-surface">Shipping Information</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {store.shippingInfo}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
