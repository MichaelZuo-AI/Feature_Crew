'use client';

const tabs = [
  { label: 'Home', isGoldBox: false },
  { label: 'Rocket Fresh', isGoldBox: false },
  { label: 'Best', isGoldBox: false },
  { label: 'Gold Box', isGoldBox: true },
  { label: 'Rocket Delivery', isGoldBox: false },
];

interface CategoryTabsProps {
  activeIndex: number;
  onTabChange: (index: number) => void;
}

export default function CategoryTabs({ activeIndex, onTabChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-40 glass">
      <div className="flex items-center gap-6 px-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          let textColor: string;
          if (tab.isGoldBox) {
            textColor = 'text-secondary';
          } else if (isActive) {
            textColor = 'text-primary';
          } else {
            textColor = 'text-on-surface-variant hover:text-primary';
          }

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onTabChange(index)}
              className={`flex-shrink-0 py-3 text-sm transition-colors ${textColor} ${
                isActive ? 'font-bold border-b-2 border-primary' : 'font-semibold'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
