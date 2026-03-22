'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const BENEFITS = [
  { icon: 'rocket_launch', title: 'Rocket Delivery', desc: 'Order tonight, arrives tomorrow', color: 'text-primary' },
  { icon: 'assignment_return', title: '30-Day Returns', desc: 'Hassle-free returns on all items', color: 'text-primary' },
  { icon: 'eco', title: 'Rocket Fresh', desc: 'Fresh groceries at your door', color: 'text-green-600' },
  { icon: 'movie', title: 'Wow Video', desc: 'Stream movies & shows free', color: 'text-purple-600' },
];

const COMPARISON = [
  { feature: 'Shipping Fee', regular: '₩3,000', wow: 'Free' },
  { feature: 'Delivery Speed', regular: '2-3 Days', wow: '1 Day' },
  { feature: 'Streaming', regular: '-', wow: 'Included' },
];

export default function MembershipPage() {
  const { user, activateMembership } = useUser();
  const router = useRouter();

  const handleActivate = () => {
    activateMembership();
    router.back();
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md shadow-sm shadow-primary/5">
        <div className="max-w-md mx-auto flex items-center h-14 px-4">
          <button onClick={() => router.back()} className="mr-3 p-1">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="text-xl font-extrabold text-primary">Membership Benefits</h1>
        </div>
      </header>

      <main className="pt-16 pb-32 max-w-md mx-auto">
        {/* Hero Section */}
        <section className="bg-surface-container-low px-6 pt-10 pb-16 relative overflow-hidden">
          <span className="inline-block bg-secondary text-white text-[10px] font-bold rounded-full px-3 py-1 uppercase mb-4">
            Rocket Wow Exclusive
          </span>

          <h2 className="text-4xl font-extrabold text-on-surface leading-tight mb-4">
            Experience the{' '}
            <span className="text-primary italic">Future</span>{' '}
            of Shopping
          </h2>

          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            Unlimited Free Rocket Delivery & Exclusive Member Prices on millions of items.
          </p>

          {/* Savings Card */}
          <div className="bg-white/90 backdrop-blur-xl p-5 rounded-xl shadow relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Potential Monthly Savings</p>
                <p className="text-primary text-2xl font-bold">₩12,500</p>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl">savings</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-primary rounded-full" />
            </div>
          </div>

          {/* Decorative blurred circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-container/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-secondary-container/10 blur-3xl" />
        </section>

        {/* Benefits Grid */}
        <section className="px-6 py-12">
          <div className="grid grid-cols-2 gap-4">
            {/* Full-width card */}
            <div className="col-span-2 bg-surface-container-low rounded-2xl p-5">
              <span className="material-symbols-outlined text-primary text-3xl mb-3 block">local_shipping</span>
              <h3 className="font-bold text-on-surface mb-1">Free Shipping</h3>
              <p className="text-sm text-on-surface-variant">Zero minimum purchase required. Every order ships free, every time.</p>
            </div>

            {/* 2x2 grid */}
            {BENEFITS.map((b) => (
              <div key={b.icon} className="bg-surface-container-low rounded-2xl p-4">
                <span className={`material-symbols-outlined ${b.color} text-2xl mb-2 block`}>{b.icon}</span>
                <h3 className="font-bold text-on-surface text-sm mb-1">{b.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-6 py-10 bg-surface-container-low rounded-t-3xl">
          <h3 className="text-lg font-extrabold text-on-surface text-center mb-6">Regular vs. Wow</h3>
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 text-xs font-bold text-on-surface-variant px-4 py-3 border-b border-outline-variant/20">
              <span />
              <span className="text-center">Regular</span>
              <span className="text-center text-primary">Wow</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 text-sm px-4 py-3 ${i < COMPARISON.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
              >
                <span className="text-on-surface font-medium">{row.feature}</span>
                <span className="text-center text-outline">{row.regular}</span>
                <span className="text-center text-primary font-bold">{row.wow}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="px-6 py-12">
          <div className="space-y-4">
            {/* Annual */}
            <div className="relative border-2 border-primary rounded-2xl p-5">
              <span className="absolute -top-3 left-5 bg-primary text-white text-[10px] font-bold rounded-full px-3 py-1 uppercase">
                Best Value
              </span>
              <div className="flex items-end justify-between mt-1">
                <div>
                  <p className="text-on-surface font-bold text-lg">Annual Plan</p>
                  <p className="text-on-surface-variant text-sm">Billed once a year</p>
                </div>
                <div className="text-right">
                  <p className="text-primary text-2xl font-extrabold">₩49,900<span className="text-sm font-normal text-on-surface-variant">/year</span></p>
                  <p className="text-green-600 text-xs font-bold">Save 20%</p>
                </div>
              </div>
            </div>

            {/* Monthly */}
            <div className="bg-surface-container-low rounded-2xl p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-on-surface font-bold text-lg">Monthly Plan</p>
                  <p className="text-on-surface-variant text-sm">Cancel anytime</p>
                </div>
                <div className="text-right">
                  <p className="text-on-surface text-2xl font-extrabold">₩4,990<span className="text-sm font-normal text-on-surface-variant">/month</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-outline-variant/20 px-6 py-4">
        <div className="max-w-md mx-auto">
          {!user.is_rocket_member ? (
            <button
              onClick={handleActivate}
              className="w-full bg-gradient-to-r from-primary to-[#0050cb] text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
            >
              Start 30-Day Free Trial
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-surface-container-high text-on-surface-variant font-bold text-base py-4 rounded-2xl"
            >
              You&apos;re a Wow Member ✓
            </button>
          )}
          <p className="text-center text-xs text-on-surface-variant mt-2">
            Cancel anytime. No commitment required.
          </p>
        </div>
      </div>
    </div>
  );
}
