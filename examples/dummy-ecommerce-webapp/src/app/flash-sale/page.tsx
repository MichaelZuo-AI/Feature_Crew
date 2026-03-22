'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { mockFlashSale } from '@/data/flash-sale-data';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import BottomNavBar from '@/components/layout/BottomNavBar';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
}

function getTimeLeft(endTime: string): TimeLeft {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, ended: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds, ended: false };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function DigitCard({ digit }: { digit: string }) {
  return (
    <span className="bg-white rounded-lg px-3 py-2 text-2xl font-bold text-on-surface">
      {digit}
    </span>
  );
}

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft.ended) {
    return (
      <div className="flex items-center justify-center py-3">
        <span className="text-white text-xl font-bold tracking-wide">Sale Ended</span>
      </div>
    );
  }

  const hh = pad(timeLeft.hours);
  const mm = pad(timeLeft.minutes);
  const ss = pad(timeLeft.seconds);

  return (
    <div className="flex items-center gap-1 justify-center">
      <DigitCard digit={hh[0]} />
      <DigitCard digit={hh[1]} />
      <span className="text-white text-2xl font-bold">:</span>
      <DigitCard digit={mm[0]} />
      <DigitCard digit={mm[1]} />
      <span className="text-white text-2xl font-bold">:</span>
      <DigitCard digit={ss[0]} />
      <DigitCard digit={ss[1]} />
    </div>
  );
}

export default function FlashSalePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [saleEnded, setSaleEnded] = useState(() => getTimeLeft(mockFlashSale.endTime).ended);

  useEffect(() => {
    if (saleEnded) return;
    const interval = setInterval(() => {
      if (getTimeLeft(mockFlashSale.endTime).ended) {
        setSaleEnded(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [saleEnded]);

  const handleBuyNow = useCallback(
    (productId: string) => {
      if (saleEnded) return;
      const product = products.find((p) => p.id === productId);
      if (product) {
        addToCart(product);
        router.push('/cart');
      }
    },
    [saleEnded, addToCart, router]
  );

  const enrichedItems = mockFlashSale.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { item, product };
  }).filter((e): e is { item: typeof mockFlashSale.items[0]; product: NonNullable<typeof products[0]> } => e.product !== undefined);

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-secondary-container to-primary px-4 pt-10 pb-6 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight text-center">
          MEGA FLASH SALE
        </h1>
        <p className="text-white/80 text-sm font-medium">Ends in</p>
        <CountdownTimer endTime={mockFlashSale.endTime} />
      </div>

      {/* Product List */}
      <div className="px-4 pt-4 flex flex-col gap-4">
        {enrichedItems.map(({ item, product }) => {
          const isAlmostGone = item.claimedPercentage > 90;

          return (
            <div key={item.productId} className="bg-white rounded-lg p-4 flex gap-4 shadow-ambient">
              {/* Product Image */}
              <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <p className="text-sm font-medium text-on-surface line-clamp-2 flex-1">
                    {product.name}
                  </p>
                  {isAlmostGone && (
                    <span className="flex-shrink-0 bg-error/10 text-error text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      Almost Gone!
                    </span>
                  )}
                </div>

                {/* Prices */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(item.flashPrice)}
                  </span>
                  <span className="text-outline line-through text-sm">
                    {formatPrice(item.originalPrice)}
                  </span>
                </div>

                {/* Stock Progress Bar */}
                <div>
                  <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-container transition-all duration-500"
                      style={{ width: `${item.claimedPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {item.claimedPercentage}% claimed
                  </p>
                </div>

                {/* BUY NOW Button */}
                <button
                  type="button"
                  onClick={() => handleBuyNow(item.productId)}
                  disabled={saleEnded}
                  className={`mt-1 self-start bg-secondary-container text-on-secondary-container font-bold rounded-lg px-4 py-2 text-sm transition-opacity ${
                    saleEnded ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
                  }`}
                >
                  BUY NOW
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Ticker */}
      <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-md bg-on-surface/80 text-white text-sm py-2 text-center rounded-t-lg z-40 pointer-events-none">
        🔥 {mockFlashSale.claimsLastHour} items claimed in the last hour
      </div>

      <BottomNavBar />
    </div>
  );
}
