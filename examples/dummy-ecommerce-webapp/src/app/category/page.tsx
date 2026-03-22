'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { categories, popularBrands } from '@/data/categories';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

export default function CategoryPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');

  const active = categories.find((c) => c.id === activeCategory) ?? categories[0];
  const categoryIndex = categories.findIndex((c) => c.id === activeCategory);
  const trendingProducts = products.slice(categoryIndex * 2, categoryIndex * 2 + 2).length
    ? products.slice(categoryIndex * 2, categoryIndex * 2 + 2)
    : products.slice(0, 2);

  return (
    <div className={`min-h-screen bg-surface ${plusJakartaSans.className}`}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-md">
        <div className="flex items-center justify-center h-14 px-4">
          <h1 className="text-lg font-bold text-on-surface">Categories</h1>
        </div>
      </div>

      <div className="pt-14">
        {/* Left Sidebar */}
        <div className="fixed left-0 top-14 bottom-0 w-24 bg-surface-container-low overflow-y-auto z-20">
          <div className="flex flex-col">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-3 px-1 relative transition-colors ${
                    isActive
                      ? 'bg-white text-[#0050cb]'
                      : 'text-[#424656] hover:bg-surface-container'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0050cb] rounded-r" />
                  )}
                  <span className="material-symbols-outlined text-[22px]">
                    {cat.icon}
                  </span>
                  <span className="text-[10px] font-medium leading-tight text-center">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-24 pb-24 overflow-y-auto">
          {/* Promotional Banner */}
          <div className="m-3 rounded-2xl bg-gradient-to-r from-primary to-primary-container p-4 text-white">
            <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
              Seasonal Event
            </span>
            <h2 className="text-lg font-bold leading-snug mb-1">
              Up to 40% Off on {active?.name}
            </h2>
            <p className="text-xs text-white/80">
              Exclusive deals on top brands. Limited time only.
            </p>
          </div>

          {/* Sub Categories */}
          <div className="px-3 mt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-on-surface">Sub Categories</h3>
              <button className="text-xs font-semibold text-[#0050cb]">View All</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {active?.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-[#424656]">
                      {sub.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-on-surface text-center leading-tight">
                    {sub.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Brands */}
          <div className="px-3 mt-6">
            <h3 className="text-sm font-bold text-on-surface mb-3">Popular Brands</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {popularBrands.slice(0, 4).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.id}`}
                  className="rounded-xl bg-surface-container-low p-4 flex items-center justify-center h-16"
                >
                  <span className={`text-sm font-bold text-on-surface/30 ${brand.style}`}>
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending in Category */}
          <div className="px-3 mt-6">
            <h3 className="text-sm font-bold text-on-surface mb-3">
              Trending in {active?.name}
            </h3>
            <div className="flex flex-col gap-3">
              {trendingProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="flex gap-3 rounded-xl bg-white p-3"
                >
                  <div className="w-20 h-20 rounded-lg bg-surface-container-low shrink-0 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-[10px] text-[#424656] font-medium">
                      {product.brand}
                    </p>
                    <p className="text-xs font-semibold text-on-surface truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-amber-400 text-[14px]">
                        star
                      </span>
                      <span className="text-[10px] text-[#424656]">
                        {product.rating} ({product.review_count})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-on-surface">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-[10px] text-[#424656] line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                      {product.express_delivery && (
                        <span className="text-[10px] bg-[#0050cb]/10 text-[#0050cb] px-1.5 py-0.5 rounded-full font-medium">
                          Rocket
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
