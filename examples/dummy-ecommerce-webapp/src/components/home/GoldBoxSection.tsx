'use client';

import Link from 'next/link';
import { useCountdown } from '@/hooks/useCountdown';
import { goldbox } from '@/data/mock-data';
import ProductCard from '@/components/ui/ProductCard';

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function GoldBoxSection() {
  const { hours, minutes, seconds, isExpired } = useCountdown(goldbox.ends_at);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-secondary text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <h2 className="text-secondary text-lg font-bold">Gold Box</h2>
        </div>

        <div className="flex items-center gap-1.5">
          {isExpired ? (
            <span className="text-sm font-bold text-on-surface-variant">Ended</span>
          ) : (
            <>
              <span className="text-xs text-on-surface-variant">Ends In</span>
              <div className="flex items-center gap-1">
                <span className="bg-secondary text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {pad(hours)}
                </span>
                <span className="text-secondary font-bold text-xs">:</span>
                <span className="bg-secondary text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {pad(minutes)}
                </span>
                <span className="text-secondary font-bold text-xs">:</span>
                <span className="bg-secondary text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {pad(seconds)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {goldbox.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Link
        href="#"
        className="flex items-center justify-center gap-0.5 mt-4 text-sm font-semibold text-primary"
      >
        View All
        <span className="material-symbols-outlined text-base">chevron_right</span>
      </Link>
    </section>
  );
}
