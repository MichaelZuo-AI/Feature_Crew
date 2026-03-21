'use client';

import type { SearchResult } from '@/lib/types';

interface ProductCardProps {
  product: SearchResult;
  index: number;
  isMobile: boolean;
  onClick: () => void;
}

const BADGE_LABELS: Record<string, string> = {
  BEST_SELLER: 'Best Seller',
  FREE_SHIPPING: 'Free Shipping',
  NEW: 'New',
  SALE: 'Sale',
};

function formatBadge(badge: string): string {
  if (BADGE_LABELS[badge]) return BADGE_LABELS[badge];
  const asNum = Number(badge);
  if (!Number.isNaN(asNum)) return `-${asNum}%`;
  return badge
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    value,
  );
}

function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

function renderStars(average: number): React.ReactNode {
  const full = Math.floor(average);
  const hasHalf = average - full >= 0.25 && average - full < 0.75;
  const stars: React.ReactNode[] = [];

  for (let i = 0; i < full; i++) {
    stars.push(
      <span key={`full-${i}`} className="text-[#F59E0B]">
        &#9733;
      </span>,
    );
  }
  if (hasHalf) {
    stars.push(
      <span key="half" className="text-[#F59E0B] opacity-50">
        &#9733;
      </span>,
    );
  }
  const remaining = 5 - full - (hasHalf ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    stars.push(
      <span key={`empty-${i}`} className="text-[#F59E0B] opacity-20">
        &#9733;
      </span>,
    );
  }
  return stars;
}

export default function ProductCard({
  product,
  index,
  isMobile,
  onClick,
}: ProductCardProps) {
  const { title, thumbnail, price, rating, badges } = product;
  const showOriginal =
    price.original !== null && price.original !== price.current;
  const firstBadge = badges.length > 0 ? badges[0] : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="bg-[#242424] border border-[#333] rounded-[10px] overflow-hidden transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
      style={{
        animation: `productCardFadeIn 300ms ease-out ${index * 50}ms both`,
      }}
    >
      <style>{`
        @keyframes productCardFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Thumbnail */}
      <div
        className={`${isMobile ? 'h-[100px]' : 'h-[140px]'} bg-gradient-to-br from-[#2a2a3e] to-[#1e1e2e] flex items-center justify-center relative`}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : null}

        {firstBadge && (
          <span className="absolute top-2 left-2 bg-[#EF4444] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]">
            {formatBadge(firstBadge)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[13px] font-medium leading-tight line-clamp-2 mb-1.5">
          {title}
        </p>

        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[16px] font-bold text-[#818CF8]">
            {formatPrice(price.current, price.currency)}
          </span>
          {showOriginal && (
            <span className="text-[12px] text-[#888] line-through">
              {formatPrice(price.original!, price.currency)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[12px] text-[#888]">
          <span className="flex">{renderStars(rating.average)}</span>
          <span>({formatCount(rating.count)})</span>
        </div>
      </div>
    </div>
  );
}
