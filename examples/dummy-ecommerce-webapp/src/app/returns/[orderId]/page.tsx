'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useToastContext } from '@/context/ToastContext';
import TopAppBar from '@/components/layout/TopAppBar';
import { formatPrice } from '@/lib/format';

const RETURN_REASONS = [
  'Changed my mind',
  'Defective/Damaged',
  'Wrong item received',
  "Doesn't match description",
  'Other',
];

const STEPS = ['Select Items', 'Reason', 'Review'] as const;

interface StepperProps {
  currentStep: number;
}

function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      {STEPS.map((label, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold relative
                  ${isCompleted ? 'bg-primary text-white' : ''}
                  ${isCurrent ? 'border-2 border-primary bg-white text-primary' : ''}
                  ${!isCompleted && !isCurrent ? 'border-2 border-outline bg-white text-on-surface-variant' : ''}
                `}
              >
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-primary/30 animate-pulse" />
                )}
                {isCompleted ? (
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'wght' 600" }}>
                    check
                  </span>
                ) : (
                  <span className="relative z-10">{stepNum}</span>
                )}
              </div>
              <span className="text-xs text-on-surface-variant whitespace-nowrap">{label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-4 ${isCompleted ? 'bg-primary' : 'bg-outline'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface PageProps {
  params: { orderId: string };
}

export default function ReturnsPage({ params }: PageProps) {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToastContext();

  const [step, setStep] = useState(1);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const order = user.orders.find((o) => o.id === params.orderId);

  useEffect(() => {
    if (!order || order.status !== 'delivered') {
      showToast('Returns are only available for delivered orders');
      router.back();
    }
  }, [order, router, showToast]);

  if (!order || order.status !== 'delivered') {
    return null;
  }

  const selectedItems = order.items.filter((item) =>
    selectedItemIds.includes(item.product.id)
  );

  const refundAmount = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function toggleItem(productId: string) {
    setSelectedItemIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  function handlePhotoSlotTap(idx: number) {
    setPhotos((prev) => {
      const next = [...prev];
      next[idx] = `https://picsum.photos/seed/return-photo-${idx}/200/200`;
      return next;
    });
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6">
        <div
          className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center"
          style={{ animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
        >
          <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
            check
          </span>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-on-surface">Return request submitted</p>
          <p className="text-sm text-on-surface-variant mt-1">
            We&apos;ll process your return within 1–3 business days.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/my-page')}
          className="w-full max-w-xs h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm"
        >
          Return to My Page
        </button>
        <style>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.4); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <TopAppBar title="Request Return" showBack />

      <div className="pt-16">
        <Stepper currentStep={step} />

        {/* Step 1 — Select Items */}
        {step === 1 && (
          <div className="px-4 flex flex-col gap-4">
            <p className="text-sm text-on-surface-variant">Select items to return</p>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => {
                const isSelected = selectedItemIds.includes(item.product.id);
                return (
                  <button
                    key={item.product.id}
                    type="button"
                    onClick={() => toggleItem(item.product.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors text-left w-full
                      ${isSelected ? 'border-primary bg-primary/5' : 'border-outline/30 bg-surface-container-low'}
                    `}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors
                        ${isSelected ? 'border-primary bg-primary' : 'border-outline'}
                      `}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-white" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                          check
                        </span>
                      )}
                    </div>
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">×{item.quantity}</p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-background/90 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={selectedItemIds.length === 0}
                className={`w-full h-12 rounded-full font-semibold text-sm transition-opacity
                  ${selectedItemIds.length > 0
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-outline/30 text-on-surface-variant cursor-not-allowed opacity-50'
                  }
                `}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Reason */}
        {step === 2 && (
          <div className="px-4 flex flex-col gap-4 pb-28">
            <p className="text-sm text-on-surface-variant">Why are you returning?</p>

            <div className="flex flex-col gap-2">
              {RETURN_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-colors text-left
                    ${reason === r ? 'border-primary bg-primary/5' : 'border-outline/30 bg-surface-container-low'}
                  `}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                      ${reason === r ? 'border-primary' : 'border-outline'}
                    `}
                  >
                    {reason === r && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm text-on-surface">{r}</span>
                </button>
              ))}
            </div>

            {reason === 'Defective/Damaged' && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-on-surface">Add photos (optional)</p>
                <div className="flex gap-3">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePhotoSlotTap(idx)}
                      className="relative w-20 h-20 bg-surface-container-low rounded-lg flex items-center justify-center overflow-hidden border border-outline/20"
                    >
                      {photos[idx] ? (
                        <Image
                          src={photos[idx]}
                          alt={`Photo ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant text-2xl">
                          add_a_photo
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-on-surface">Additional details (optional)</p>
              <div className="relative">
                <textarea
                  value={details}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setDetails(e.target.value);
                  }}
                  placeholder="Describe the issue..."
                  rows={4}
                  className="w-full bg-surface-container-low rounded-xl p-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none outline-none border border-transparent focus:border-primary/40 transition-colors"
                />
                <span className="absolute bottom-2 right-3 text-xs text-on-surface-variant">
                  {details.length} / 500
                </span>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-background/90 backdrop-blur-sm flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-full font-semibold text-sm text-primary border border-primary/30"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!reason}
                className={`flex-2 flex-[2] h-12 rounded-full font-semibold text-sm transition-opacity
                  ${reason
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-outline/30 text-on-surface-variant cursor-not-allowed opacity-50'
                  }
                `}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="px-4 flex flex-col gap-4 pb-28">
            <p className="text-sm text-on-surface-variant">Review your return request</p>

            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
                  Items to Return
                </p>
                <div className="flex flex-col gap-2">
                  {selectedItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-on-surface line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-on-surface-variant">×{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-on-surface">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-outline/20" />

              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
                  Reason
                </p>
                <p className="text-sm text-on-surface">{reason}</p>
                {details && (
                  <p className="text-xs text-on-surface-variant mt-1">{details}</p>
                )}
              </div>

              <div className="h-px bg-outline/20" />

              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Refund Amount
                </p>
                <p className="text-base font-bold text-primary">{formatPrice(refundAmount)}</p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Refund Method
                </p>
                <p className="text-sm text-on-surface">{order.payment_method}</p>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-background/90 backdrop-blur-sm flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 h-12 rounded-full font-semibold text-sm text-primary border border-primary/30"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-[2] h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm"
              >
                Submit Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
