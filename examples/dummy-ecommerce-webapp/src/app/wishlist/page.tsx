'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { WishlistItem, Product } from '@/types';

type FilterChip = 'All' | 'In Stock' | 'On Sale' | 'Price Drop';

const FILTER_CHIPS: FilterChip[] = ['All', 'In Stock', 'On Sale', 'Price Drop'];

const OUT_OF_STOCK_IDS = new Set(['p003']);

interface EnrichedItem {
  item: WishlistItem;
  product: Product;
  isOutOfStock: boolean;
  isPriceDrop: boolean;
  dropPct: number;
  isOnSale: boolean;
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useUser();
  const { addToCart } = useCart();

  const [activeFilter, setActiveFilter] = useState<FilterChip>('All');
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  // Build enriched items
  const enrichedItems: EnrichedItem[] = wishlist.reduce<EnrichedItem[]>((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return acc;
    const isOutOfStock = OUT_OF_STOCK_IDS.has(item.productId);
    const isPriceDrop = product.price < item.savedPrice;
    const dropPct = isPriceDrop
      ? Math.round(((item.savedPrice - product.price) / item.savedPrice) * 100)
      : 0;
    const isOnSale = product.discount_pct > 0;
    acc.push({ item, product, isOutOfStock, isPriceDrop, dropPct, isOnSale });
    return acc;
  }, []);

  const filtered = enrichedItems.filter((e) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'In Stock') return !e.isOutOfStock;
    if (activeFilter === 'On Sale') return e.isOnSale;
    if (activeFilter === 'Price Drop') return e.isPriceDrop;
    return true;
  });

  const handleHeartTap = useCallback(
    (productId: string) => {
      setRemovingIds((prev) => new Set(prev).add(productId));
      setTimeout(() => {
        removeFromWishlist(productId);
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }, 200);
    },
    [removeFromWishlist]
  );

  const toggleSelect = useCallback((productId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    selected.forEach((id) => {
      setRemovingIds((prev) => new Set(prev).add(id));
    });
    setTimeout(() => {
      selected.forEach((id) => removeFromWishlist(id));
      setSelected(new Set());
      setRemovingIds(new Set());
      setEditMode(false);
    }, 200);
  }, [selected, removeFromWishlist]);

  const handleAddSelectedToCart = useCallback(() => {
    selected.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product && !OUT_OF_STOCK_IDS.has(id)) {
        addToCart(product);
      }
    });
    setSelected(new Set());
    setEditMode(false);
  }, [selected, addToCart]);

  const handleToggleEdit = useCallback(() => {
    setEditMode((prev) => !prev);
    setSelected(new Set());
  }, []);

  const selectedCount = selected.size;

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Top App Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-md">
        <div className="glass shadow-ambient-up h-16 flex items-center px-4 gap-3">
          {/* Back button rendered inline since we need Edit button on the right */}
          <Link
            href="/my-page"
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </Link>
          <h1 className="flex-1 text-center text-base font-bold text-on-surface truncate">
            My Wishlist
          </h1>
          <button
            type="button"
            onClick={handleToggleEdit}
            className="text-sm font-semibold text-primary w-10 flex items-center justify-center"
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>

        {/* Filter Chips */}
        <div className="bg-surface/95 backdrop-blur-sm px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeFilter === chip
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-highest text-on-surface'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Content — offset for fixed header (64px app bar + ~44px chips) */}
      <div className="pt-[116px]">
        {filtered.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 gap-4">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">
              favorite
            </span>
            <p className="text-base font-semibold text-on-surface text-center">
              {wishlist.length === 0
                ? 'Your wishlist is empty'
                : 'No items match this filter'}
            </p>
            <p className="text-sm text-on-surface-variant text-center">
              {wishlist.length === 0
                ? 'Save items you love and come back to them anytime.'
                : 'Try a different filter to see more items.'}
            </p>
            {wishlist.length === 0 && (
              <Link
                href="/"
                className="mt-2 px-6 py-3 rounded-xl gradient-primary text-white text-sm font-bold shadow-ambient"
              >
                Start Exploring
              </Link>
            )}
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 gap-3 px-3 pb-6">
            {filtered.map(({ item, product, isOutOfStock, isPriceDrop, dropPct }) => {
              const isRemoving = removingIds.has(product.id);
              const isSelected = selected.has(product.id);

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-lg overflow-hidden shadow-ambient relative transition-transform duration-200 ${
                    isRemoving ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                  }`}
                  style={{ transition: 'transform 200ms ease, opacity 200ms ease' }}
                >
                  {/* Image Area */}
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />

                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-t-lg">
                        <span className="text-xs font-bold text-on-surface bg-white/80 px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Price Drop Badge */}
                    {isPriceDrop && (
                      <div className="absolute top-2 left-2 bg-secondary-container text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        ↓{dropPct}%
                      </div>
                    )}

                    {/* Heart / Remove Button */}
                    {!editMode && (
                      <button
                        type="button"
                        onClick={() => handleHeartTap(product.id)}
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm active:scale-90 transition-transform"
                        aria-label="Remove from wishlist"
                      >
                        <span
                          className="material-symbols-outlined text-error text-lg"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                      </button>
                    )}

                    {/* Checkbox in Edit Mode */}
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => toggleSelect(product.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded flex items-center justify-center transition-colors shadow-sm"
                        style={{
                          background: isSelected ? '#0050cb' : 'rgba(255,255,255,0.9)',
                          border: isSelected ? 'none' : '2px solid #c2c6d8',
                        }}
                        aria-label={isSelected ? 'Deselect' : 'Select'}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-white text-sm leading-none">
                            check
                          </span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-2.5">
                    <p className="text-[11px] text-on-surface-variant mb-0.5 truncate">
                      {product.brand}
                    </p>
                    <p className="text-sm text-on-surface font-medium line-clamp-2 leading-tight mb-1.5">
                      {product.name}
                    </p>

                    {/* Price */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.price < item.savedPrice && (
                        <span className="text-[11px] text-on-surface-variant line-through">
                          {formatPrice(item.savedPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Mode Action Bar */}
      {editMode && (
        <div
          className="fixed bottom-20 left-0 right-0 z-40 mx-auto max-w-md px-4 pb-2 animate-slide-up"
        >
          <div className="glass rounded-xl shadow-ambient-up p-3 flex gap-3">
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={selectedCount === 0}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-opacity ${
                selectedCount === 0 ? 'opacity-40' : 'opacity-100'
              } bg-error text-white`}
            >
              Delete ({selectedCount})
            </button>
            <button
              type="button"
              onClick={handleAddSelectedToCart}
              disabled={selectedCount === 0}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-opacity ${
                selectedCount === 0 ? 'opacity-40' : 'opacity-100'
              } gradient-primary text-white`}
            >
              Add to Cart ({selectedCount})
            </button>
          </div>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
}
