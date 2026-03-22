'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockBrands } from '@/data/brands-data';
import { products } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import BottomNavBar from '@/components/layout/BottomNavBar';

interface PageProps {
  params: { brandId: string };
}

export default function BrandPage({ params }: PageProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const brand = mockBrands.find((b) => b.id === params.brandId);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 288);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!brand) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-on-surface-variant text-lg">Brand not found</p>
      </div>
    );
  }

  const brandProducts = products.filter((p) => p.brand === brand.name);
  const bestSellers = brandProducts.slice(0, 6);
  const newArrivals = brandProducts.slice(6, 10).length > 0
    ? brandProducts.slice(6, 10)
    : products.filter((p) => p.brand !== brand.name).slice(0, 4);

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Inline transparent header (inside hero) */}
      <div className="relative h-72">
        {/* Hero background image */}
        <Image
          src={brand.heroImage}
          alt={brand.name}
          fill
          className="object-cover"
          sizes="(max-width: 448px) 100vw, 448px"
          priority
        />

        {/* Gradient overlay */}
        <div className="bg-gradient-to-t from-surface via-surface/50 to-transparent absolute inset-0" />

        {/* Transparent TopAppBar — visible when not scrolled */}
        {!scrolled && (
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center px-4 pt-10 pb-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-white"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-3xl">arrow_back</span>
            </button>
          </div>
        )}

        {/* Brand identity centered in hero */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase">
            {brand.name}
          </h1>
          <p className="text-white/80 text-sm mt-1 text-center px-6">{brand.tagline}</p>
        </div>
      </div>

      {/* Opaque glass header — fixed when scrolled past hero */}
      {scrolled && (
        <div className="glass fixed top-0 left-0 right-0 z-50 mx-auto max-w-md flex items-center px-4 pt-10 pb-3 shadow-ambient">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-on-surface"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-3xl">arrow_back</span>
          </button>
          <span className="ml-4 text-lg font-bold text-on-surface tracking-wide">{brand.name}</span>
        </div>
      )}

      {/* Brand stats bar */}
      <div className="bg-surface-container-low rounded-xl p-4 mx-4 -mt-6 relative z-10">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-on-surface">{brand.productCount}</span>
            <span className="text-xs text-on-surface-variant">Products</span>
          </div>
          <div className="w-px bg-outline-variant/30 self-stretch" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-on-surface">{brand.avgRating}★</span>
            <span className="text-xs text-on-surface-variant">Avg</span>
          </div>
          <div className="w-px bg-outline-variant/30 self-stretch" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-on-surface">{brand.foundedYear}</span>
            <span className="text-xs text-on-surface-variant">Since</span>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-bold text-on-surface mb-3">Our Story</h2>
        <blockquote className="border-l-4 border-primary pl-4 italic text-lg font-semibold text-primary mb-3">
          {brand.pullQuote}
        </blockquote>
        <p className="text-sm text-on-surface-variant leading-relaxed">{brand.story}</p>
      </div>

      {/* Best Sellers carousel */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-on-surface">Best Sellers</h2>
          <Link href={`/search?brand=${encodeURIComponent(brand.name)}`} className="text-primary text-sm">
            See All
          </Link>
        </div>
        {bestSellers.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        ) : (
          <p className="px-4 text-sm text-on-surface-variant">No products available.</p>
        )}
      </div>

      {/* New Arrivals carousel */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-on-surface">New Arrivals</h2>
          <Link href={`/search?brand=${encodeURIComponent(brand.name)}&sort=new`} className="text-primary text-sm">
            See All
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {newArrivals.map((product) => (
            <div key={product.id} className="relative flex-shrink-0">
              <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full absolute top-1.5 left-1.5 z-10">
                NEW
              </span>
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </div>

      {/* Shop All CTA */}
      <div className="px-4 mt-8">
        <Link
          href={`/search?brand=${encodeURIComponent(brand.name)}`}
          className="block w-full bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-lg font-semibold text-center"
        >
          Shop All {brand.name} Products
        </Link>
      </div>

      <BottomNavBar />
    </div>
  );
}
