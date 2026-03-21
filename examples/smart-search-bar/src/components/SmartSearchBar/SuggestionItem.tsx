'use client';

import Image from 'next/image';
import { Suggestion, SuggestionType } from '@/lib/types';
import { SearchIcon, FolderIcon } from '@/components/icons';

interface SuggestionItemProps {
  suggestion: Suggestion;
  isActive: boolean;
  onClick: () => void;
  id: string;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;

  return (
    <>
      <span className="font-bold">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  );
}

function formatPrice(text: string): string | null {
  // Extract price-like pattern from suggestion text if productId exists
  return null;
}

export default function SuggestionItem({
  suggestion,
  isActive,
  onClick,
  id,
}: SuggestionItemProps) {
  const baseClasses =
    'px-5 py-[10px] flex items-center gap-3 cursor-pointer transition-colors duration-150';
  const activeClasses = isActive ? 'bg-[#242424]' : '';
  const hoverClasses = 'hover:bg-[#242424]';

  if (suggestion.type === SuggestionType.QUERY) {
    return (
      <div
        id={id}
        role="option"
        aria-selected={isActive}
        className={`${baseClasses} ${activeClasses} ${hoverClasses}`}
        onClick={onClick}
      >
        <SearchIcon className="w-5 h-5 text-[#888] shrink-0" />
        <span className="text-sm text-white flex-1 truncate">
          {highlightMatch(suggestion.text, suggestion.text)}
        </span>
        {suggestion.resultCount != null && (
          <span className="text-[11px] text-[#888] bg-[#242424] px-2 py-0.5 rounded shrink-0">
            {suggestion.resultCount.toLocaleString()} results
          </span>
        )}
      </div>
    );
  }

  if (suggestion.type === SuggestionType.PRODUCT) {
    return (
      <div
        id={id}
        role="option"
        aria-selected={isActive}
        className={`${baseClasses} ${activeClasses} ${hoverClasses}`}
        onClick={onClick}
      >
        {suggestion.thumbnail ? (
          <Image
            src={suggestion.thumbnail}
            alt={suggestion.text}
            width={40}
            height={40}
            className="rounded-[6px] bg-[#242424] object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-[6px] bg-[#242424] shrink-0" />
        )}
        <span className="text-sm text-white flex-1 truncate">
          {suggestion.text}
        </span>
        <span className="text-[11px] text-[#888] bg-[#242424] px-2 py-0.5 rounded shrink-0">
          Product
        </span>
      </div>
    );
  }

  // CATEGORY
  return (
    <div
      id={id}
      role="option"
      aria-selected={isActive}
      className={`${baseClasses} ${activeClasses} ${hoverClasses}`}
      onClick={onClick}
    >
      <FolderIcon className="w-5 h-5 text-[#888] shrink-0" />
      <span className="text-sm text-white flex-1 truncate">
        {suggestion.text}
      </span>
      <span className="text-[11px] text-[#888] bg-[#242424] px-2 py-0.5 rounded shrink-0">
        Category
      </span>
    </div>
  );
}
