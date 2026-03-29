'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TopAppBar from '@/components/layout/TopAppBar';
import { useUser } from '@/context/UserContext';
import { useToastContext } from '@/context/ToastContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TimeSlot {
  id: string;
  label: string;
  hours: string;
  unavailable?: boolean;
}

const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning', label: 'Morning', hours: '9AM – 12PM' },
  { id: 'afternoon', label: 'Afternoon', hours: '12PM – 3PM' },
  { id: 'evening', label: 'Evening', hours: '3PM – 6PM', unavailable: true },
  { id: 'night', label: 'Night', hours: '6PM – 9PM' },
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getNext7Days(): Array<{ date: Date; dayName: string; dateNum: number; month: string }> {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      date: d,
      dayName: i === 0 ? 'Today' : DAY_NAMES[d.getDay()],
      dateNum: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
    };
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DeliverySchedulePage() {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToastContext();

  const days = useMemo(() => getNext7Days(), []);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [expressEnabled, setExpressEnabled] = useState(false);
  const [instructions, setInstructions] = useState('');

  const canConfirm = selectedSlot !== null;

  function handleConfirm() {
    if (!canConfirm) return;
    showToast('Delivery scheduled successfully!');
    router.back();
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-36 pt-16">
      <TopAppBar title="Schedule Delivery" showBack />

      <div className="px-4 pt-4 space-y-4">

        {/* ------------------------------------------------------------------ */}
        {/* Shipping address card                                               */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-xl p-4 shadow-ambient">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-lg">location_on</span>
            <span className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">
              Shipping Address
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-on-surface">{user.address.recipient}</span>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Default
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">{user.address.line1}</p>
            {user.address.line2 && (
              <p className="text-sm text-on-surface-variant">{user.address.line2}</p>
            )}
            <p className="text-sm text-on-surface-variant">
              {user.address.city} {user.address.postal_code}
            </p>
            <p className="text-sm text-on-surface-variant">{user.address.phone}</p>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Date picker                                                         */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-xl p-4 shadow-ambient">
          <p className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase mb-3">
            Delivery Date
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {days.map((day, index) => {
              const selected = selectedDayIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedDayIndex(index)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-[60px] h-[72px] rounded-xl transition-all ${
                    selected
                      ? 'gradient-primary text-white shadow-ambient'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container active:bg-surface-container'
                  }`}
                >
                  <span className={`text-[10px] font-semibold mb-0.5 ${selected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                    {day.dayName}
                  </span>
                  <span className={`text-xl font-black leading-none ${selected ? 'text-white' : 'text-on-surface'}`}>
                    {day.dateNum}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${selected ? 'text-white/70' : 'text-on-surface-variant/70'}`}>
                    {day.month}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Time slot grid                                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-xl p-4 shadow-ambient">
          <p className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase mb-3">
            Delivery Time
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TIME_SLOTS.map((slot) => {
              const selected = selectedSlot === slot.id;
              if (slot.unavailable) {
                return (
                  <div
                    key={slot.id}
                    className="flex flex-col items-center justify-center rounded-xl p-3 bg-surface-container-low/50 opacity-50 cursor-not-allowed h-[80px]"
                  >
                    <span className="text-sm font-semibold text-on-surface-variant">{slot.label}</span>
                    <span className="text-xs text-on-surface-variant/70 mt-0.5">{slot.hours}</span>
                    <span className="text-[10px] font-semibold text-on-surface-variant/50 mt-1 bg-on-surface-variant/10 px-2 py-0.5 rounded-full">
                      Unavailable
                    </span>
                  </div>
                );
              }
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 h-[80px] transition-all ${
                    selected
                      ? 'gradient-primary text-white shadow-ambient'
                      : 'bg-surface-container-low text-on-surface active:bg-surface-container'
                  }`}
                >
                  <span className={`text-sm font-bold ${selected ? 'text-white' : 'text-on-surface'}`}>
                    {slot.label}
                  </span>
                  <span className={`text-xs mt-0.5 ${selected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                    {slot.hours}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Express delivery toggle                                             */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-xl p-4 shadow-ambient">
          <div className="flex items-center gap-3">
            {/* Rocket badge */}
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 shadow-ambient">
              <span className="material-symbols-outlined text-white text-base">rocket_launch</span>
            </div>

            {/* Label + price */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface">Express Delivery</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Arrives within 2 hours</p>
            </div>

            {/* Price */}
            <span className="text-sm font-semibold text-primary flex-shrink-0 mr-2">+₩3,000</span>

            {/* Custom toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={expressEnabled}
              onClick={() => setExpressEnabled((v) => !v)}
              className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                expressEnabled ? 'gradient-primary' : 'bg-surface-container'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  expressEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Special instructions                                               */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-xl p-4 shadow-ambient">
          <p className="text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase mb-3">
            Special Instructions
          </p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Leave at front door, ring bell twice…"
            rows={3}
            className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Sticky bottom CTA                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md">
        <div className="glass px-4 pt-3 pb-6">
          <button
            type="button"
            disabled={!canConfirm}
            onClick={handleConfirm}
            className={`w-full py-4 rounded-xl text-base font-bold transition-opacity ${
              canConfirm
                ? 'gradient-primary text-white shadow-ambient active:opacity-90'
                : 'bg-on-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed'
            }`}
          >
            Confirm Delivery Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
