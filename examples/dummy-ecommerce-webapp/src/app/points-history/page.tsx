'use client';

import { useState } from 'react';
import TopAppBar from '@/components/layout/TopAppBar';
import {
  pointsBalance,
  expiringPoints,
  currentTier,
  monthlySummary,
  pointsTransactions,
  type PointsTransaction,
} from '@/data/points-data';
import { formatPrice } from '@/lib/format';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type FilterType = 'all' | 'earned' | 'spent' | 'expired';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'earned', label: 'Earned' },
  { key: 'spent', label: 'Spent' },
  { key: 'expired', label: 'Expired' },
];

const DATE_GROUP_ORDER = ['Today', 'This Week', 'Earlier'];

// ---------------------------------------------------------------------------
// Icon config per transaction type
// ---------------------------------------------------------------------------
interface IconConfig {
  icon: string;
  containerClass: string;
  iconClass: string;
}

function getIconConfig(type: PointsTransaction['type']): IconConfig {
  switch (type) {
    case 'earned':
      return {
        icon: 'add_circle',
        containerClass: 'bg-green-100',
        iconClass: 'text-green-600',
      };
    case 'spent':
      return {
        icon: 'remove_circle',
        containerClass: 'bg-blue-100',
        iconClass: 'text-primary',
      };
    case 'expired':
      return {
        icon: 'error',
        containerClass: 'bg-amber-100',
        iconClass: 'text-amber-600',
      };
  }
}

function getAmountClass(type: PointsTransaction['type']): string {
  switch (type) {
    case 'earned':
      return 'text-green-600';
    case 'spent':
      return 'text-primary';
    case 'expired':
      return 'text-amber-600';
  }
}

function formatAmount(amount: number): string {
  const abs = Math.abs(amount);
  if (amount > 0) return `+${abs.toLocaleString()} pts`;
  return `${amount.toLocaleString()} pts`;
}

// ---------------------------------------------------------------------------
// Transaction row
// ---------------------------------------------------------------------------
function TransactionRow({ tx }: { tx: PointsTransaction }) {
  const { icon, containerClass, iconClass } = getIconConfig(tx.type);
  const amountClass = getAmountClass(tx.type);

  return (
    <div className="flex items-center gap-3 py-3 px-4 bg-white rounded-xl">
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${containerClass}`}>
        <span className={`material-symbols-outlined text-xl ${iconClass}`}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface truncate">{tx.description}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Balance: {tx.balance.toLocaleString()} pts
        </p>
      </div>
      <span className={`text-sm font-bold shrink-0 ${amountClass}`}>
        {formatAmount(tx.amount)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PointsHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filtered =
    activeFilter === 'all'
      ? pointsTransactions
      : pointsTransactions.filter((tx) => tx.type === activeFilter);

  // Group by dateGroup
  const grouped: Record<string, PointsTransaction[]> = {};
  for (const tx of filtered) {
    if (!grouped[tx.dateGroup]) grouped[tx.dateGroup] = [];
    grouped[tx.dateGroup].push(tx);
  }

  return (
    <div className="min-h-screen bg-surface pb-10">
      <TopAppBar title="Points History" showBack />

      <div className="pt-20 px-4 space-y-4">
        {/* Balance Hero Card */}
        <div className="gradient-primary rounded-2xl p-5 text-white shadow-ambient">
          <p className="text-sm font-medium opacity-80 mb-1">Available Points</p>
          <p className="text-4xl font-extrabold tracking-tight">
            {pointsBalance.toLocaleString()}
            <span className="text-lg font-semibold ml-1 opacity-80">pts</span>
          </p>
          <p className="text-xs opacity-70 mt-1">≈ {formatPrice(pointsBalance)}</p>

          {/* Expiring warning */}
          <div className="mt-4 bg-amber-400/20 border border-amber-300/40 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-300 text-base">warning</span>
            <p className="text-xs text-amber-100">
              <span className="font-bold">{expiringPoints.amount.toLocaleString()} pts</span>
              {' '}expire on {expiringPoints.date}
            </p>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="bg-white rounded-2xl p-4 ghost-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-lg">workspace_premium</span>
              <p className="text-sm font-bold text-on-surface">Current Tier: {currentTier.name}</p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">
              {formatPrice(currentTier.pointsNeeded)} to {currentTier.nextTier}
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${currentTier.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-on-surface-variant">{currentTier.name}</span>
            <span className="text-[10px] text-primary font-semibold">{currentTier.progress}%</span>
            <span className="text-[10px] text-on-surface-variant">{currentTier.nextTier}</span>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 ghost-border">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-green-600 text-base">trending_up</span>
              <p className="text-xs text-on-surface-variant font-medium">This Month Earned</p>
            </div>
            <p className="text-xl font-extrabold text-green-600">
              +{monthlySummary.earned.toLocaleString()}
              <span className="text-xs font-normal ml-0.5">pts</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 ghost-border">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-primary text-base">trending_down</span>
              <p className="text-xs text-on-surface-variant font-medium">This Month Spent</p>
            </div>
            <p className="text-xl font-extrabold text-primary">
              -{monthlySummary.spent.toLocaleString()}
              <span className="text-xs font-normal ml-0.5">pts</span>
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 no-scrollbar overflow-x-auto pb-1">
          {FILTERS.map(({ key, label }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? 'gradient-primary text-white shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Transaction List */}
        <div className="space-y-4 pb-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">
                receipt_long
              </span>
              <p className="text-sm text-on-surface-variant">No transactions found</p>
            </div>
          ) : (
            DATE_GROUP_ORDER.map((group) => {
              const items = grouped[group];
              if (!items || items.length === 0) return null;
              return (
                <div key={group} className="space-y-2">
                  {/* Group header */}
                  <div className="bg-surface-container-low rounded-lg px-4 py-2">
                    <p className="text-xs font-semibold text-on-surface-variant">{group}</p>
                  </div>
                  {items.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
