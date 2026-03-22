'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { products } from '@/data/products';

export default function PaymentSuccessPageWrapper() {
  return (
    <Suspense fallback={<div className="pt-16 flex items-center justify-center min-h-screen"><span className="text-on-surface-variant">Loading...</span></div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}

function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get('order_id') ?? '';
  const totalRaw = searchParams.get('total') ?? '0';
  const method = searchParams.get('method') ?? '';
  const productsParam = searchParams.get('products') ?? '';

  const totalPaid = Number(totalRaw);

  // Parse purchased items from URL params (format: "id1:qty1,id2:qty2" or just "id" for buy_now)
  const purchasedItems = useMemo(() => {
    if (!productsParam) return [];
    const entries = productsParam.split(',');
    return entries
      .map((entry) => {
        const [id, qtyStr] = entry.split(':');
        const product = products.find((p) => p.id === id);
        return product ? { product, quantity: Number(qtyStr) || 1 } : null;
      })
      .filter(Boolean) as { product: typeof products[0]; quantity: number }[];
  }, [productsParam]);

  const tomorrowDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }, []);

  return (
    <div className="pb-32 pt-4 min-h-screen">
      {/* Top Row */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex items-center justify-center w-10 h-10 rounded-full active:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface">close</span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-sm font-medium text-primary"
        >
          New Arrival
        </button>
      </div>

      {/* Success Section */}
      <div className="flex flex-col items-center pt-12">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center animate-scale-in shadow-ambient">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18L16 24L26 12"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-on-surface mt-6">Payment Successful</h1>
        <p className="text-on-surface-variant text-sm mt-1">Your order has been confirmed.</p>
      </div>

      {/* Delivery Info Pill */}
      <div className="flex justify-center mt-6">
        <div className="bg-surface-container-low rounded-full px-4 py-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">rocket_launch</span>
          <span className="text-sm text-on-surface font-medium">
            Arriving tomorrow, {tomorrowDate}
          </span>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mx-4 mt-6 shadow-ambient">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
              Order Number
            </span>
            <span className="text-sm font-medium text-on-surface">{orderId}</span>
          </div>
          <div className="my-3" />
          <div className="flex justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
              Total Paid
            </span>
            <span className="text-sm font-bold text-primary">{formatPrice(totalPaid)}</span>
          </div>
          <div className="my-3" />
          <div className="flex justify-between">
            <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
              Payment Method
            </span>
            <span className="text-sm font-medium text-on-surface">{decodeURIComponent(method)}</span>
          </div>
        </div>
      </div>

      {/* Purchased Items Card */}
      {purchasedItems.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl p-4 mx-4 mt-4 shadow-ambient">
          <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
            Purchased Items
          </span>
          <div className="mt-3 space-y-3">
            {purchasedItems.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface truncate">{item.product.name}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-on-surface-variant mt-0.5">Qty: {item.quantity}</p>
                  )}
                </div>
                <span className="text-sm font-bold text-on-surface flex-shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="mx-4 mt-8 space-y-3">
        <button
          type="button"
          onClick={() => router.push('/my-page')}
          className="w-full py-4 gradient-primary text-white rounded-xl text-base font-bold shadow-ambient"
        >
          Track My Order
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full py-4 ghost-border text-primary rounded-xl text-base font-bold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
