'use client';

export default function FAB() {
  return (
    <button
      type="button"
      className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full text-white shadow-ambient flex items-center justify-center active:scale-90 transition-transform glass"
      style={{ background: 'linear-gradient(135deg, rgba(0, 80, 203, 0.85), rgba(0, 102, 255, 0.85))' }}
      aria-label="AI Assistant"
    >
      <span
        className="material-symbols-outlined text-2xl"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        auto_awesome
      </span>
    </button>
  );
}
