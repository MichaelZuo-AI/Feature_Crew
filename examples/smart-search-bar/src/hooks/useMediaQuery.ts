"use client";

import { useCallback, useEffect, useState } from "react";

export const MOBILE_BREAKPOINT = "(max-width: 768px)";
export const SMALL_MOBILE_BREAKPOINT = "(max-width: 480px)";

/**
 * Returns `true` when the given CSS media query matches.
 * SSR-safe — returns `false` on the server.
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState<boolean>(getMatches);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Sync initial value (handles hydration mismatch)
    setMatches(mql.matches);

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
