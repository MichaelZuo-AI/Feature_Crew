'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={`block bg-surface-container-lowest rounded-lg shadow-ambient overflow-hidden ${
        compact ? 'w-36 flex-shrink-0' : ''
      }`}
    >
      <div className="relative">
        <div className={`relative ${compact ? 'aspect-square' : 'aspect-square'} overflow-hidden rounded-md`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes={compact ? '144px' : '(max-width: 448px) 50vw, 224px'}
          />
        </div>

        {product.discount_pct > 0 && (
          <div className="absolute top-1.5 left-1.5">
            <Badge variant="discount">{product.discount_pct}%</Badge>
          </div>
        )}
      </div>

      <div className={`${compact ? 'p-2' : 'p-3'}`}>
        <p className="text-[11px] text-on-surface-variant truncate">
          {product.brand}
        </p>

        <h3
          className={`${
            compact ? 'text-[11px]' : 'text-xs'
          } font-semibold text-on-surface mt-0.5 line-clamp-2 leading-snug`}
        >
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          {product.discount_pct > 0 && (
            <span className="text-[10px] text-outline line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        <p className={`text-primary font-black ${compact ? 'text-base' : 'text-lg'} leading-tight`}>
          {formatPrice(product.price)}
        </p>

        {product.rocket_delivery && (
          <div className="mt-1">
            <Badge variant="rocket">
              <span className="inline-flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[10px]">rocket_launch</span>
                Rocket
              </span>
            </Badge>
          </div>
        )}
      </div>
    </Link>
  );
}
