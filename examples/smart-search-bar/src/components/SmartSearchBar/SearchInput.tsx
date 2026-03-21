'use client';

import React, { useEffect } from 'react';
import { SearchIcon, CameraIcon, MicrophoneIcon, CloseIcon } from '../icons';

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onFocus: () => void;
  onSubmit: (query: string) => void;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isMobile: boolean;
  ariaExpanded?: boolean;
  ariaActiveDescendant?: string;
  ariaControls?: string;
}

export default function SearchInput({
  query,
  onQueryChange,
  onFocus,
  onSubmit,
  onClear,
  onKeyDown,
  inputRef,
  isMobile,
  ariaExpanded,
  ariaActiveDescendant,
  ariaControls,
}: SearchInputProps) {
  // Global "/" shortcut to focus the search input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== '/') return;

      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (
        tagName === 'input' ||
        tagName === 'textarea' ||
        target.isContentEditable
      ) {
        return;
      }

      e.preventDefault();
      inputRef.current?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputRef]);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <div className="h-[52px] bg-[#242424] border-2 border-[#333] rounded-[12px] flex items-center gap-3 px-5 focus-within:border-[#6366F1] transition-colors">
        <SearchIcon className="text-[#888] flex-shrink-0" />

        <input
          ref={inputRef as React.Ref<HTMLInputElement>}
          type="text"
          role="combobox"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder="Search for anything..."
          className="bg-transparent border-none outline-none text-[#E8E8E8] text-[16px] font-medium flex-1 placeholder-[#555] font-[Inter,sans-serif] min-w-0"
          aria-expanded={ariaExpanded}
          aria-activedescendant={ariaActiveDescendant}
          aria-autocomplete="list"
          aria-controls={ariaControls}
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-[#888] cursor-pointer flex-shrink-0 hover:text-[#aaa] transition-colors"
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        )}

        <button
          type="button"
          disabled
          className="opacity-50 cursor-not-allowed flex-shrink-0 text-[#888]"
          aria-label="Camera search"
        >
          <CameraIcon />
        </button>

        {isMobile && (
          <button
            type="button"
            disabled
            className="bg-[#6366F1] rounded-[8px] w-9 h-9 flex items-center justify-center text-white opacity-50 cursor-not-allowed flex-shrink-0"
            aria-label="Voice search"
          >
            <MicrophoneIcon />
          </button>
        )}
      </div>
    </form>
  );
}
