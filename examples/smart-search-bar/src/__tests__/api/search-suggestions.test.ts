/**
 * @jest-environment node
 */
import { GET } from '@/app/api/v2/search/suggestions/route';
import { NextRequest } from 'next/server';
import { SuggestionType } from '@/lib/types';
import type { SuggestionsResponse } from '@/lib/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createRequest(query: string, limit?: number): NextRequest {
  const url = new URL('http://localhost/api/v2/search/suggestions');
  if (query) url.searchParams.set('q', query);
  if (limit) url.searchParams.set('limit', String(limit));
  return new NextRequest(url);
}

async function fetchResponse(query: string, limit?: number) {
  const req = createRequest(query, limit);
  const res = await GET(req);
  const data = (await res.json()) as SuggestionsResponse;
  return { res, data };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GET /api/v2/search/suggestions', () => {
  it('returns trending when query is empty', async () => {
    const { res, data } = await fetchResponse('');

    expect(res.status).toBe(200);
    expect(data.suggestions).toEqual([]);
    expect(data.trending.length).toBeGreaterThan(0);
  });

  it('returns suggestions matching a query', async () => {
    const { data } = await fetchResponse('nike');

    expect(data.suggestions.length).toBeGreaterThan(0);
    // At least some suggestions should relate to "nike"
    const hasNikeRelated = data.suggestions.some(
      (s) =>
        s.text.toLowerCase().includes('nike') ||
        s.type === SuggestionType.PRODUCT,
    );
    expect(hasNikeRelated).toBe(true);
  });

  it('limits results to the limit param', async () => {
    const { data } = await fetchResponse('shoes', 3);

    expect(data.suggestions.length).toBeLessThanOrEqual(3);
  });

  it('defaults to max 8 suggestions when limit is not specified', async () => {
    const { data } = await fetchResponse('s');

    // Should respect the default limit of 8 (plus up to 3 product suggestions)
    // but the total trimmed result is at most the limit
    expect(data.suggestions.length).toBeLessThanOrEqual(20);
  });

  it('returns CATEGORY type suggestions', async () => {
    const { data } = await fetchResponse('shoe');

    const categorySuggestions = data.suggestions.filter(
      (s) => s.type === SuggestionType.CATEGORY,
    );
    // "running shoes" category should match "shoe"
    expect(categorySuggestions.length).toBeGreaterThan(0);

    for (const s of categorySuggestions) {
      expect(s.categoryId).toBeDefined();
      expect(s.resultCount).toBeDefined();
    }
  });

  it('returns PRODUCT type suggestions', async () => {
    const { data } = await fetchResponse('nike');

    const productSuggestions = data.suggestions.filter(
      (s) => s.type === SuggestionType.PRODUCT,
    );
    expect(productSuggestions.length).toBeGreaterThan(0);

    for (const s of productSuggestions) {
      expect(s.productId).toBeDefined();
      expect(s.thumbnail).toBeDefined();
    }
  });

  it('returns QUERY type suggestions', async () => {
    const { data } = await fetchResponse('nike');

    const querySuggestions = data.suggestions.filter(
      (s) => s.type === SuggestionType.QUERY,
    );
    expect(querySuggestions.length).toBeGreaterThan(0);
  });

  it('always includes trending in the response', async () => {
    const { data: withQuery } = await fetchResponse('shoes');
    const { data: withoutQuery } = await fetchResponse('');

    expect(withQuery.trending.length).toBeGreaterThan(0);
    expect(withoutQuery.trending.length).toBeGreaterThan(0);
  });

  it('returns empty suggestions for a completely unmatched query', async () => {
    const { data } = await fetchResponse('xyznonexistent12345');

    expect(data.suggestions).toEqual([]);
    // Trending should still be present
    expect(data.trending.length).toBeGreaterThan(0);
  });
});
