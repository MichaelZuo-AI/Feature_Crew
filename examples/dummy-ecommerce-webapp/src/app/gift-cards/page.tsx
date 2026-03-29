'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/context/ToastContext';
import { formatPrice } from '@/lib/format';
import BottomNavBar from '@/components/layout/BottomNavBar';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type CardDesign = 'birthday' | 'thankyou' | 'congratulations';

type TransactionType = 'received' | 'redeemed' | 'purchased';

interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  date: string;
  amount: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PRESET_AMOUNTS = [10000, 30000, 50000, 100000];

const CARD_DESIGNS: {
  id: CardDesign;
  label: string;
  emoji: string;
  gradient: string;
}[] = [
  {
    id: 'birthday',
    label: 'Birthday',
    emoji: '🎂',
    gradient: 'from-pink-400 to-purple-500',
  },
  {
    id: 'thankyou',
    label: 'Thank You',
    emoji: '💐',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'congratulations',
    label: 'Congratulations',
    emoji: '🎉',
    gradient: 'from-blue-400 to-cyan-500',
  },
];

const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    type: 'received',
    description: 'Gift card received from friend',
    date: 'Mar 25, 2026',
    amount: 50000,
  },
  {
    id: 'tx2',
    type: 'redeemed',
    description: 'Applied to order #ORD-4821',
    date: 'Mar 18, 2026',
    amount: -30000,
  },
  {
    id: 'tx3',
    type: 'purchased',
    description: 'Gift card sent to kim@example.com',
    date: 'Mar 10, 2026',
    amount: -50000,
  },
  {
    id: 'tx4',
    type: 'received',
    description: 'Birthday gift card',
    date: 'Feb 28, 2026',
    amount: 25000,
  },
];

// ---------------------------------------------------------------------------
// Transaction icon helpers
// ---------------------------------------------------------------------------
function transactionIcon(type: TransactionType): string {
  switch (type) {
    case 'received':
      return 'arrow_downward';
    case 'redeemed':
      return 'arrow_upward';
    case 'purchased':
      return 'card_giftcard';
  }
}

function transactionIconColor(type: TransactionType): string {
  switch (type) {
    case 'received':
      return 'text-green-600 bg-green-50';
    case 'redeemed':
      return 'text-blue-600 bg-blue-50';
    case 'purchased':
      return 'text-amber-600 bg-amber-50';
  }
}

function transactionAmountColor(type: TransactionType): string {
  return type === 'received' ? 'text-green-600' : 'text-on-surface';
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function GiftCardsPage() {
  const router = useRouter();
  const { showToast } = useToastContext();

  // Balance section
  const [balance] = useState(12500);

  // Redeem section
  const [redeemCode, setRedeemCode] = useState('');

  // Purchase section
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [selectedDesign, setSelectedDesign] = useState<CardDesign>('birthday');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleApplyCode() {
    const cleaned = redeemCode.replace(/\s/g, '');
    if (cleaned.length !== 16) {
      showToast('Please enter a valid 16-digit code');
      return;
    }
    showToast('Gift card applied successfully!');
    setRedeemCode('');
  }

  function handleSend() {
    if (!recipientEmail.trim()) {
      showToast("Please enter the recipient's email");
      return;
    }
    showToast(`Gift card of ${formatPrice(selectedAmount)} sent!`);
    setRecipientEmail('');
    setMessage('');
  }

  // Format code input with spaces every 4 chars
  function handleCodeInput(v: string) {
    const digits = v.replace(/[^A-Za-z0-9]/g, '').slice(0, 16).toUpperCase();
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setRedeemCode(formatted);
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
          <h1 className="flex-1 text-base font-bold text-on-surface text-center">Gift Cards</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="pt-20 px-4 flex flex-col gap-5">
        {/* ------------------------------------------------------------------ */}
        {/* Balance Card                                                         */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex justify-center">
          <div className="w-full bg-white rounded-2xl shadow-ambient px-6 py-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">card_giftcard</span>
              <span className="text-sm font-medium">Gift Card Balance</span>
            </div>
            <p className="text-4xl font-extrabold text-on-surface">{formatPrice(balance)}</p>
            <button
              type="button"
              className="gradient-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm active:opacity-80 transition-opacity flex items-center gap-2"
              onClick={() => showToast('Add gift card tapped')}
            >
              <span className="material-symbols-outlined text-lg">add_card</span>
              Add Gift Card
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Redeem Section                                                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-on-surface">Redeem a Code</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => handleCodeInput(e.target.value)}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19}
              className="flex-1 bg-white rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ghost-border font-mono tracking-widest"
            />
            <button
              type="button"
              onClick={handleApplyCode}
              className="gradient-primary text-white px-5 py-3 rounded-xl font-semibold text-sm active:opacity-80 transition-opacity shrink-0"
            >
              Apply
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Purchase Section                                                     */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl shadow-ambient p-5 flex flex-col gap-5">
          <h2 className="text-sm font-bold text-on-surface">Send a Gift Card</h2>

          {/* Preset amounts 2x2 */}
          <div>
            <p className="text-xs text-on-surface-variant mb-3">Select Amount</p>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_AMOUNTS.map((amount) => {
                const isSelected = selectedAmount === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                      isSelected
                        ? 'gradient-primary text-white shadow-ambient'
                        : 'bg-surface-container-low text-on-surface'
                    }`}
                  >
                    {formatPrice(amount)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card design selector */}
          <div>
            <p className="text-xs text-on-surface-variant mb-3">Card Design</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {CARD_DESIGNS.map((design) => {
                const isSelected = selectedDesign === design.id;
                return (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => setSelectedDesign(design.id)}
                    className={`shrink-0 flex flex-col items-center gap-2 transition-all active:opacity-80 ${
                      isSelected ? 'scale-105' : ''
                    }`}
                  >
                    <div
                      className={`w-24 h-14 rounded-xl bg-gradient-to-br ${design.gradient} flex items-center justify-center text-2xl shadow-sm ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      {design.emoji}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {design.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient form */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-on-surface-variant mb-1.5">Recipient Email</p>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="friend@example.com"
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-1.5">Personal Message (optional)</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a heartfelt message..."
                rows={3}
                maxLength={200}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            className="w-full gradient-primary text-white py-4 rounded-xl font-bold text-sm active:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            Send {formatPrice(selectedAmount)} Gift Card
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Transaction History                                                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex flex-col gap-3 pb-4">
          <h2 className="text-sm font-bold text-on-surface px-1">Transaction History</h2>
          <div className="bg-white rounded-2xl shadow-ambient overflow-hidden divide-y divide-on-surface-variant/10">
            {TRANSACTIONS.map((tx) => {
              const iconBg = transactionIconColor(tx.type);
              const amountColor = transactionAmountColor(tx.type);
              const amountPrefix = tx.amount > 0 ? '+' : '';
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {transactionIcon(tx.type)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{tx.description}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{tx.date}</p>
                  </div>

                  {/* Amount */}
                  <span className={`text-sm font-bold shrink-0 ${amountColor}`}>
                    {amountPrefix}{formatPrice(Math.abs(tx.amount))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
