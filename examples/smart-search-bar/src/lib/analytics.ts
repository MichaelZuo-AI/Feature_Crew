// ---------------------------------------------------------------------------
// Analytics Event Helpers (demo implementation)
// ---------------------------------------------------------------------------

import type { AnalyticsEventName } from "@/lib/types";

/**
 * Track a generic analytics event.
 * In production this would forward to a real analytics provider.
 */
export function trackEvent(
  event: AnalyticsEventName,
  data?: Record<string, unknown>,
): void {
  // eslint-disable-next-line no-console
  console.log(`[analytics] ${event}`, data ?? {});
}

// ---- Convenience helpers ---------------------------------------------------

export function trackSearchInitiated(query: string, filterCount: number): void {
  trackEvent("search_initiated", { query, filterCount });
}

export function trackSuggestionClicked(
  suggestion: string,
  index: number,
): void {
  trackEvent("suggestion_clicked", { suggestion, index });
}

export function trackChipAdded(key: string, value: string | number): void {
  trackEvent("chip_added", { key, value });
}

export function trackChipRemoved(key: string): void {
  trackEvent("chip_removed", { key });
}

export function trackResultClicked(
  productId: string,
  position: number,
): void {
  trackEvent("result_clicked", { productId, position });
}

export function trackSearchAbandoned(query: string): void {
  trackEvent("search_abandoned", { query });
}
