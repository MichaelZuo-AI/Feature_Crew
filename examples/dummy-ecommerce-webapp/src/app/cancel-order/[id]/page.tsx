'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useToastContext } from '@/context/ToastContext';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { formatPrice } from '@/lib/format';

const CANCEL_REASONS = [
  'Changed my mind',
  'Found a better price',
  'Ordered by mistake',
  'Delivery too slow',
  'Other',
] as const;

type CancelReason = (typeof CANCEL_REASONS)[number];

function getRefundTimeline(paymentMethod: string): string {
  const method = paymentMethod.toLowerCase();
  if (method.includes('credit') || method.includes('card')) return '3–5 business days';
  if (method.includes('kakao') || method.includes('naver') || method.includes('toss')) return '1–2 business days';
  if (method.includes('store') || method.includes('credit')) return 'Instant';
  return '3–5 business days';
}

export default function CancelOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToastContext();

  const [selectedReason, setSelectedReason] = useState<CancelReason | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = user.orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <TopAppBar title="Cancel Order" showBack />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant">
            inventory_2
          </span>
          <p className="text-lg font-bold text-on-surface">Order not found</p>
          <p className="text-sm text-on-surface-variant">
            We couldn&apos;t find an order with ID #{params.id}.
          </p>
          <Link
            href="/my-page"
            className="mt-2 text-sm font-semibold text-primary underline underline-offset-2"
          >
            Back to My Page
          </Link>
        </div>
        <BottomNavBar />
      </div>
    );
  }

  const handleCancel = () => {
    if (!selectedReason || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      showToast('Order cancelled. Refund is being processed.');
      router.push('/my-page');
    }, 600);
  };

  const refundTimeline = getRefundTimeline(order.payment_method);
  const isShipping = order.status === 'shipping';

  return (
    <div className="min-h-screen bg-surface pb-36">
      <TopAppBar title="Cancel Order" showBack />

      <div className="pt-20 px-4 space-y-4">
        {/* Shipping warning banner */}
        {isShipping && (
          <div className="flex items-start gap-3 bg-error-container rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-error text-xl shrink-0 mt-0.5">
              warning
            </span>
            <div>
              <p className="text-sm font-bold text-error">Order Already Shipped</p>
              <p className="text-xs text-error/80 mt-0.5">
                Your order is on its way. Cancellation may not be possible. If cancelled, you may
                need to refuse delivery or arrange a return.
              </p>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-xl p-4 shadow-ambient space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface">Order Summary</h2>
            <span className="text-xs text-on-surface-variant">#{order.id}</span>
          </div>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container-low shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface line-clamp-2 leading-snug">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">&times;{item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-on-surface shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-outline/10 flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">Order Total</span>
            <span className="text-base font-extrabold text-on-surface">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Cancellation reason */}
        <div className="bg-white rounded-xl p-4 shadow-ambient space-y-3">
          <h2 className="text-sm font-bold text-on-surface">Reason for Cancellation</h2>
          <div className="space-y-2">
            {CANCEL_REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-primary/8'
                      : 'bg-surface-container-low active:bg-surface-container'
                  }`}
                >
                  {/* Custom radio indicator */}
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-primary bg-primary' : 'border-outline'
                    }`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white block" />
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {reason}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Optional details textarea */}
          <div className="mt-1">
            <label className="text-xs font-semibold text-on-surface-variant block mb-1.5">
              Additional details (optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell us more about your reason..."
              rows={3}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 resize-none outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Refund summary */}
        <div className="bg-white rounded-xl p-4 shadow-ambient space-y-3">
          <h2 className="text-sm font-bold text-on-surface">Refund Summary</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Payment Method</span>
              <span className="text-sm font-medium text-on-surface">{order.payment_method}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Refund Timeline</span>
              <span className="text-sm font-medium text-on-surface">{refundTimeline}</span>
            </div>
            <div className="pt-2 border-t border-outline/10 flex items-center justify-between">
              <span className="text-sm font-semibold text-on-surface">Refund Amount</span>
              <span className="text-base font-extrabold text-primary">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Refunds are issued to the original payment method. Processing times may vary depending
            on your bank or payment provider.
          </p>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-outline/10 px-4 py-4 pb-safe flex gap-3 shadow-ambient-up z-40">
        <Link
          href={`/order/${order.id}`}
          className="flex-1 h-12 rounded-full font-bold text-sm text-on-surface flex items-center justify-center ghost-border active:bg-surface-container transition-colors"
        >
          Keep Order
        </Link>
        <button
          type="button"
          onClick={handleCancel}
          disabled={!selectedReason || isSubmitting}
          className={`flex-1 h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            selectedReason && !isSubmitting
              ? 'bg-error text-on-error active:opacity-80'
              : 'bg-error/30 text-on-error/60 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Cancelling...
            </>
          ) : (
            'Cancel Order'
          )}
        </button>
      </div>
    </div>
  );
}
