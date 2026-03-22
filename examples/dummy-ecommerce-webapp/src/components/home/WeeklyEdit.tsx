import Image from 'next/image';
import { weeklyEdit } from '@/data/mock-data';

const ctaLabels = ['Explore Collection', 'Shop Now'];

export default function WeeklyEdit() {
  return (
    <section className="bg-surface-container-low py-8">
      <div className="px-4 mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          Curated for You
        </p>
        <h2 className="text-2xl font-black tracking-tighter italic text-on-surface mt-1">
          The Weekly Edit.
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
        {weeklyEdit.map((item, index) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-72 bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden group">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="288px"
              />

              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-on-surface/80 text-white text-[9px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-bold text-on-surface leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                {item.subtitle}
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary">
                {ctaLabels[index] ?? 'Shop Now'}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
