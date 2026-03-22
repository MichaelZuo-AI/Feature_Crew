'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { formatPrice } from '@/lib/format';
import BottomNavBar from '@/components/layout/BottomNavBar';
import type { Coupon } from '@/types';

type Tab = 'available' | 'used' | 'expired';

function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ expiresAt }: { expiresAt: string }) {
  const days = getDaysUntilExpiry(expiresAt);
  let colorClass = 'text-on-surface-variant';
  let label = `Expires in ${days} days`;

  if (days < 1) {
    colorClass = 'text-error';
    label = 'Expires today';
  } else if (days < 7) {
    colorClass = 'text-amber-600';
    label = `Expires in ${days} day${days === 1 ? '' : 's'}`;
  }

  return <span className={`text-xs ${colorClass}`}>{label}</span>;
}

function CouponCard({
  coupon,
  variant,
  onUse,
}: {
  coupon: Coupon;
  variant: Tab;
  onUse?: (id: string) => void;
}) {
  const router = useRouter();
  const isUsed = variant === 'used';
  const isExpired = variant === 'expired';
  const isDeal = coupon.discountType === 'percentage';

  const accentGradient = isDeal
    ? 'bg-gradient-to-b from-[#ff8a00] to-[#ffa940]'
    : 'bg-gradient-to-b from-[#0050cb] to-[#3b82f6]';

  const discountColor = isDeal ? 'text-[#ff8a00]' : 'text-[#0050cb]';
  const discountLabel =
    coupon.discountType === 'fixed'
      ? formatPrice(coupon.discountValue)
      : `${coupon.discountValue}%`;

  const categoryText =
    coupon.categories.length > 0
      ? coupon.categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')
      : 'All categories';

  const handleUse = () => {
    if (onUse) onUse(coupon.id);
    router.push('/');
  };

  return (
    <div
      className={`relative w-full bg-white rounded-xl overflow-hidden shadow-ambient flex ${
        isUsed || isExpired ? 'opacity-50' : ''
      }`}
    >
      {/* Left accent strip */}
      <div className={`w-2 shrink-0 ${accentGradient}`} />

      {/* Left dashed cut-out circle */}
      <div
        className="absolute w-6 h-6 bg-[#f7f9fc] rounded-full z-10"
        style={{ left: '-12px', top: '50%', transform: 'translateY(-50%)' }}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-row items-center px-4 py-4 relative">
        {/* Discount value */}
        <div className="shrink-0 mr-4 flex flex-col items-center justify-center">
          <span
            className={`text-2xl font-extrabold leading-tight ${discountColor} ${
              isExpired ? 'line-through' : ''
            }`}
          >
            {discountLabel}
          </span>
          {coupon.discountType === 'fixed' && (
            <span className="text-[10px] text-on-surface-variant mt-0.5">OFF</span>
          )}
          {coupon.discountType === 'percentage' && (
            <span className="text-[10px] text-on-surface-variant mt-0.5">DISCOUNT</span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-dashed border-l border-dashed border-on-surface-variant/20 mx-2" />

        {/* Coupon details */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-on-surface leading-tight truncate">
            {coupon.name}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Min. spend {formatPrice(coupon.minSpend)}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5 truncate">{categoryText}</p>
          {!isUsed && !isExpired && (
            <div className="mt-1.5">
              <ExpiryBadge expiresAt={coupon.expiresAt} />
            </div>
          )}
        </div>

        {/* Use Now button — only for available */}
        {!isUsed && !isExpired && (
          <button
            type="button"
            onClick={handleUse}
            className="shrink-0 ml-3 text-[#0050cb] text-sm font-semibold whitespace-nowrap active:opacity-70 transition-opacity"
          >
            Use Now
          </button>
        )}
      </div>

      {/* Right dashed cut-out circle */}
      <div
        className="absolute w-6 h-6 bg-[#f7f9fc] rounded-full z-10"
        style={{ right: '-12px', top: '50%', transform: 'translateY(-50%)' }}
      />

      {/* USED stamp */}
      {isUsed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-extrabold text-error/30 rotate-[-15deg] select-none">
            USED
          </span>
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, { icon: string; title: string; subtitle: string }> = {
    available: {
      icon: 'confirmation_number',
      title: 'No coupons available',
      subtitle: 'Check back later for new deals and discounts.',
    },
    used: {
      icon: 'receipt_long',
      title: 'No used coupons',
      subtitle: "Coupons you've redeemed will appear here.",
    },
    expired: {
      icon: 'event_busy',
      title: 'No expired coupons',
      subtitle: 'Expired coupons will appear here for reference.',
    },
  };

  const { icon, title, subtitle } = messages[tab];

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-8 gap-4">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">{icon}</span>
      <p className="text-base font-semibold text-on-surface text-center">{title}</p>
      <p className="text-sm text-on-surface-variant text-center">{subtitle}</p>
    </div>
  );
}

export default function CouponsPage() {
  const router = useRouter();
  const { coupons, useCoupon } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('available');

  const availableCoupons = coupons.filter((c) => c.status === 'available');
  const usedCoupons = coupons.filter((c) => c.status === 'used');
  const expiredCoupons = coupons.filter((c) => c.status === 'expired');

  const tabCoupons: Record<Tab, Coupon[]> = {
    available: availableCoupons,
    used: usedCoupons,
    expired: expiredCoupons,
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'available', label: 'Available' },
    { key: 'used', label: 'Used' },
    { key: 'expired', label: 'Expired' },
  ];

  const currentCoupons = tabCoupons[activeTab];

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-28">
      {/* Custom Top Bar */}
      <header className="glass fixed top-0 left-0 right-0 z-50 mx-auto max-w-md h-16">
        <div className="flex items-center h-full px-4 gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="flex-1 text-base font-bold text-on-surface">My Coupons</h1>
          {/* Available count badge */}
          <span className="bg-[#0050cb] text-white rounded-full px-2 text-xs font-semibold py-0.5">
            {availableCoupons.length}
          </span>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 mx-auto max-w-md bg-white/95 backdrop-blur-sm border-b border-on-surface-variant/10">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  isActive
                    ? 'text-[#0050cb] border-[#0050cb]'
                    : 'text-on-surface-variant border-transparent'
                }`}
              >
                {tab.label}
                {tab.key === 'available' && availableCoupons.length > 0 && (
                  <span
                    className={`ml-1.5 text-xs ${
                      isActive ? 'text-[#0050cb]' : 'text-on-surface-variant'
                    }`}
                  >
                    ({availableCoupons.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="pt-[128px] px-4">
        {currentCoupons.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {currentCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                variant={activeTab}
                onUse={activeTab === 'available' ? useCoupon : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
