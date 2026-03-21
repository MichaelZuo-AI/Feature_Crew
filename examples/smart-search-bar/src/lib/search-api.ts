// ---------------------------------------------------------------------------
// Smart Search API Client
// ---------------------------------------------------------------------------

import type {
  SmartSearchRequest,
  SmartSearchResponse,
  SuggestionsResponse,
} from "@/lib/types";

export class RateLimitError extends Error {
  constructor(message = "Too many requests. Please try again later.") {
    super(message);
    this.name = "RateLimitError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 429) {
    throw new RateLimitError();
  }
  if (!res.ok) {
    throw new Error(`Search API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * POST /api/v2/search/smart
 */
export async function smartSearch(
  params: SmartSearchRequest,
  signal?: AbortSignal,
): Promise<SmartSearchResponse> {
  const res = await fetch("/api/v2/search/smart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal,
  });
  return handleResponse<SmartSearchResponse>(res);
}

/**
 * GET /api/v2/search/suggestions
 */
export async function fetchSuggestions(
  query: string,
  locale = "en-US",
  limit = 8,
  signal?: AbortSignal,
): Promise<SuggestionsResponse> {
  const url = new URL("/api/v2/search/suggestions", window.location.origin);
  url.searchParams.set("q", query);
  url.searchParams.set("locale", locale);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), { signal });
  return handleResponse<SuggestionsResponse>(res);
}
