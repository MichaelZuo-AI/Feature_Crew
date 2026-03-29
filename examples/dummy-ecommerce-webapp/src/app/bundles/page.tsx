'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { useCart } from '@/context/CartContext';
import { useToastContext } from '@/context/ToastContext';
import { bundles, BUNDLE_CATEGORIES, type BundleCategory, type Bundle } from '@/data/bundles-data';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';

function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export default function BundlesPage() {
  const { addToCart } = useCart();
  const { showToast } = useToastContext();
  const [activeCategory, setActiveCategory] = useState<BundleCategory>('All');

  const filteredBundles =
    activeCategory === 'All'
      ? bundles
      : bundles.filter((b) => b.category === activeCategory);

  const featuredBundle = filteredBundles[0] ?? null;
  const moreBundles = filteredBundles.slice(1);

  const addBundleToCart = useCallback(
    (bundle: Bundle) => {
      bundle.productIds.forEach((id) => {
        const product = getProduct(id);
        if (product) addToCart(product);
      });
      showToast(`${bundle.name} added to cart!`);
    },
    [addToCart, showToast]
  );

  return (
    <div className="min-h-screen bg-surface pb-24">
      <TopAppBar title="Bundle Deals" showBack showCart />

      <div className="pt-16 px-4">
        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 -mx-4 px-4">
          {BUNDLE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                activeCategory === cat
                  ? 'gradient-primary text-white shadow-ambient'
                  : 'bg-surface-container-low text-on-surface-variant ghost-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredBundles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3">inventory_2</span>
            <p className="text-sm">No bundles in this category</p>
          </div>
        ) : (
          <>
            {/* Featured bundle hero */}
            {featuredBundle && (
              <FeaturedBundleHero bundle={featuredBundle} onAdd={addBundleToCart} />
            )}

            {/* More bundles */}
            {moreBundles.length > 0 && (
              <section className="mt-6">
                <h2 className="text-base font-bold text-on-surface mb-3">More Bundles</h2>
                <div className="flex flex-col gap-3">
                  {moreBundles.map((bundle) => (
                    <BundleCard key={bundle.id} bundle={bundle} onAdd={addBundleToCart} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}

function FeaturedBundleHero({
  bundle,
  onAdd,
}: {
  bundle: Bundle;
  onAdd: (b: Bundle) => void;
}) {
  const bundleProducts = bundle.productIds.map(getProduct).filter(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-ambient overflow-hidden mt-2">
      {/* Product images row with "+" separators */}
      <div className="bg-surface-container-low px-4 py-5 flex items-center justify-center gap-2">
        {bundleProducts.map((product, i) => (
          <div key={product!.id} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-on-surface-variant font-bold text-lg">+</span>
            )}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-ambient flex-shrink-0">
              <Image
                src={product!.image}
                alt={product!.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-5 pt-3">
        {/* Savings badge */}
        <div className="inline-flex items-center gap-1 bg-secondary-container/20 text-secondary-container rounded-full px-3 py-0.5 text-xs font-bold mb-2">
          <span className="material-symbols-outlined text-sm">local_offer</span>
          Save {formatPrice(bundle.savings)} ({bundle.savingsPercent}% off)
        </div>

        {/* Bundle name */}
        <h2 className="text-lg font-extrabold text-on-surface mb-1">{bundle.name}</h2>

        {/* Product names */}
        <p className="text-xs text-on-surface-variant mb-3">
          {bundleProducts.map((p) => p!.name).join(' · ')}
        </p>

        {/* Prices */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-extrabold text-primary">
            {formatPrice(bundle.bundlePrice)}
          </span>
          <span className="text-sm text-outline line-through">
            {formatPrice(bundle.individualTotal)}
          </span>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => onAdd(bundle)}
          className="w-full gradient-primary text-white font-bold rounded-xl py-3.5 text-base active:scale-[0.98] transition-transform shadow-ambient"
        >
          Add Bundle to Cart
        </button>
      </div>
    </div>
  );
}

function BundleCard({
  bundle,
  onAdd,
}: {
  bundle: Bundle;
  onAdd: (b: Bundle) => void;
}) {
  const bundleProducts = bundle.productIds.map(getProduct).filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-ambient p-4 flex gap-3">
      {/* Product thumbnails row */}
      <div className="flex gap-1 items-center flex-shrink-0">
        {bundleProducts.map((product) => (
          <div
            key={product!.id}
            className="relative w-14 h-14 rounded-lg overflow-hidden shadow-ambient"
          >
            <Image
              src={product!.image}
              alt={product!.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-1.5 mb-0.5">
            <span className="text-sm font-bold text-on-surface leading-tight flex-1">
              {bundle.name}
            </span>
            {/* Savings percent badge */}
            <span className="flex-shrink-0 bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
              -{bundle.savingsPercent}%
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-primary">
              {formatPrice(bundle.bundlePrice)}
            </span>
            <span className="text-xs text-outline line-through">
              {formatPrice(bundle.individualTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={() => onAdd(bundle)}
        className="flex-shrink-0 self-center gradient-primary text-white text-sm font-bold rounded-xl px-4 py-2 active:scale-95 transition-transform"
      >
        Add
      </button>
    </div>
  );
}
