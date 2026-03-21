'use client';

import { useState, useCallback } from 'react';
import type { FilterChip } from '@/lib/types';

interface ChipProps {
  chip: FilterChip;
  onRemove: (key: string) => void;
  isNew?: boolean;
}

export default function Chip({ chip, onRemove, isNew = false }: ChipProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = useCallback(() => {
    setRemoving(true);
    setTimeout(() => {
      onRemove(chip.key);
    }, 150);
  }, [chip.key, onRemove]);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 bg-[#2D2B55] text-[#A5B4FC]
        px-3 py-1.5 rounded-[20px] text-[13px] font-medium whitespace-nowrap
        transition-all
        ${isNew && !removing ? 'animate-chip-enter' : ''}
        ${removing ? 'animate-chip-exit' : ''}
      `}
      style={
        removing
          ? {
              transform: 'scale(0.8)',
              opacity: 0,
              maxWidth: 0,
              paddingLeft: 0,
              paddingRight: 0,
              marginRight: 0,
              overflow: 'hidden',
              transition: 'all 150ms ease-in',
            }
          : isNew
            ? {
                animation:
                  'chip-enter 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              }
            : undefined
      }
    >
      {chip.label}
      <span
        role="button"
        aria-label={`Remove filter: ${chip.label}`}
        onClick={handleRemove}
        className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center text-[10px] cursor-pointer"
      >
        &times;
      </span>

      {/* Inline keyframes for enter animation */}
      <style jsx>{`
        @keyframes chip-enter {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
