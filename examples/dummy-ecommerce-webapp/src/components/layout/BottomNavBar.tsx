'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const tabs = [
  { label: 'Home', icon: 'home', route: '/' },
  { label: 'Category', icon: 'grid_view', route: '' },
  { label: 'Search', icon: 'search', route: '/search' },
  { label: 'Cart', icon: 'shopping_bag', route: '/cart' },
  { label: 'My Page', icon: 'person', route: '/my-page' },
];

export default function BottomNavBar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md h-20 shadow-ambient-up">
      <div className="flex items-center justify-around h-full px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.route === '/'
              ? pathname === '/'
              : tab.route !== '' && pathname.startsWith(tab.route);

          const content = (
            <>
              <span
                className={`material-symbols-outlined text-2xl ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {tab.icon}
              </span>

              {tab.icon === 'shopping_bag' && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-container text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}

              <span
                className={`text-[10px] leading-tight ${
                  isActive ? 'text-primary font-semibold' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </>
          );

          if (!tab.route) {
            return (
              <button
                key={tab.label}
                type="button"
                className="flex flex-col items-center justify-center gap-0.5 relative"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.route}
              className="flex flex-col items-center justify-center gap-0.5 relative"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
