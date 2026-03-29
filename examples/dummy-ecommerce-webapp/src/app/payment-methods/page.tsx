'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/context/ToastContext';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { paymentMethods as initialMethods, type PaymentMethod } from '@/data/mock-data';
import { formatPrice } from '@/lib/format';

// ---------------------------------------------------------------------------
// Radio circle
// ---------------------------------------------------------------------------
function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        selected ? 'border-primary' : 'border-outline'
      }`}
    >
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment method card
// ---------------------------------------------------------------------------
function PaymentCard({
  method,
  onSetDefault,
  onDelete,
}: {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex gap-3 shadow-ambient">
      {/* Radio */}
      <button
        type="button"
        onClick={() => onSetDefault(method.id)}
        className="mt-0.5 active:opacity-70 transition-opacity"
        aria-label={`Set ${method.label} as default`}
      >
        <RadioCircle selected={method.isDefault} />
      </button>

      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary text-xl">{method.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Brand row + default badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-on-surface">{method.brand}</span>
          {method.isDefault && (
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>

        {/* Card number / balance */}
        {method.type === 'card' && method.lastFour && (
          <p className="text-sm text-on-surface-variant mt-0.5">
            •••• •••• •••• {method.lastFour}
          </p>
        )}
        {method.type === 'card' && method.expiry && (
          <p className="text-xs text-on-surface-variant mt-0.5">Expires {method.expiry}</p>
        )}
        {method.type === 'wallet' && method.balance !== undefined && (
          <p className="text-sm text-on-surface-variant mt-0.5">
            Balance: {formatPrice(method.balance)}
          </p>
        )}
        {method.type === 'wallet' && method.balance === undefined && (
          <p className="text-sm text-on-surface-variant mt-0.5">Linked account</p>
        )}

        {/* Delete action */}
        <div className="flex items-center justify-end mt-2">
          <button
            type="button"
            onClick={() => onDelete(method.id)}
            className="text-error text-sm active:opacity-70 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card form inputs
// ---------------------------------------------------------------------------
interface CardFormData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  name: string;
  isDefault: boolean;
}

const EMPTY_CARD: CardFormData = {
  cardNumber: '',
  expiry: '',
  cvv: '',
  name: '',
  isDefault: false,
};

function CardFormField({
  label,
  value,
  onChange,
  placeholder,
  type,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <p className="text-xs text-on-surface-variant mb-1">{label}</p>
      <input
        type={type ?? 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="bg-surface-container-low rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm text-on-surface placeholder:text-on-surface-variant/50"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add card bottom sheet
// ---------------------------------------------------------------------------
function AddCardSheet({
  onAdd,
  onClose,
}: {
  onAdd: (data: CardFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CardFormData>(EMPTY_CARD);

  function set(field: keyof CardFormData) {
    return (v: string) => setForm((prev) => ({ ...prev, [field]: v }));
  }

  const isValid =
    form.cardNumber.replace(/\s/g, '').length >= 13 &&
    form.expiry.length === 5 &&
    form.cvv.length >= 3 &&
    form.name.trim().length > 0;

  // Auto-format card number with spaces
  function handleCardNumber(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    set('cardNumber')(formatted);
  }

  // Auto-format expiry MM/YY
  function handleExpiry(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    set('expiry')(formatted);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 mx-auto max-w-md bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-on-surface-variant/20" />
        </div>

        <div className="px-4 pb-8 pt-2 flex flex-col gap-4">
          <h2 className="text-base font-bold text-on-surface">Add New Card</h2>

          <CardFormField
            label="Card Number"
            value={form.cardNumber}
            onChange={handleCardNumber}
            placeholder="0000 0000 0000 0000"
            type="tel"
            maxLength={19}
          />

          <div className="grid grid-cols-2 gap-3">
            <CardFormField
              label="Expiry Date"
              value={form.expiry}
              onChange={handleExpiry}
              placeholder="MM/YY"
              type="tel"
              maxLength={5}
            />
            <CardFormField
              label="CVV"
              value={form.cvv}
              onChange={set('cvv')}
              placeholder="•••"
              type="tel"
              maxLength={4}
            />
          </div>

          <CardFormField
            label="Cardholder Name"
            value={form.name}
            onChange={set('name')}
            placeholder="Name as on card"
          />

          {/* Set as default checkbox */}
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
            className="flex items-center gap-3 active:opacity-70 transition-opacity"
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                form.isDefault ? 'bg-primary border-primary' : 'border-outline'
              }`}
            >
              {form.isDefault && (
                <span className="material-symbols-outlined text-white text-sm leading-none">
                  check
                </span>
              )}
            </div>
            <span className="text-sm text-on-surface">Set as default payment method</span>
          </button>

          {/* Add Card CTA */}
          <button
            type="button"
            disabled={!isValid}
            onClick={() => onAdd(form)}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity ${
              isValid
                ? 'gradient-primary text-white active:opacity-80'
                : 'bg-on-surface-variant/20 text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-8 gap-4">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">
        credit_card
      </span>
      <p className="text-base font-semibold text-on-surface text-center">No payment methods</p>
      <p className="text-sm text-on-surface-variant text-center">
        Add a card to speed up checkout.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 gradient-primary text-white px-6 py-3 rounded-xl font-semibold text-sm active:opacity-80 transition-opacity"
      >
        Add Payment Method
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PaymentMethodsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();

  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [showAddSheet, setShowAddSheet] = useState(false);

  function setDefault(id: string) {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
    const method = methods.find((m) => m.id === id);
    if (method) showToast(`${method.brand} set as default`);
  }

  function removeMethod(id: string) {
    const method = methods.find((m) => m.id === id);
    if (method?.isDefault) {
      showToast('Cannot delete the default payment method');
      return;
    }
    setMethods((prev) => prev.filter((m) => m.id !== id));
    showToast('Payment method removed');
  }

  function handleAddCard(data: CardFormData) {
    // Detect brand from card number prefix
    const digits = data.cardNumber.replace(/\s/g, '');
    let brand = 'Card';
    let icon = 'credit_card';
    if (digits.startsWith('4')) { brand = 'Visa'; icon = 'credit_card'; }
    else if (digits.startsWith('5') || digits.startsWith('2')) { brand = 'Mastercard'; icon = 'credit_card'; }
    else if (digits.startsWith('3')) { brand = 'Amex'; icon = 'credit_card'; }

    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: 'card',
      brand,
      label: brand,
      lastFour: digits.slice(-4),
      expiry: data.expiry,
      isDefault: data.isDefault,
      icon,
    };

    setMethods((prev) => {
      const updated = data.isDefault
        ? prev.map((m) => ({ ...m, isDefault: false }))
        : prev;
      return [...updated, newMethod];
    });

    showToast(`${brand} card ending in ${newMethod.lastFour} added`);
    setShowAddSheet(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-28">
      {/* Top bar */}
      <header className="glass fixed top-0 left-0 right-0 z-50 mx-auto max-w-md h-16">
        <div className="flex items-center h-full px-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>

          <h1 className="flex-1 text-base font-bold text-on-surface text-center">
            Payment Methods
          </h1>

          {/* Spacer to keep title centred */}
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="pt-20 px-4">
        {methods.length === 0 ? (
          <EmptyState onAdd={() => setShowAddSheet(true)} />
        ) : (
          <div className="flex flex-col gap-3 py-4">
            {methods.map((method) => (
              <PaymentCard
                key={method.id}
                method={method}
                onSetDefault={setDefault}
                onDelete={removeMethod}
              />
            ))}

            {/* Add payment method button */}
            <button
              type="button"
              onClick={() => setShowAddSheet(true)}
              className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm active:opacity-80 transition-opacity mt-2 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Add Payment Method
            </button>
          </div>
        )}
      </div>

      {/* Add card bottom sheet */}
      {showAddSheet && (
        <AddCardSheet
          onAdd={handleAddCard}
          onClose={() => setShowAddSheet(false)}
        />
      )}

      <BottomNavBar />
    </div>
  );
}
