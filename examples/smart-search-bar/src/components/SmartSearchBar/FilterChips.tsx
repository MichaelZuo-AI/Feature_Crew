'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { FilterChip } from '@/lib/types';
import Chip from './Chip';

interface FilterChipsProps {
  chips: FilterChip[];
  onRemoveChip: (key: string) => void;
  isSmallMobile: boolean;
}

export default function FilterChips({
  chips,
  onRemoveChip,
  isSmallMobile,
}: FilterChipsProps) {
  const prevKeysRef = useRef<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set());

  // Track new chips by comparing current keys with previous keys.
  useEffect(() => {
    const currentKeys = new Set(chips.map((c) => c.key));
    const added = new Set<string>();

    for (const key of currentKeys) {
      if (!prevKeysRef.current.has(key)) {
        added.add(key);
      }
    }

    if (added.size > 0) {
      setNewKeys(added);
      // Clear "new" status after animation completes.
      const timer = setTimeout(() => setNewKeys(new Set()), 250);
      return () => clearTimeout(timer);
    }

    prevKeysRef.current = currentKeys;
  }, [chips]);

  // Update prevKeysRef after newKeys are cleared.
  useEffect(() => {
    if (newKeys.size === 0) {
      prevKeysRef.current = new Set(chips.map((c) => c.key));
    }
  }, [newKeys, chips]);

  // Check scroll position for fade indicators.
  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 0);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    if (!isSmallMobile) return;
    const el = scrollRef.current;
    if (!el) return;

    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);

    return () => {
      el.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
    };
  }, [isSmallMobile, updateFades, chips]);

  if (chips.length === 0) return null;

  const chipElements = chips.map((chip) => (
    <Chip
      key={chip.key}
      chip={chip}
      onRemove={onRemoveChip}
      isNew={newKeys.has(chip.key)}
    />
  ));

  if (!isSmallMobile) {
    return <div className="flex flex-wrap gap-2 my-3">{chipElements}</div>;
  }

  return (
    <div className="relative my-3">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto flex-nowrap"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {chipElements}
      </div>

      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#0E0E0E] to-transparent pointer-events-none" />
      )}
      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#0E0E0E] to-transparent pointer-events-none" />
      )}
    </div>
  );
}
