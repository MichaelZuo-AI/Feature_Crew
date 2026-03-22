'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useToastContext } from '@/context/ToastContext';
import BottomNavBar from '@/components/layout/BottomNavBar';
import type { SavedAddress } from '@/types';

// ---------------------------------------------------------------------------
// Form data shape
// ---------------------------------------------------------------------------
interface FormData {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  postal_code: string;
  city: string;
  isDefault: boolean;
}

const EMPTY_FORM: FormData = {
  name: '',
  phone: '',
  line1: '',
  line2: '',
  postal_code: '',
  city: '',
  isDefault: false,
};

// ---------------------------------------------------------------------------
// Radio button component
// ---------------------------------------------------------------------------
function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
        selected ? 'border-primary' : 'border-outline'
      }`}
    >
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Address Card
// ---------------------------------------------------------------------------
function AddressCard({
  address,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: SavedAddress;
  onSelect: (id: string) => void;
  onEdit: (address: SavedAddress) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex gap-3 shadow-ambient">
      {/* Radio button */}
      <button
        type="button"
        onClick={() => onSelect(address.id)}
        className="mt-0.5 active:opacity-70 transition-opacity"
        aria-label={`Select ${address.name} as default address`}
      >
        <RadioCircle selected={address.isDefault} />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name row + default badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-on-surface">{address.name}</span>
          {address.isDefault && (
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>

        {/* Phone */}
        <p className="text-sm text-on-surface-variant mt-0.5">{address.phone}</p>

        {/* Full address */}
        <p className="text-sm text-on-surface-variant mt-1 leading-snug">
          {[address.line1, address.line2, address.city, address.postal_code]
            .filter(Boolean)
            .join(', ')}
        </p>

        {/* Edit / Delete links */}
        <div className="flex items-center justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="text-primary text-sm active:opacity-70 transition-opacity"
          >
            Edit
          </button>
          <span className="text-on-surface-variant/30 text-sm select-none">|</span>
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            className="text-primary text-sm active:opacity-70 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form field
// ---------------------------------------------------------------------------
function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <p className="text-xs text-on-surface-variant mb-1">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-surface-container-low rounded-lg px-3 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm text-on-surface placeholder:text-on-surface-variant/50"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add / Edit bottom sheet
// ---------------------------------------------------------------------------
function AddressFormSheet({
  editingAddress,
  onSave,
  onClose,
}: {
  editingAddress: SavedAddress | null;
  onSave: (data: FormData) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<FormData>(() =>
    editingAddress
      ? {
          name: editingAddress.name,
          phone: editingAddress.phone,
          line1: editingAddress.line1,
          line2: editingAddress.line2 ?? '',
          postal_code: editingAddress.postal_code,
          city: editingAddress.city,
          isDefault: editingAddress.isDefault,
        }
      : EMPTY_FORM
  );

  const isValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.line1.trim() &&
    formData.city.trim();

  function set(field: keyof FormData) {
    return (v: string) => setFormData((prev) => ({ ...prev, [field]: v }));
  }

  return (
    /* Glass backdrop */
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Sheet card */}
      <div
        className="absolute bottom-0 left-0 right-0 mx-auto max-w-md bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-on-surface-variant/20" />
        </div>

        <div className="px-4 pb-8 pt-2 flex flex-col gap-4">
          {/* Title */}
          <h2 className="text-base font-bold text-on-surface">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>

          {/* Fields */}
          <FormField
            label="Recipient Name"
            value={formData.name}
            onChange={set('name')}
            placeholder="Full name"
          />
          <FormField
            label="Phone"
            value={formData.phone}
            onChange={set('phone')}
            placeholder="010-0000-0000"
            type="tel"
          />
          <FormField
            label="Address Line 1"
            value={formData.line1}
            onChange={set('line1')}
            placeholder="Street address"
          />
          <FormField
            label="Address Line 2"
            value={formData.line2}
            onChange={set('line2')}
            placeholder="Apt, suite, floor (optional)"
          />
          <FormField
            label="Postal Code"
            value={formData.postal_code}
            onChange={set('postal_code')}
            placeholder="00000"
          />
          <FormField
            label="City"
            value={formData.city}
            onChange={set('city')}
            placeholder="City / District"
          />

          {/* Map placeholder */}
          <div>
            <p className="text-xs text-on-surface-variant mb-1">Location</p>
            <div className="bg-surface-container-low rounded-lg h-40 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">
                location_on
              </span>
              <p className="text-xs text-on-surface-variant">Map integration coming soon</p>
            </div>
          </div>

          {/* Set as default checkbox row */}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, isDefault: !prev.isDefault }))
            }
            className="flex items-center gap-3 active:opacity-70 transition-opacity"
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                formData.isDefault ? 'bg-primary border-primary' : 'border-outline'
              }`}
            >
              {formData.isDefault && (
                <span className="material-symbols-outlined text-white text-sm leading-none">
                  check
                </span>
              )}
            </div>
            <span className="text-sm text-on-surface">Set as default address</span>
          </button>

          {/* Save CTA */}
          <button
            type="button"
            disabled={!isValid}
            onClick={() => onSave(formData)}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity ${
              isValid
                ? 'bg-gradient-to-r from-[#0050cb] to-[#3b82f6] text-white active:opacity-80'
                : 'bg-on-surface-variant/20 text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Delete confirm bottom sheet
// ---------------------------------------------------------------------------
function DeleteConfirmSheet({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end"
      onClick={onCancel}
    >
      <div
        className="w-full mx-auto max-w-md bg-white rounded-t-2xl px-4 pt-6 pb-8 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center -mt-3 mb-1">
          <div className="w-10 h-1 rounded-full bg-on-surface-variant/20" />
        </div>

        <h2 className="text-base font-bold text-on-surface text-center">Remove this address?</h2>
        <p className="text-sm text-on-surface-variant text-center">
          This address will be permanently removed.
        </p>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-outline text-on-surface text-sm font-semibold active:opacity-70 transition-opacity"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-error text-white text-sm font-semibold active:opacity-70 transition-opacity"
          >
            Remove
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
        location_on
      </span>
      <p className="text-base font-semibold text-on-surface text-center">No saved addresses</p>
      <p className="text-sm text-on-surface-variant text-center">
        Add an address to speed up checkout.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 bg-gradient-to-r from-[#0050cb] to-[#3b82f6] text-white px-6 py-3 rounded-xl font-semibold text-sm active:opacity-80 transition-opacity"
      >
        Add New Address
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AddressesPage() {
  const router = useRouter();
  const { savedAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useUser();
  const { showToast } = useToastContext();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Derive the address being edited
  const editingAddress = editingId
    ? (savedAddresses.find((a) => a.id === editingId) ?? null)
    : null;

  function openAddForm() {
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(address: SavedAddress) {
    setEditingId(address.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleSave(data: FormData) {
    if (editingId) {
      updateAddress(editingId, {
        name: data.name,
        phone: data.phone,
        line1: data.line1,
        line2: data.line2 || undefined,
        postal_code: data.postal_code,
        city: data.city,
        isDefault: data.isDefault,
      });
      showToast('Address updated');
    } else {
      addAddress({
        name: data.name,
        phone: data.phone,
        line1: data.line1,
        line2: data.line2 || undefined,
        postal_code: data.postal_code,
        city: data.city,
        isDefault: data.isDefault,
      });
      showToast('Address added');
    }
    closeForm();
  }

  function handleDeleteRequest(id: string) {
    const address = savedAddresses.find((a) => a.id === id);
    if (address?.isDefault) {
      showToast('Cannot delete default address');
      return;
    }
    setShowDeleteConfirm(id);
  }

  function confirmDelete() {
    if (showDeleteConfirm) {
      deleteAddress(showDeleteConfirm);
      showToast('Address removed');
    }
    setShowDeleteConfirm(null);
  }

  function handleSelect(id: string) {
    setDefaultAddress(id);
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-28">
      {/* Custom top bar */}
      <header className="glass fixed top-0 left-0 right-0 z-50 mx-auto max-w-md h-16">
        <div className="flex items-center h-full px-4">
          {/* Back arrow */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>

          {/* Center title */}
          <h1 className="flex-1 text-base font-bold text-on-surface text-center">My Addresses</h1>

          {/* Add New button */}
          <button
            type="button"
            onClick={openAddForm}
            className="text-primary font-semibold text-sm active:opacity-70 transition-opacity"
          >
            Add New
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pt-20 px-4">
        {savedAddresses.length === 0 ? (
          <EmptyState onAdd={openAddForm} />
        ) : (
          <div className="flex flex-col gap-3 py-4">
            {savedAddresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onSelect={handleSelect}
                onEdit={openEditForm}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit bottom sheet */}
      {showForm && (
        <AddressFormSheet
          editingAddress={editingAddress}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {/* Delete confirm bottom sheet */}
      {showDeleteConfirm && (
        <DeleteConfirmSheet
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}

      <BottomNavBar />
    </div>
  );
}
