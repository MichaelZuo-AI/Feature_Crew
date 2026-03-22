'use client';

import { Suspense, useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { products } from '@/data/products';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Tab = 'pending' | 'submitted';

export default function ReviewsPageWrapper() {
  return (
    <Suspense fallback={<div className="pt-16 flex items-center justify-center min-h-screen"><span className="text-on-surface-variant">Loading...</span></div>}>
      <ReviewsPage />
    </Suspense>
  );
}

function ReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submittedReviews, pendingReviews, deleteReview } = useUser();

  const [activeTab, setActiveTab] = useState<Tab>(() =>
    searchParams.get('tab') === 'submitted' ? 'submitted' : 'pending'
  );

  useEffect(() => {
    if (searchParams.get('tab') === 'submitted') {
      setActiveTab('submitted');
    }
  }, [searchParams]);

  const totalPendingPoints = pendingReviews.reduce(
    (sum, r) => sum + r.pointsEarnable,
    0
  );

  const avgRating =
    submittedReviews.length > 0
      ? submittedReviews.reduce((sum, r) => sum + r.rating, 0) /
        submittedReviews.length
      : 0;

  return (
    <div className="min-h-screen bg-surface max-w-md mx-auto pt-32 pb-24">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-md bg-white/85 backdrop-blur-md shadow-ambient-up">
        <div className="flex items-center h-14 px-4 gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">
              arrow_back
            </span>
          </button>
          <h1 className="text-lg font-bold text-on-surface">My Reviews</h1>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-surface-container-low">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              activeTab === 'pending'
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-on-surface-variant'
            }`}
          >
            Pending Reviews
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submitted')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              activeTab === 'submitted'
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-on-surface-variant'
            }`}
          >
            Submitted Reviews
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'pending' ? (
          <>
            {/* Pending Summary */}
            <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-on-surface-variant">Total Pending</p>
                <p className="text-2xl font-bold text-on-surface">
                  {pendingReviews.length}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-lg">
                  star
                </span>
                <div>
                  <p className="text-xs text-on-surface-variant">
                    Points Earnable
                  </p>
                  <p className="text-lg font-bold text-secondary">
                    {totalPendingPoints.toLocaleString('ko-KR')}P
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Review Cards */}
            {pendingReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">task_alt</span>
                <p className="mt-3 text-sm text-on-surface-variant">All caught up! No pending reviews.</p>
              </div>
            ) : (
            <div className="mt-4 space-y-3">
              {pendingReviews.map((pending) => {
                const product = products.find((p) => p.id === pending.productId);
                if (!product) return null;

                return (
                  <div
                    key={pending.productId}
                    className="bg-surface-container-lowest rounded-lg p-4 shadow-ambient"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 rounded-lg object-cover bg-surface-container-low"
                        />
                        <span className="absolute top-1 left-1 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          +{pending.pointsEarnable}P
                        </span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                          {product.brand}
                        </p>
                        <p className="font-bold text-sm text-on-surface line-clamp-2 mt-0.5">
                          {product.name}
                        </p>
                        <p className="text-xs text-outline italic mt-1">
                          Purchased {pending.purchaseDate}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/write-review/${pending.productId}`}
                        className="flex-1 gradient-primary text-white text-xs font-bold py-2.5 rounded-full text-center"
                      >
                        Write Review
                      </Link>
                      <Link
                        href={`/product/${pending.productId}`}
                        className="flex-1 bg-surface-container-low text-on-surface text-xs font-bold py-2.5 rounded-full text-center"
                      >
                        View Item
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {/* Load More */}
            {pendingReviews.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="text-primary text-sm font-medium"
                >
                  Load More Items
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Submitted Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-container text-white p-5 rounded-xl">
                <p className="text-xs opacity-80">Total Reviews</p>
                <p className="text-3xl font-bold mt-1">
                  {submittedReviews.length}
                </p>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-ambient">
                <p className="text-xs text-on-surface-variant">Avg Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-3xl font-bold text-on-surface">
                    {avgRating.toFixed(1)}
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined text-secondary text-base"
                        style={{
                          fontVariationSettings:
                            star <= Math.round(avgRating)
                              ? "'FILL' 1"
                              : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submitted Review Cards */}
            {submittedReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">rate_review</span>
                <p className="mt-3 text-sm text-on-surface-variant">No reviews yet. Start reviewing your purchases!</p>
              </div>
            ) : (
            <div className="mt-4 space-y-3">
              {submittedReviews.map((review) => {
                const product = products.find(
                  (p) => p.id === review.productId
                );
                if (!product) return null;

                return (
                  <div
                    key={review.id}
                    className="bg-surface-container-lowest rounded-lg p-4 shadow-ambient"
                  >
                    {/* Header */}
                    <div className="flex gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover bg-surface-container-low shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-on-surface truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {review.date}
                        </p>
                        {/* Star Rating */}
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className="material-symbols-outlined text-secondary text-base"
                              style={{
                                fontVariationSettings:
                                  star <= review.rating
                                    ? "'FILL' 1"
                                    : "'FILL' 0",
                              }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-on-surface mt-3 line-clamp-3">
                      {review.text}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-container-low">
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-base">
                          thumb_up
                        </span>
                        <span className="text-xs">
                          {review.helpfulCount} people found this helpful
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/write-review/${review.productId}`}
                          className="text-xs text-primary font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteReview(review.id)}
                          className="text-xs text-error font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
