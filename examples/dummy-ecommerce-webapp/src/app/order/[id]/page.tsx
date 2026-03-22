'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useToastContext } from '@/context/ToastContext';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { Order } from '@/types';

// Suppress unused import warning - products imported for future extensibility
void products;

interface OrderDetail extends Order {
  trackingNumber: string;
  carrier: string;
  statusHistory: {
    status: 'pending' | 'preparing' | 'shipping' | 'delivered';
    timestamp: string;
    description: string;
  }[];
}

const STATUS_STEPS: {
  status: 'pending' | 'preparing' | 'shipping' | 'delivered';
  label: string;
  description: string;
}[] = [
  { status: 'pending', label: 'Order Placed', description: 'Your order has been received.' },
  { status: 'preparing', label: 'Preparing', description: 'We are packing your items.' },
  { status: 'shipping', label: 'Shipped', description: 'Your package is on its way.' },
  { status: 'delivered', label: 'Delivered', description: 'Package delivered successfully.' },
];

const STATUS_ORDER = ['pending', 'preparing', 'shipping', 'delivered'] as const;

function getOrderDetail(order: Order): OrderDetail {
  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const baseDate = new Date(order.date);

  const statusHistory = STATUS_STEPS.slice(0, currentIndex + 1).map((step, i) => {
    const ts = new Date(baseDate);
    ts.setHours(ts.getHours() + i * 6);
    return {
      status: step.status,
      timestamp: ts.toISOString(),
      description: step.description,
    };
  });

  return {
    ...order,
    trackingNumber: `CJ${order.id}`,
    carrier: 'CJ Logistics',
    statusHistory,
  };
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getEstimatedDelivery(order: Order): string {
  const base = new Date(order.date);
  const offset =
    order.status === 'delivered' ? 2 : order.status === 'shipping' ? 1 : 3;
  base.setDate(base.getDate() + offset);
  return base.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user } = useUser();
  const { showToast } = useToastContext();

  const rawOrder = user.orders.find((o) => o.id === params.id);

  if (!rawOrder) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <TopAppBar title="Order Not Found" showBack />
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

  const order = getOrderDetail(rawOrder);
  const currentIndex = STATUS_ORDER.indexOf(order.status);

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    showToast('Tracking number copied!');
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      <TopAppBar title={`Order #CPN-${order.id}`} showBack />

      <div className="pt-20 px-4 space-y-4">
        {/* Status Hero */}
        <div className="bg-surface-container-low rounded-xl p-4">
          <p className="text-2xl font-extrabold text-on-surface capitalize tracking-tight">
            {order.status}
          </p>
          <p className="text-sm text-on-surface-variant mt-1">
            {order.status === 'delivered'
              ? `Delivered on ${getEstimatedDelivery(rawOrder)}`
              : `Estimated delivery: ${getEstimatedDelivery(rawOrder)}`}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Order placed on{' '}
            {new Date(order.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Vertical Timeline Stepper */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-on-surface mb-4">Tracking</h2>
          <div className="relative">
            {STATUS_STEPS.map((step, i) => {
              const isCompleted = i < currentIndex;
              const isActive = i === currentIndex;
              const isPending = i > currentIndex;
              const isLast = i === STATUS_STEPS.length - 1;

              const historyEntry = order.statusHistory.find((h) => h.status === step.status);

              return (
                <div key={step.status} className="flex gap-3">
                  {/* Left: dot + connector */}
                  <div className="flex flex-col items-center">
                    {/* Dot */}
                    {isCompleted && (
                      <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-0.5" />
                    )}
                    {isActive && (
                      <div className="relative shrink-0 mt-0.5">
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                        <div className="absolute inset-0 rounded-full ring-4 ring-primary/20" />
                      </div>
                    )}
                    {isPending && (
                      <div className="w-3 h-3 rounded-full border-2 border-outline shrink-0 mt-0.5" />
                    )}
                    {/* Connector line */}
                    {!isLast && (
                      <div
                        className={`flex-1 w-px mt-1 mb-1 min-h-[28px] ${
                          isCompleted
                            ? 'border-l-2 border-primary'
                            : 'border-l-2 border-dashed border-outline'
                        }`}
                      />
                    )}
                  </div>

                  {/* Right: label + timestamp */}
                  <div className={`flex-1 pb-${isLast ? '0' : '4'} flex items-start justify-between gap-2 min-w-0`}>
                    <div className="min-w-0">
                      <p
                        className={`text-sm leading-tight ${
                          isActive
                            ? 'font-bold text-on-surface'
                            : isCompleted
                            ? 'font-medium text-on-surface'
                            : 'font-normal text-on-surface-variant'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isActive && (
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {step.description}
                        </p>
                      )}
                    </div>
                    {historyEntry && (
                      <span className="text-xs text-on-surface-variant shrink-0 mt-0.5">
                        {formatTimestamp(historyEntry.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Details Island */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-on-surface">Delivery Details</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-on-surface-variant">Carrier</p>
              <p className="text-sm font-medium text-on-surface mt-0.5">{order.carrier}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-on-surface-variant">Tracking Number</p>
              <p className="text-sm font-medium text-on-surface mt-0.5">{order.trackingNumber}</p>
            </div>
            <button
              type="button"
              onClick={handleCopyTracking}
              className="flex items-center justify-center w-9 h-9 rounded-full active:bg-black/5 transition-colors"
              aria-label="Copy tracking number"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                content_copy
              </span>
            </button>
          </div>

          <div>
            <p className="text-xs text-on-surface-variant">Delivery Address</p>
            <p className="text-sm font-medium text-on-surface mt-0.5">{user.address.recipient}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {user.address.line1}
              {user.address.line2 ? `, ${user.address.line2}` : ''}
            </p>
            <p className="text-xs text-on-surface-variant">
              {user.address.city} {user.address.postal_code}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-on-surface mb-3">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-low shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface line-clamp-2 leading-snug">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    &times;{item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-on-surface shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-outline/20 flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">Order Total</span>
            <span className="text-base font-extrabold text-on-surface">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-4">
          <button
            type="button"
            className="flex-1 h-12 rounded-full font-bold text-sm text-white bg-gradient-to-br from-primary to-primary-container flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-lg">local_shipping</span>
            Track Package
          </button>
          <Link
            href={`/returns/${order.id}`}
            className="flex-1 h-12 rounded-full font-bold text-sm text-primary border border-primary/30 flex items-center justify-center gap-2 active:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">assignment_return</span>
            Request Return
          </Link>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
