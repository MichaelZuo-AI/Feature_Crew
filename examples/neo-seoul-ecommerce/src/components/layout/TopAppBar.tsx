'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
}

export default function TopAppBar({
  title,
  showBack = false,
  showSearch = false,
  showCart = false,
}: TopAppBarProps) {
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <header className="glass shadow-ambient-up fixed top-0 left-0 right-0 z-50 mx-auto max-w-md h-16">
      <div className="flex items-center h-full px-4 gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">
              arrow_back
            </span>
          </button>
        )}

        {title && !showBack && (
          <span className="text-primary font-extrabold text-lg tracking-tight flex-shrink-0">
            {title}
          </span>
        )}

        {!title && !showBack && !showSearch && <div className="flex-1" />}

        {title && !showSearch && !showBack && <div className="flex-1" />}

        {title && showBack && (
          <h1 className="flex-1 text-center text-base font-bold text-on-surface truncate">
            {title}
          </h1>
        )}

        {showSearch && (
          <Link
            href="/search"
            className="flex-1 flex items-center gap-2 h-10 px-4 rounded-full bg-surface-container-low text-on-surface-variant text-sm"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            <span className="text-on-surface-variant/60">Search products...</span>
          </Link>
        )}

        {showCart && (
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 -mr-2 rounded-full active:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">
              shopping_bag
            </span>
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-secondary-container text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
