'use client';

import { Suggestion, SuggestionType } from '@/lib/types';
import { ClockIcon, FireIcon, ArrowLeftIcon, CloseIcon } from '@/components/icons';
import SuggestionItem from './SuggestionItem';

interface SuggestionsDropdownProps {
  suggestions: Suggestion[];
  trending: string[];
  recentSearches: string[];
  query: string;
  activeSuggestionIndex: number;
  isLoading: boolean;
  isVisible: boolean;
  isMobileOverlay: boolean;
  onSelect: (text: string) => void;
  onClose: () => void;
  onRemoveRecent: (query: string) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#888]">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[#333] my-1" />;
}

export default function SuggestionsDropdown({
  suggestions,
  trending,
  recentSearches,
  query,
  activeSuggestionIndex,
  isLoading,
  isVisible,
  isMobileOverlay,
  onSelect,
  onClose,
  onRemoveRecent,
}: SuggestionsDropdownProps) {
  const querySuggestions = suggestions.filter(
    (s) => s.type === SuggestionType.QUERY
  );
  const productSuggestions = suggestions
    .filter((s) => s.type === SuggestionType.PRODUCT)
    .slice(0, 3);
  const categorySuggestions = suggestions.filter(
    (s) => s.type === SuggestionType.CATEGORY
  );

  // Build a flat list of all items for sequential ID assignment
  let itemIndex = 0;

  const hasQuery = query.trim().length > 0;

  const emptyStateContent = (
    <>
      {recentSearches.length > 0 && (
        <div>
          <SectionTitle>Recent Searches</SectionTitle>
          {recentSearches.map((recent) => {
            const currentIndex = itemIndex++;
            return (
              <div
                key={recent}
                id={`suggestion-${currentIndex}`}
                role="option"
                aria-selected={activeSuggestionIndex === currentIndex}
                className={`px-5 py-[10px] flex items-center gap-3 cursor-pointer transition-colors duration-150 hover:bg-[#242424] ${
                  activeSuggestionIndex === currentIndex ? 'bg-[#242424]' : ''
                }`}
                onClick={() => onSelect(recent)}
              >
                <ClockIcon className="w-5 h-5 text-[#888] shrink-0" />
                <span className="text-sm text-white flex-1 truncate">
                  {recent}
                </span>
                <button
                  type="button"
                  className="p-1 text-[#888] hover:text-white transition-colors shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecent(recent);
                  }}
                  aria-label={`Remove ${recent} from recent searches`}
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {trending.length > 0 && (
        <>
          {recentSearches.length > 0 && <Divider />}
          <div>
            <SectionTitle>Trending</SectionTitle>
            {trending.map((term) => {
              const currentIndex = itemIndex++;
              return (
                <div
                  key={term}
                  id={`suggestion-${currentIndex}`}
                  role="option"
                  aria-selected={activeSuggestionIndex === currentIndex}
                  className={`px-5 py-[10px] flex items-center gap-3 cursor-pointer transition-colors duration-150 hover:bg-[#242424] ${
                    activeSuggestionIndex === currentIndex ? 'bg-[#242424]' : ''
                  }`}
                  onClick={() => onSelect(term)}
                >
                  <FireIcon className="w-5 h-5 text-[#888] shrink-0" />
                  <span className="text-sm text-white flex-1 truncate">
                    {term}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );

  const queryStateContent = (
    <>
      {querySuggestions.length > 0 && (
        <div>
          <SectionTitle>Suggestions</SectionTitle>
          {querySuggestions.map((suggestion) => {
            const currentIndex = itemIndex++;
            return (
              <SuggestionItem
                key={`query-${suggestion.text}`}
                id={`suggestion-${currentIndex}`}
                suggestion={suggestion}
                isActive={activeSuggestionIndex === currentIndex}
                onClick={() => onSelect(suggestion.text)}
              />
            );
          })}
        </div>
      )}
      {productSuggestions.length > 0 && (
        <>
          {querySuggestions.length > 0 && <Divider />}
          <div>
            <SectionTitle>Products</SectionTitle>
            {productSuggestions.map((suggestion) => {
              const currentIndex = itemIndex++;
              return (
                <SuggestionItem
                  key={`product-${suggestion.productId ?? suggestion.text}`}
                  id={`suggestion-${currentIndex}`}
                  suggestion={suggestion}
                  isActive={activeSuggestionIndex === currentIndex}
                  onClick={() => onSelect(suggestion.text)}
                />
              );
            })}
          </div>
        </>
      )}
      {categorySuggestions.length > 0 && (
        <>
          {(querySuggestions.length > 0 || productSuggestions.length > 0) && (
            <Divider />
          )}
          <div>
            <SectionTitle>Categories</SectionTitle>
            {categorySuggestions.map((suggestion) => {
              const currentIndex = itemIndex++;
              return (
                <SuggestionItem
                  key={`category-${suggestion.categoryId ?? suggestion.text}`}
                  id={`suggestion-${currentIndex}`}
                  suggestion={suggestion}
                  isActive={activeSuggestionIndex === currentIndex}
                  onClick={() => onSelect(suggestion.text)}
                />
              );
            })}
          </div>
        </>
      )}
      {trending.length > 0 && (
        <>
          {(querySuggestions.length > 0 || productSuggestions.length > 0 || categorySuggestions.length > 0) && (
            <Divider />
          )}
          <div>
            <SectionTitle>Trending</SectionTitle>
            {trending.map((term) => {
              const currentIndex = itemIndex++;
              return (
                <div
                  key={term}
                  id={`suggestion-${currentIndex}`}
                  role="option"
                  aria-selected={activeSuggestionIndex === currentIndex}
                  className={`px-5 py-[10px] flex items-center gap-3 cursor-pointer transition-colors duration-150 hover:bg-[#242424] ${
                    activeSuggestionIndex === currentIndex ? 'bg-[#242424]' : ''
                  }`}
                  onClick={() => onSelect(term)}
                >
                  <FireIcon className="w-5 h-5 text-[#888] shrink-0" />
                  <span className="text-sm text-white flex-1 truncate">
                    {term}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );

  if (isMobileOverlay) {
    return (
      <div
        data-visible={isVisible ? 'true' : 'false'}
        className={`fixed inset-0 z-50 bg-[#1A1A1A] flex flex-col
          data-[visible=true]:animate-[slideUp_150ms_ease-out_forwards]
          data-[visible=false]:opacity-0 data-[visible=false]:-translate-y-2`}
        style={{
          animation: isVisible
            ? 'slideUp 200ms ease-out forwards'
            : undefined,
        }}
      >
        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <div className="flex items-center px-4 py-3 border-b border-[#333]">
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white hover:text-[#888] transition-colors"
            aria-label="Close search"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        </div>
        <div
          role="listbox"
          aria-label="Search suggestions"
          id="suggestions-listbox"
          className="flex-1 overflow-y-auto"
        >
          {hasQuery ? queryStateContent : emptyStateContent}
        </div>
      </div>
    );
  }

  return (
    <div
      data-visible={isVisible ? 'true' : 'false'}
      className="absolute top-full left-0 right-0 z-40 bg-[#1A1A1A] border border-[#333] rounded-[12px] shadow-[0_16px_48px_rgba(0,0,0,0.4)] max-h-[400px] overflow-y-auto"
      style={{
        animation: isVisible
          ? 'dropdownEnter 150ms ease-out forwards'
          : undefined,
        opacity: isVisible ? undefined : 0,
        transform: isVisible ? undefined : 'translateY(-8px)',
      }}
    >
      <style jsx>{`
        @keyframes dropdownEnter {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div role="listbox" aria-label="Search suggestions" id="suggestions-listbox">
        {hasQuery ? queryStateContent : emptyStateContent}
      </div>
    </div>
  );
}
