'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { useCart } from '@/context/CartContext';
import { useToastContext } from '@/context/ToastContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PriceAlert {
  id: string;
  productId: string;
  targetPrice: number;
  enabled: boolean;
  status: 'active' | 'triggered' | 'expired';
  priceDropped: boolean;
  previousPrice?: number;
}

// ---------------------------------------------------------------------------
// Initial alert data (5 alerts: 3 active with 1 price drop, 1 triggered, 1 expired)
// ---------------------------------------------------------------------------
const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alert-001',
    productId: 'p001',
    targetPrice: 130000,
    enabled: true,
    status: 'active',
    priceDropped: true,
    previousPrice: 165000,
  },
  {
    id: 'alert-002',
    productId: 'p002',
    targetPrice: 28000,
    enabled: true,
    status: 'active',
    priceDropped: false,
  },
  {
    id: 'alert-003',
    productId: 'p004',
    targetPrice: 30000,
    enabled: true,
    status: 'active',
    priceDropped: false,
  },
  {
    id: 'alert-004',
    productId: 'p003',
    targetPrice: 500000,
    enabled: false,
    status: 'triggered',
    priceDropped: true,
    previousPrice: 699000,
  },
  {
    id: 'alert-005',
    productId: 'p005',
    targetPrice: 80000,
    enabled: false,
    status: 'expired',
    priceDropped: false,
  },
];

type Tab = 'active' | 'triggered' | 'expired';
const TABS: { key: Tab; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'triggered', label: 'Triggered' },
  { key: 'expired', label: 'Expired' },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_ALERTS);
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const { addToCart } = useCart();
  const { showToast } = useToastContext();

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => a.status === activeTab);

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const priceDropCount = alerts.filter((a) => a.priceDropped).length;

  const handleAddToCart = (alert: PriceAlert) => {
    const product = products.find((p) => p.id === alert.productId);
    if (product) {
      addToCart(product);
      showToast('Added to cart!');
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      <TopAppBar title="Price Alerts" showBack />

      <div className="pt-16 px-4 space-y-4 pb-6">
        {/* Summary Card */}
        <div className="mt-4 glass rounded-2xl shadow-ambient p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-white text-2xl">notifications</span>
          </div>
          <div>
            <p className="text-base font-bold text-on-surface">
              {activeCount} Active Alert{activeCount !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-on-surface-variant">
              {priceDropCount} Price Drop{priceDropCount !== 1 ? 's' : ''} This Week
            </p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 p-1 rounded-xl bg-surface-container-low">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alert List */}
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
              notifications_off
            </span>
            <p className="text-base font-semibold text-on-surface">No {activeTab} alerts</p>
            <p className="text-sm text-on-surface-variant text-center px-8">
              {activeTab === 'active'
                ? 'Set price alerts on product pages to get notified when prices drop.'
                : activeTab === 'triggered'
                ? 'Alerts that have reached your target price will appear here.'
                : 'Expired alerts that are no longer monitoring prices appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const product = products.find((p) => p.id === alert.productId);
              if (!product) return null;

              return (
                <div
                  key={alert.id}
                  className="bg-white rounded-2xl shadow-ambient overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    {/* Product Image */}
                    <Link href={`/product/${product.id}`} className="flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Price Drop Badge */}
                      {alert.priceDropped && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-1">
                          <span className="material-symbols-outlined text-[13px]">trending_down</span>
                          Price Dropped!
                        </span>
                      )}

                      {/* Product Name */}
                      <Link href={`/product/${product.id}`}>
                        <p className="text-sm font-medium text-on-surface line-clamp-2 leading-tight mb-1.5">
                          {product.name}
                        </p>
                      </Link>

                      {/* Prices */}
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-base font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {alert.priceDropped && alert.previousPrice && (
                          <span className="text-xs text-on-surface-variant line-through">
                            {formatPrice(alert.previousPrice)}
                          </span>
                        )}
                      </div>

                      {/* Target Price */}
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Target:{' '}
                        <span className="font-semibold text-on-surface">
                          {formatPrice(alert.targetPrice)}
                        </span>
                      </p>
                    </div>

                    {/* Toggle Switch (active tab only) */}
                    {activeTab === 'active' && (
                      <div className="flex-shrink-0 flex items-start pt-1">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={alert.enabled}
                          onClick={() => toggleAlert(alert.id)}
                          className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                            alert.enabled ? 'bg-primary' : 'bg-surface-container-highest'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                              alert.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button (price dropped items) */}
                  {alert.priceDropped && (
                    <div className="px-3 pb-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(alert)}
                        className="w-full py-2.5 rounded-xl gradient-primary text-white text-sm font-bold shadow-ambient active:opacity-90 transition-opacity"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
