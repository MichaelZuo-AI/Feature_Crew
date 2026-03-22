'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { SubmittedReview } from '@/types';

export default function WriteReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { submitReview, submittedReviews } = useUser();

  const productId = params.productId as string;
  const product = products.find((p) => p.id === productId);
  const existingReview = useMemo(
    () => submittedReviews.find((r) => r.productId === productId),
    [submittedReviews, productId]
  );

  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [reviewText, setReviewText] = useState(existingReview?.text ?? '');
  const [termsAgreed, setTermsAgreed] = useState(!!existingReview);

  if (!product) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <span className="text-on-surface-variant">Product not found</span>
      </div>
    );
  }

  const canSubmit = rating > 0 && termsAgreed;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const review: SubmittedReview = {
      id: 'sr' + Date.now(),
      productId,
      rating,
      text: reviewText,
      photos: [],
      date: new Date().toISOString().slice(0, 10),
      helpfulCount: 0,
    };

    submitReview(review);
    router.push('/reviews?tab=submitted');
  };

  return (
    <div className="pb-32 pt-20 px-4 max-w-md mx-auto">
      {/* Fixed Header */}
      <header className="glass shadow-ambient-up fixed top-0 left-0 right-0 z-50 mx-auto max-w-md h-16">
        <div className="flex items-center h-full px-4 gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-on-surface truncate">
            Write a Review
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Product Summary */}
      <div className="bg-surface-container-lowest p-5 rounded-xl">
        <div className="flex gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
              {product.brand}
            </span>
            <p className="font-bold text-on-surface text-sm mt-1 line-clamp-2">{product.name}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-bold text-on-surface">{formatPrice(product.price)}</span>
              {product.original_price > product.price && (
                <span className="text-xs text-on-surface-variant line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <div className="mt-6 flex flex-col items-center">
        <span className="text-sm font-bold text-on-surface-variant tracking-wide">
          WHAT IS YOUR OVERALL RATING?
        </span>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 transition-transform active:scale-90"
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={{
                  fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0",
                  color: star <= rating ? '#ff8a00' : undefined,
                }}
              >
                grade
              </span>
            </button>
          ))}
        </div>
        <span className="text-xs text-on-surface-variant mt-2">
          {rating === 0 ? 'Tap stars to rate' : `${rating} out of 5`}
        </span>
      </div>

      {/* Photo Upload */}
      <div className="mt-8">
        <span className="text-sm font-bold text-on-surface-variant tracking-wide">ADD PHOTOS</span>
        <p className="text-xs text-on-surface-variant mt-1">Up to 3 photos</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1 h-28 rounded-xl border-2 border-dashed border-outline/40 flex flex-col items-center justify-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">
              add_a_photo
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium">Main</span>
          </div>
          <div className="flex-1 h-28 rounded-xl border-2 border-dashed border-outline/40 flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">add</span>
          </div>
          <div className="flex-1 h-28 rounded-xl border-2 border-dashed border-outline/40 flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">add</span>
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="mt-8">
        <span className="text-sm font-bold text-on-surface-variant tracking-wide">
          YOUR EXPERIENCE
        </span>
        <div className="relative mt-3">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value.slice(0, 2000))}
            maxLength={2000}
            rows={6}
            placeholder="Share your experience..."
            className="w-full bg-surface-container-low rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
          <span className="absolute bottom-3 right-4 text-[11px] text-on-surface-variant">
            {reviewText.length} / 2000
          </span>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-8 flex items-start gap-3">
        <button
          type="button"
          onClick={() => setTermsAgreed(!termsAgreed)}
          className="mt-0.5 flex-shrink-0"
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{
              fontVariationSettings: termsAgreed ? "'FILL' 1" : "'FILL' 0",
              color: termsAgreed ? 'var(--md-sys-color-primary)' : undefined,
            }}
          >
            {termsAgreed ? 'check_box' : 'check_box_outline_blank'}
          </span>
        </button>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          I confirm that this review is based on my own experience and is a genuine opinion of the
          product.
        </p>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md">
        <div className="glass px-4 pt-3 pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl text-base font-bold shadow-ambient flex items-center justify-center gap-2 transition-opacity ${
              !canSubmit ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <span className="material-symbols-outlined text-xl">send</span>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
