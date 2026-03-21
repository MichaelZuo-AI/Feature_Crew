"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "smart-search-recent";
const MAX_ENTRIES = 10;

export interface UseRecentSearches {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(entries: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota exceeded or storage unavailable — silently ignore.
  }
}

export function useRecentSearches(): UseRecentSearches {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Hydrate from localStorage after mount (SSR safe)
  useEffect(() => {
    setRecentSearches(readFromStorage());
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const trimmed = query.trim();
      if (!trimmed) return prev;
      // Remove duplicate if present, then prepend
      const next = [trimmed, ...prev.filter((q) => q !== trimmed)].slice(
        0,
        MAX_ENTRIES,
      );
      writeToStorage(next);
      return next;
    });
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((q) => q !== query);
      writeToStorage(next);
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    writeToStorage([]);
  }, []);

  return { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches };
}
