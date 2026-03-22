'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/data/products';
import { mockBrands } from '@/data/brands-data';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useToastContext } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToastContext();
  const { wishlist, addToWishlist, removeFromWishlist, addRecentView } = useUser();

  const product = products.find((p) => p.id === params.id);

  const [descExpanded, setDescExpanded] = useState(false);

  const isWishlisted = product ? wishlist.some((w) => w.productId === product.id) : false;
  const brandRecord = product ? mockBrands.find((b) => b.name === product.brand) : undefined;

  useEffect(() => {
    if (product) {
      addRecentView(product.id);
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist');
    } else {
      addToWishlist(product.id, product.price);
      showToast('Added to wishlist');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">
          error_outline
        </span>
        <p className="text-lg font-semibold text-on-surface mb-1">Product not found</p>
        <p className="text-sm text-on-surface-variant mb-6">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          onClick={() => router.push('/')}
          className="gradient-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    router.push(`/checkout?buy_now=${product.id}`);
  };

  const displayedReviews = product.reviews.slice(0, 3);
  const displayedQA = product.qa.slice(0, 2);

  const renderStars = (rating: number) => {
    const filled = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined text-sm ${
              i < filled ? 'text-yellow-400' : 'text-gray-300'
            }`}
            style={i < filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Hero Image */}
      <div className="relative w-full h-80">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 448px) 100vw, 448px"
          priority
        />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full glass flex items-center justify-center shadow-ambient"
        >
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full glass flex items-center justify-center shadow-ambient"
        >
          <span
            className="material-symbols-outlined text-rose-500"
            style={isWishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>
        {product.discount_pct > 0 && (
          <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md">
            {product.discount_pct}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 pt-4">
        {brandRecord ? (
          <Link href={`/brand/${brandRecord.id}`} className="text-xs text-primary font-medium">
            {product.brand}
          </Link>
        ) : (
          <p className="text-xs text-on-surface-variant">{product.brand}</p>
        )}
        <h1 className="text-lg font-semibold text-on-surface mt-0.5">{product.name}</h1>

        <div className="flex items-baseline gap-2 mt-2">
          {product.discount_pct > 0 && (
            <>
              <span className="text-primary font-bold text-2xl">
                {product.discount_pct}%
              </span>
              <span className="text-outline text-sm line-through">
                {formatPrice(product.original_price)}
              </span>
            </>
          )}
          <span className="text-2xl font-black text-on-surface">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-3">
          {renderStars(product.rating)}
          <span className="text-sm font-semibold text-on-surface">{product.rating}</span>
          <span className="text-xs text-on-surface-variant">
            ({product.review_count.toLocaleString()} reviews)
          </span>
        </div>
      </div>

      {/* Express Delivery */}
      {product.express_delivery && (
        <div className="bg-surface-container-low rounded-lg p-3 mx-4 mt-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">
            local_shipping
          </span>
          <span className="text-sm font-medium text-on-surface">
            Tomorrow Arrival Guaranteed
          </span>
        </div>
      )}

      {/* Product Description */}
      <div className="px-4 mt-5">
        <h2 className="text-sm font-bold text-on-surface mb-2">Product Description</h2>
        <p
          className={`text-sm text-on-surface-variant leading-relaxed ${
            !descExpanded ? 'line-clamp-3' : ''
          }`}
        >
          {product.description}
        </p>
        <button
          onClick={() => setDescExpanded(!descExpanded)}
          className="text-xs text-primary font-medium mt-1"
        >
          {descExpanded ? 'Show Less' : 'See More'}
        </button>
      </div>

      {/* Reviews */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-on-surface">
            Reviews ({product.review_count.toLocaleString()})
          </h2>
          <Link href={`/write-review/${product.id}`} className="text-xs text-primary font-medium">Write a Review</Link>
        </div>
        <div className="flex flex-col gap-3">
          {displayedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-surface-container-lowest rounded-lg p-3 shadow-ambient"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-on-surface">
                  {review.reviewer}
                </span>
                <span className="text-[10px] text-on-surface-variant">{review.date}</span>
              </div>
              {renderStars(review.rating)}
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {review.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Q&A */}
      <div className="px-4 mt-6 mb-6">
        <h2 className="text-sm font-bold text-on-surface mb-3">Q&A</h2>
        <div className="flex flex-col gap-3">
          {displayedQA.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-lg p-3 shadow-ambient"
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-primary mt-0.5">Q</span>
                <p className="text-xs font-medium text-on-surface">{item.question}</p>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <span className="text-xs font-bold text-on-surface-variant mt-0.5">A</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Bar */}
      <div className="glass shadow-ambient-up fixed bottom-[84px] left-0 right-0 z-40 max-w-md mx-auto px-4 py-3 flex items-center gap-3">
        <Link
          href={`/compare?ids=${product.id}`}
          className="flex items-center justify-center w-10 h-10 ghost-border rounded-lg shrink-0"
          title="Compare"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-lg">
            compare
          </span>
        </Link>
        <button
          onClick={handleAddToCart}
          className="ghost-border text-primary font-semibold text-sm rounded-lg px-5 py-3 flex-1"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="gradient-primary text-white font-semibold text-sm rounded-lg px-5 py-3 flex-1"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
