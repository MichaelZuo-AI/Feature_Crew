'use client';

import { Suspense, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { ComparisonSpec } from '@/types';
import { Product } from '@/types';

const specs: ComparisonSpec[] = [
  { label: 'Rating', key: 'rating', category: 'general', bestIs: 'highest' },
  { label: 'Price', key: 'price', category: 'general', bestIs: 'lowest' },
  { label: 'Brand', key: 'brand', category: 'general', bestIs: 'none' },
  { label: 'Express Delivery', key: 'express_delivery', category: 'delivery', bestIs: 'highest' },
  { label: 'Discount', key: 'discount_pct', category: 'specifications', bestIs: 'highest' },
  { label: 'Reviews', key: 'review_count', category: 'reviews', bestIs: 'highest' },
];

const CATEGORY_ORDER: ComparisonSpec['category'][] = ['general', 'specifications', 'reviews', 'delivery'];
const CATEGORY_LABELS: Record<ComparisonSpec['category'], string> = {
  general: 'General',
  specifications: 'Specifications',
  reviews: 'Reviews',
  delivery: 'Delivery',
};

function getWinnerIndex(compareProducts: Product[], spec: ComparisonSpec): number | null {
  if (spec.bestIs === 'none' || compareProducts.length < 2) return null;

  const values = compareProducts.map((p) => {
    const val = p[spec.key];
    if (typeof val === 'boolean') return val ? 1 : 0;
    if (typeof val === 'number') return val;
    return null;
  });

  if (values.some((v) => v === null)) return null;

  const numValues = values as number[];
  const best =
    spec.bestIs === 'highest'
      ? Math.max(...numValues)
      : Math.min(...numValues);

  const winnerIdx = numValues.indexOf(best);
  // Only highlight if there's a clear winner (not a tie)
  const tiedCount = numValues.filter((v) => v === best).length;
  if (tiedCount > 1) return null;

  return winnerIdx;
}

function formatSpecValue(product: Product, spec: ComparisonSpec): string {
  const val = product[spec.key];
  if (spec.key === 'rating') return `★ ${(val as number).toFixed(1)}`;
  if (spec.key === 'price') return formatPrice(val as number);
  if (spec.key === 'express_delivery') return (val as boolean) ? 'Yes ✓' : 'No';
  if (spec.key === 'discount_pct') return `${val}% off`;
  if (spec.key === 'review_count') return `${(val as number).toLocaleString()} reviews`;
  return String(val);
}

function AddProductSheet({
  existingIds,
  onAdd,
  onClose,
}: {
  existingIds: string[];
  onAdd: (id: string) => void;
  onClose: () => void;
}) {
  const available = products.filter((p) => !existingIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />
      <div
        className="relative bg-white rounded-t-2xl max-h-[60vh] flex flex-col mx-auto w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
          <h2 className="text-base font-bold text-on-surface">Add Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full active:bg-black/5"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {available.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-8">No more products to add</p>
          ) : (
            available.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { onAdd(p.id); onClose(); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl active:bg-surface-container-low transition-colors text-left"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-on-surface line-clamp-2">{p.name}</p>
                  <p className="text-sm font-bold text-primary mt-0.5">{formatPrice(p.price)}</p>
                </div>
                <span className="material-symbols-outlined text-primary">add_circle</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get('ids')?.split(',').filter(Boolean) ?? [];

  const [compareIds, setCompareIds] = useState<string[]>(initialIds.slice(0, 3));
  const [showSheet, setShowSheet] = useState(false);
  const { addToCart } = useCart();

  const compareProducts = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const removeProduct = useCallback((id: string) => {
    setCompareIds((prev) => prev.filter((pid) => pid !== id));
  }, []);

  const addProduct = useCallback((id: string) => {
    setCompareIds((prev) => (prev.length < 3 ? [...prev, id] : prev));
  }, []);

  // Group specs by category in order
  const specsByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    specs: specs.filter((s) => s.category === cat),
  })).filter((g) => g.specs.length > 0);

  const colCount = compareProducts.length + (compareProducts.length < 3 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <TopAppBar title="Compare Products" showBack />

      {/* Page content with top padding for fixed header */}
      <div className="pt-16 pb-32">
        {/* Sticky product header row */}
        <div className="sticky top-16 z-40 bg-[#f7f9fc] shadow-sm">
          <div
            className="grid gap-2 px-3 py-3"
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
          >
            {compareProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-xl p-2 flex flex-col items-center gap-1 shadow-sm"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-red-50 hover:text-red-500 transition-colors z-10"
                >
                  <span className="material-symbols-outlined text-xs leading-none" style={{ fontSize: '14px' }}>close</span>
                </button>

                {/* Product image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Product name */}
                <p className="text-xs text-on-surface line-clamp-2 text-center w-full leading-tight">
                  {product.name}
                </p>

                {/* Price */}
                <p className="text-sm font-bold text-primary leading-tight">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}

            {/* Add slot */}
            {compareProducts.length < 3 && (
              <button
                type="button"
                onClick={() => setShowSheet(true)}
                className="bg-[#f7f9fc] rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 py-4 text-on-surface-variant active:bg-surface-container-low transition-colors min-h-[120px]"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
                <span className="text-xs text-center leading-tight">Add product</span>
              </button>
            )}
          </div>
        </div>

        {/* Not enough products message */}
        {compareProducts.length < 2 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">
              compare_arrows
            </span>
            <p className="text-base font-semibold text-on-surface mb-1">
              Add at least 2 products to compare
            </p>
            <p className="text-sm text-on-surface-variant">
              Tap the + button above to add products
            </p>
          </div>
        )}

        {/* Comparison table */}
        {compareProducts.length >= 2 && (
          <div className="mt-1">
            {specsByCategory.map((group) => (
              <div key={group.category}>
                {/* Category header */}
                <div className="bg-surface-container-low px-4 py-2">
                  <span className="text-xs font-bold uppercase text-on-surface-variant tracking-wide">
                    {group.label}
                  </span>
                </div>

                {/* Spec rows */}
                {group.specs.map((spec, rowIdx) => {
                  const winnerIdx = getWinnerIndex(compareProducts, spec);
                  const isEvenRow = rowIdx % 2 === 0;

                  return (
                    <div
                      key={spec.key as string}
                      className={`px-3 py-2 ${isEvenRow ? 'bg-white' : 'bg-[#f7f9fc]'}`}
                    >
                      {/* Row label */}
                      <p className="text-xs text-on-surface-variant mb-1.5">{spec.label}</p>

                      {/* Values row */}
                      <div
                        className="grid gap-2"
                        style={{ gridTemplateColumns: `repeat(${compareProducts.length}, minmax(0, 1fr))` }}
                      >
                        {compareProducts.map((product, colIdx) => {
                          const isWinner = winnerIdx === colIdx;
                          const val = formatSpecValue(product, spec);
                          const isRocket = spec.key === 'express_delivery';
                          const rocketVal = product[spec.key] as boolean;

                          return (
                            <div key={product.id} className="flex items-center justify-center">
                              {isWinner ? (
                                <span className="bg-primary/10 text-primary font-bold rounded-full px-2 py-0.5 text-xs text-center">
                                  {val}
                                </span>
                              ) : (
                                <span
                                  className={`text-xs text-center ${
                                    isRocket && !rocketVal
                                      ? 'text-on-surface-variant'
                                      : isRocket && rocketVal
                                      ? 'text-green-600 font-medium'
                                      : 'text-on-surface'
                                  }`}
                                >
                                  {val}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky bottom bar with Add to Cart buttons */}
      {compareProducts.length >= 1 && (
        <div
          className="fixed bottom-20 left-0 right-0 z-40 mx-auto max-w-md px-3 py-2"
          style={{
            background: 'rgba(247,249,252,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(compareProducts.length, 3)}, minmax(0, 1fr))`,
            }}
          >
            {compareProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                className="py-2.5 rounded-xl text-xs font-bold text-white transition-opacity active:opacity-80"
                style={{
                  background: 'linear-gradient(135deg, #0050cb 0%, #0073e6 100%)',
                }}
              >
                Add to Cart
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom sheet for adding products */}
      {showSheet && (
        <AddProductSheet
          existingIds={compareIds}
          onAdd={addProduct}
          onClose={() => setShowSheet(false)}
        />
      )}

      <BottomNavBar />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
            compare_arrows
          </span>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
