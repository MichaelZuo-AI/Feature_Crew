'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { formatPrice } from '@/lib/format';

const STATUS_STAGES = ['pending', 'preparing', 'shipping', 'delivered'] as const;
const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  preparing: 1,
  shipping: 2,
  delivered: 3,
};

const MENU_ITEMS: { icon: string; label: string; route?: string }[] = [
  { icon: 'rate_review', label: 'My Reviews', route: '/reviews' },
  { icon: 'favorite', label: 'Wishlist', route: '/wishlist' },
  { icon: 'history', label: 'Recently Viewed', route: '/recently-viewed' },
  { icon: 'confirmation_number', label: 'Coupons', route: '/coupons' },
  { icon: 'notifications', label: 'Notifications', route: '/notifications' },
  { icon: 'local_shipping', label: 'Premium Plus Membership', route: '/membership' },
  { icon: 'support_agent', label: 'Customer Service' },
  { icon: 'settings', label: 'Settings' },
  { icon: 'celebration', label: 'Events' },
  { icon: 'location_on', label: 'Address Management', route: '/addresses' },
  { icon: 'credit_card', label: 'Payment Methods' },
  { icon: 'privacy_tip', label: 'Privacy Policy' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatPoints(n: number): string {
  return n.toLocaleString('ko-KR');
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-blue-50 text-primary';
    case 'preparing':
      return 'bg-amber-50 text-secondary';
    case 'shipping':
      return 'bg-blue-50 text-primary';
    case 'delivered':
      return 'bg-green-50 text-green-700';
    default:
      return 'bg-surface-container-low text-on-surface-variant';
  }
}

function statusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function MyPage() {
  const { user, notifications } = useUser();
  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const latestOrder = user.orders[0];
  const currentStage = latestOrder ? STATUS_INDEX[latestOrder.status] ?? 0 : 0;

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Top App Bar */}
      <header className="glass shadow-ambient-up fixed top-0 left-0 right-0 z-50 mx-auto max-w-md h-16">
        <div className="flex items-center justify-between h-full px-4">
          <h1 className="text-lg font-bold text-on-surface">The Curator</h1>
          <Link
            href="/notifications"
            className="relative flex items-center justify-center w-10 h-10 -mr-2 rounded-full active:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">
              notifications
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 mx-4 mt-20 shadow-ambient">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-on-surface">{user.name}</span>
              {user.is_premium_member && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-xs">local_shipping</span>
                  Plus Member
                </span>
              )}
            </div>
            <p className="text-sm text-on-surface-variant mt-0.5 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-4">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient text-center">
          <p className="text-xl font-bold text-primary">{user.stats.coupons}</p>
          <p className="text-xs text-on-surface-variant mt-1">Coupons</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient text-center">
          <p className="text-xl font-bold text-primary">{formatPoints(user.stats.points)}</p>
          <p className="text-xs text-on-surface-variant mt-1">Points</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-ambient text-center">
          <p className="text-xl font-bold text-primary">{user.stats.gift_cards}</p>
          <p className="text-xs text-on-surface-variant mt-1">Gift Cards</p>
        </div>
      </div>

      {/* Order Tracking Pipeline */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface">Order Tracking</h2>
          <button type="button" className="text-sm text-primary font-medium">
            History
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient">
          <div className="flex items-start justify-between relative">
            {/* Connecting lines */}
            <div className="absolute top-3 left-[calc(12.5%+12px)] right-[calc(12.5%+12px)] h-[2px] bg-surface-container-low z-0" />
            <div
              className="absolute top-3 left-[calc(12.5%+12px)] h-[2px] bg-primary z-0 transition-all duration-500"
              style={{
                width:
                  currentStage === 0
                    ? '0%'
                    : `${(currentStage / (STATUS_STAGES.length - 1)) * 100}%`,
                maxWidth: `calc(100% - ${12.5 * 2}% - 24px)`,
              }}
            />

            {STATUS_STAGES.map((stage, i) => {
              const isCompleted = i < currentStage;
              const isCurrent = i === currentStage;
              return (
                <div key={stage} className="flex flex-col items-center z-10 flex-1">
                  {/* Circle */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-primary'
                        : isCurrent
                        ? 'bg-primary ring-4 ring-primary/20'
                        : 'bg-surface-container-high'
                    }`}
                  >
                    {isCompleted && (
                      <span className="material-symbols-outlined text-white text-sm">
                        check
                      </span>
                    )}
                    {isCurrent && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className={`text-[10px] mt-2 ${
                      isCompleted || isCurrent
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {statusLabel(stage)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-on-surface mb-3">Recent Orders</h2>

        {user.orders.map((order) => (
          <Link
            key={order.id}
            href={`/order/${order.id}`}
            className="block bg-surface-container-lowest rounded-xl p-4 shadow-ambient mt-3 first:mt-0"
          >
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                {/* Product image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover bg-surface-container-low shrink-0"
                />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Order #{order.id}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusBadgeClass(
                        order.status
                      )}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-on-surface mt-1">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            ))}

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              {order.status === 'delivered' ? (
                <button
                  type="button"
                  className="gradient-primary text-white text-xs font-bold px-4 py-2 rounded-full flex-1"
                >
                  Buy Again
                </button>
              ) : (
                <button
                  type="button"
                  className="gradient-primary text-white text-xs font-bold px-4 py-2 rounded-full flex-1"
                >
                  Track Order
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Menu List */}
      <div className="px-4 mt-6 mb-24">
        {MENU_ITEMS.map((item, i) => {
          const className = `w-full flex items-center justify-between py-4 px-4 rounded-lg mt-1 first:mt-0 transition-colors active:bg-black/5 ${
            i % 2 === 0
              ? 'bg-surface-container-lowest'
              : 'bg-surface'
          }`;
          const content = (
            <>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">
                  {item.icon}
                </span>
                <span className="text-sm text-on-surface">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/50 text-lg">
                chevron_right
              </span>
            </>
          );

          if (item.route) {
            return (
              <Link key={item.label} href={item.route} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <button key={item.label} type="button" className={className}>
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
