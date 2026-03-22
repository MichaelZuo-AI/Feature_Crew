'use client';

import { Suspense, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useToastContext } from '@/context/ToastContext';
import { formatPrice } from '@/lib/format';
import { products } from '@/data/products';

const PAYMENT_METHODS = ['ShopPay', 'NaverPay', 'KakaoPay', 'Credit/Debit'] as const;

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div className="pt-16 flex items-center justify-center min-h-screen"><span className="text-on-surface-variant">Loading...</span></div>}>
      <CheckoutPage />
    </Suspense>
  );
}

function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedItems, deliveryFee, discount, removeSelected } = useCart();
  const { user, applyCash } = useUser();
  const { showToast } = useToastContext();

  const [selectedMethod, setSelectedMethod] = useState<string>('ShopPay');
  const [cashApplied, setCashApplied] = useState(false);

  // Check for buy_now mode
  const buyNowId = searchParams.get('buy_now');
  const buyNowProduct = buyNowId ? products.find((p) => p.id === buyNowId) : null;

  const checkoutItems = useMemo(() => {
    if (buyNowProduct) {
      return [{ product: buyNowProduct, quantity: 1 }];
    }
    return selectedItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));
  }, [buyNowProduct, selectedItems]);

  const checkoutSubtotal = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [checkoutItems]
  );

  const checkoutDeliveryFee = useMemo(() => {
    if (buyNowProduct) {
      return buyNowProduct.express_delivery ? 0 : 3000;
    }
    return deliveryFee;
  }, [buyNowProduct, deliveryFee]);

  const appliedCash = cashApplied ? Math.min(user.store_credit, checkoutSubtotal) : 0;
  const checkoutDiscount = buyNowProduct ? appliedCash : discount + appliedCash;
  const effectiveDeliveryFee = user.is_premium_member ? 0 : checkoutDeliveryFee;
  const checkoutTotal = Math.max(0, checkoutSubtotal + effectiveDeliveryFee - checkoutDiscount);

  const hasExpressItems = checkoutItems.some((item) => item.product.express_delivery);

  const handleApplyCash = () => {
    if (cashApplied) {
      setCashApplied(false);
    } else {
      setCashApplied(true);
    }
  };

  const handlePay = () => {
    const orderId = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      Math.random() * 9000000 + 1000000
    )}`;

    if (cashApplied && appliedCash > 0) {
      applyCash(appliedCash);
    }

    // Encode product IDs before clearing cart
    const productIds = buyNowProduct
      ? buyNowProduct.id
      : checkoutItems.map((item) => `${item.product.id}:${item.quantity}`).join(',');

    if (!buyNowProduct) {
      removeSelected();
    }

    router.push(
      `/payment-success?order_id=${orderId}&total=${checkoutTotal}&method=${encodeURIComponent(
        selectedMethod
      )}&products=${encodeURIComponent(productIds)}`
    );
  };

  return (
    <div className="pb-36 pt-16">
      {/* Top App Bar */}
      <header className="glass shadow-ambient-up fixed top-0 left-0 right-0 z-50 mx-auto max-w-md h-16">
        <div className="flex items-center h-full px-4 gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-on-surface truncate flex items-center justify-center gap-2">
            Checkout
            {user.is_premium_member && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-[10px] text-white font-black px-1.5 py-0.5 rounded italic">PLUS</span>
            )}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Shipping Address */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mx-4 mt-4 shadow-ambient">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
            Shipping Address
          </span>
          <button
            type="button"
            onClick={() => showToast('Coming soon')}
            className="text-sm font-medium text-primary"
          >
            Change
          </button>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-on-surface">{user.address.recipient}</span>
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Default
            </span>
            {user.is_premium_member && (
              <span className="text-[9px] font-bold text-white bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 rounded-full">Plus Member</span>
            )}
          </div>
          <p className="text-sm text-on-surface-variant">{user.address.line1}</p>
          <p className="text-sm text-on-surface-variant">{user.address.line2}</p>
          <p className="text-sm text-on-surface-variant">
            {user.address.city} {user.address.postal_code}
          </p>
          <p className="text-sm text-on-surface-variant">{user.address.phone}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mx-4 mt-4 shadow-ambient">
        <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
          Order Summary
        </span>
        <div className="mt-3 space-y-3">
          {checkoutItems.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface truncate">{item.product.name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {item.quantity} &times; {formatPrice(item.product.price)}
                </p>
              </div>
              <span className="text-sm font-bold text-on-surface flex-shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Points & Benefits */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mx-4 mt-4">
        <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
          Points &amp; Benefits
        </span>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-lg">
              account_balance_wallet
            </span>
            <span className="text-sm text-on-surface">Store Credit</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-on-surface-variant">
              {formatPrice(user.store_credit)}
            </span>
            <button
              type="button"
              onClick={handleApplyCash}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                cashApplied
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-primary'
              }`}
            >
              {cashApplied ? 'Applied' : 'Apply All'}
            </button>
          </div>
        </div>
        {cashApplied && appliedCash > 0 && (
          <p className="text-xs text-primary mt-2 ml-7">
            -{formatPrice(appliedCash)} applied
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mx-4 mt-4">
        <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
          Payment Method
        </span>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setSelectedMethod(method)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedMethod === method
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mx-4 mt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Total Price</span>
            <span className="text-on-surface">{formatPrice(checkoutSubtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Shipping</span>
            <div className="flex items-center gap-2">
              {user.is_premium_member && checkoutDeliveryFee > 0 ? (
                <>
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-[10px] text-white font-black px-1.5 py-0.5 rounded italic">PLUS</span>
                  <span className="text-primary text-xs font-semibold">FREE EXPRESS DELIVERY</span>
                  <span className="text-on-surface-variant line-through text-xs">{formatPrice(checkoutDeliveryFee)}</span>
                  <span className="text-primary font-medium">₩0</span>
                </>
              ) : (
                <>
                  {hasExpressItems && checkoutDeliveryFee === 0 && (
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      EXPRESS DELIVERY FREE
                    </span>
                  )}
                  <span className={checkoutDeliveryFee === 0 || user.is_premium_member ? 'text-primary font-medium' : 'text-on-surface'}>
                    {checkoutDeliveryFee === 0 || user.is_premium_member ? 'FREE' : formatPrice(checkoutDeliveryFee)}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Discount</span>
            <span className={checkoutDiscount > 0 ? 'text-error font-medium' : 'text-on-surface'}>
              {checkoutDiscount > 0 ? `-${formatPrice(checkoutDiscount)}` : formatPrice(0)}
            </span>
          </div>
          <div className="my-3" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-on-surface">Total Amount</span>
            <span className="text-xl font-black text-primary">{formatPrice(checkoutTotal)}</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 z-40 mx-auto max-w-md">
        <div className="glass px-4 pt-3 pb-3">
          <button
            type="button"
            onClick={handlePay}
            className="w-full py-4 gradient-primary text-white rounded-xl text-base font-bold shadow-ambient"
          >
            Pay Now &middot; {formatPrice(checkoutTotal)}
          </button>
        </div>
      </div>
    </div>
  );
}
