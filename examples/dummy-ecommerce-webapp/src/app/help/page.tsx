'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { faqSections, contactOptions } from '@/data/help-data';
import type { FAQSection, FAQQuestion } from '@/data/help-data';

// ---------------------------------------------------------------------------
// FAQ Question row (inner accordion)
// ---------------------------------------------------------------------------
function QuestionItem({ question }: { question: FAQQuestion }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-outline-variant/20 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-on-surface leading-snug flex-1">
          {question.q}
        </span>
        <span
          className="material-symbols-outlined text-on-surface-variant shrink-0 text-xl transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="pb-3 pr-8">
          <p className="text-sm text-on-surface-variant leading-relaxed">{question.a}</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ Section card (outer accordion)
// ---------------------------------------------------------------------------
function SectionCard({
  section,
  defaultOpen,
}: {
  section: FAQSection;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-ambient">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-black/5 transition-colors"
        aria-expanded={open}
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-xl">{section.icon}</span>
        </div>
        <span className="flex-1 text-base font-semibold text-on-surface">{section.title}</span>
        <span
          className="material-symbols-outlined text-on-surface-variant text-xl transition-transform duration-200 shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {/* Questions */}
      {open && (
        <div className="px-4 pb-2 border-t border-outline-variant/20">
          {section.questions.map((q) => (
            <QuestionItem key={q.q} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections/questions by search query
  const query = searchQuery.trim().toLowerCase();

  const filteredSections = faqSections
    .map((section) => {
      if (!query) return section;
      const matchingQuestions = section.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(query) ||
          q.a.toLowerCase().includes(query) ||
          section.title.toLowerCase().includes(query),
      );
      return { ...section, questions: matchingQuestions };
    })
    .filter((section) => section.questions.length > 0);

  return (
    <div className="min-h-screen bg-surface pb-12">
      {/* Top App Bar */}
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
          <h1 className="flex-1 text-center text-base font-bold text-on-surface">Help Center</h1>
          {/* Spacer to balance back button */}
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="pt-20 px-4 max-w-md mx-auto">
        {/* Search bar */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">
            search
          </span>
          <input
            type="search"
            placeholder="Search for help…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-ambient"
          />
        </div>

        {/* FAQ sections */}
        <section className="mb-8">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 px-1">
            Frequently Asked Questions
          </h2>

          {filteredSections.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredSections.map((section, i) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  defaultOpen={query.length > 0 || i === 0}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                search_off
              </span>
              <p className="text-sm text-on-surface-variant text-center">
                No results for &ldquo;{searchQuery}&rdquo;
                <br />
                Try different keywords or contact us below.
              </p>
            </div>
          )}
        </section>

        {/* Contact section */}
        <section className="mb-8">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 px-1">
            Contact Us
          </h2>
          <div className="flex flex-col gap-3">
            {contactOptions.map((opt) => (
              <div
                key={opt.icon}
                className="bg-white rounded-2xl px-4 py-4 flex items-center gap-4 shadow-ambient"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{opt.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant font-medium">{opt.label}</p>
                  <p className="text-sm font-semibold text-on-surface truncate">{opt.value}</p>
                </div>
                <span className="text-xs text-on-surface-variant ghost-border rounded-full px-2 py-1 whitespace-nowrap">
                  {opt.note}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Live Chat CTA */}
        <Link
          href="/live-chat"
          className="gradient-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-base shadow-ambient active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-xl">chat</span>
          Start Live Chat
        </Link>
      </div>
    </div>
  );
}
