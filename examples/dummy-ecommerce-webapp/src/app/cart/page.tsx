'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    totalItems,
    selectedItems,
    subtotal,
    deliveryFee,
    discount,
    toggleSelected,
    toggleSelectAll,
    removeSelected,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { user } = useUser();

  const allSelected = items.length > 0 && items.every((item) => item.selected);
  const selectedCount = selectedItems.length;

  const rocketItems = items.filter((item) => item.product.rocket_delivery);
  const standardItems = items.filter((item) => !item.product.rocket_delivery);

  const freeDeliveryThreshold = 19800;
  const rocketSubtotal = selectedItems
    .filter((item) => item.product.rocket_delivery)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - rocketSubtotal);
  const showPromoBanner = rocketSubtotal > 0 && amountToFreeDelivery > 0;
  const effectiveDeliveryFee = user.is_rocket_member ? 0 : deliveryFee;
  const effectiveTotal = subtotal + effectiveDeliveryFee - discount;

  return (
    <div className="pb-40 pt-16">
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
          <h1 className="flex-1 text-center text-base font-bold text-on-surface truncate">
            Shopping Cart ({totalItems})
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Select All Row */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={toggleSelectAll}
          className="flex items-center gap-2"
        >
          <span
            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
              allSelected ? 'gradient-primary' : 'bg-surface-container-low'
            }`}
          >
            {allSelected && (
              <span className="material-symbols-outlined text-white text-sm">check</span>
            )}
          </span>
          <span className="text-sm text-on-surface">
            Select All ({selectedCount}/{items.length})
          </span>
        </button>
        <button
          type="button"
          onClick={removeSelected}
          className="text-sm text-error font-medium"
        >
          Delete Selected
        </button>
      </div>

      {/* WOW Membership Banner */}
      {user.is_rocket_member && (
        <div className="mx-4 mb-4 bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded italic">WOW</span>
                <p className="text-xs font-bold text-on-surface">Rocket Wow Membership Applied</p>
              </div>
              <p className="text-[11px] text-primary font-medium mt-0.5">Enjoy unlimited free shipping on all orders!</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-primary/40">verified</span>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
            shopping_cart
          </span>
          <p className="mt-4 text-on-surface-variant text-sm">Your cart is empty</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2.5 gradient-primary text-white rounded-full text-sm font-semibold"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Rocket Delivery Group */}
      {rocketItems.length > 0 && (
        <div className="mx-4 mb-4">
          <div className="bg-surface-container-low rounded-t-lg px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">rocket_launch</span>
            <span className="text-sm font-semibold text-on-surface">Rocket Delivery</span>
          </div>
          <div className="space-y-0">
            {rocketItems.map((item) => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onToggleSelect={() => toggleSelected(item.product.id)}
                onRemove={() => removeFromCart(item.product.id)}
                onUpdateQty={(qty) => updateQuantity(item.product.id, qty)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Standard Delivery Group */}
      {standardItems.length > 0 && (
        <div className="mx-4 mb-4">
          <div className="bg-surface-container-low rounded-t-lg px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">inventory_2</span>
            <span className="text-sm font-semibold text-on-surface">Standard Delivery</span>
          </div>
          <div className="space-y-0">
            {standardItems.map((item) => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onToggleSelect={() => toggleSelected(item.product.id)}
                onRemove={() => removeFromCart(item.product.id)}
                onUpdateQty={(qty) => updateQuantity(item.product.id, qty)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Promotion Banner */}
      {showPromoBanner && (
        <div className="mx-4 mb-4 bg-primary/5 rounded-lg px-4 py-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">local_offer</span>
          <span className="text-sm text-primary font-medium">
            Add {formatPrice(amountToFreeDelivery)} more for free Rocket Delivery
          </span>
        </div>
      )}

      {/* Order Summary */}
      {items.length > 0 && (
        <div className="bg-surface-container-low rounded-xl p-4 mx-4 mb-4">
          <h2 className="text-sm font-bold text-on-surface mb-3">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="text-on-surface">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                Delivery Fee
                {user.is_rocket_member && deliveryFee > 0 && (
                  <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded italic">WOW</span>
                )}
              </span>
              {user.is_rocket_member && deliveryFee > 0 ? (
                <span className="flex items-center gap-1.5">
                  <span className="text-on-surface-variant line-through text-xs">{formatPrice(deliveryFee)}</span>
                  <span className="text-primary font-medium">FREE</span>
                </span>
              ) : (
                <span className={deliveryFee === 0 ? 'text-primary font-medium' : 'text-on-surface'}>
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Discounts</span>
              <span className="text-on-surface">
                {discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0)}
              </span>
            </div>
            <div className="my-3" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-on-surface">Total</span>
              <span className="text-xl font-black text-primary">{formatPrice(effectiveTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom CTA */}
      {items.length > 0 && selectedItems.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 mx-auto max-w-md">
          <div className="glass px-4 pt-3 pb-3">
            <button
              type="button"
              onClick={() => router.push('/checkout')}
              className="w-full py-4 gradient-primary text-white rounded-xl text-base font-bold shadow-ambient"
            >
              Proceed to Checkout &rarr; {formatPrice(effectiveTotal)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CartItemCard({
  item,
  onToggleSelect,
  onRemove,
  onUpdateQty,
}: {
  item: { product: import('@/types').Product; quantity: number; selected: boolean };
  onToggleSelect: () => void;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}) {
  return (
    <div className="bg-surface-container-lowest p-4 relative">
      <div className="flex gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggleSelect}
          className="flex-shrink-0 mt-1"
        >
          <span
            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
              item.selected ? 'gradient-primary' : 'bg-surface-container-low'
            }`}
          >
            {item.selected && (
              <span className="material-symbols-outlined text-white text-sm">check</span>
            )}
          </span>
        </button>

        {/* Product Image */}
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-on-surface-variant">{item.product.brand}</p>
          <p className="text-sm text-on-surface line-clamp-2 mt-0.5">{item.product.name}</p>
          <p className="text-primary font-bold mt-1">{formatPrice(item.product.price)}</p>

          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => onUpdateQty(item.quantity - 1)}
              className="ghost-border w-8 h-8 rounded-lg flex items-center justify-center active:bg-black/5 transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">remove</span>
            </button>
            <span className="text-sm font-medium text-on-surface w-6 text-center">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQty(item.quantity + 1)}
              className="ghost-border w-8 h-8 rounded-lg flex items-center justify-center active:bg-black/5 transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">add</span>
            </button>
          </div>
        </div>

        {/* Delete X */}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full active:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-lg">close</span>
        </button>
      </div>
    </div>
  );
}
