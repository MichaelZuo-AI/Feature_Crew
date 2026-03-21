/**
 * @jest-environment node
 */
import { POST } from '@/app/api/v2/search/smart/route';
import { NextRequest } from 'next/server';
import type { SmartSearchResponse } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock rate-limiter so tests are not affected by rate limiting
// ---------------------------------------------------------------------------

jest.mock('@/lib/rate-limiter', () => ({
  checkRateLimit: jest.fn(() => ({ allowed: true })),
}));

import { checkRateLimit } from '@/lib/rate-limiter';
const mockCheckRateLimit = checkRateLimit as jest.MockedFunction<
  typeof checkRateLimit
>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/v2/search/smart', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

async function fetchResponse(body: object) {
  const req = createRequest(body);
  const res = await POST(req);
  const data = (await res.json()) as SmartSearchResponse;
  return { res, data };
}

const baseBody = {
  query: '',
  locale: 'en-US',
  page: 1,
  pageSize: 20,
  sessionId: 'test-session',
  filters: { priceMin: null, priceMax: null, categories: [], attributes: {} },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/v2/search/smart', () => {
  beforeEach(() => {
    mockCheckRateLimit.mockReturnValue({ allowed: true });
  });

  it('returns results matching a query', async () => {
    const { res, data } = await fetchResponse({
      ...baseBody,
      query: 'nike',
    });

    expect(res.status).toBe(200);
    expect(data.results.length).toBeGreaterThan(0);
    // All results should be related to "nike"
    for (const result of data.results) {
      const haystack = result.title.toLowerCase();
      expect(haystack).toContain('nike');
    }
  });

  it('parses "under $50" price filter from query', async () => {
    const { data } = await fetchResponse({
      ...baseBody,
      query: 'shoes under $50',
    });

    expect(data.parsedFilters.priceMax).toBe(50);
    // All returned products should be at most $50
    for (const result of data.results) {
      expect(result.price.current).toBeLessThanOrEqual(50);
    }
  });

  it('parses "over $100" price filter from query', async () => {
    const { data } = await fetchResponse({
      ...baseBody,
      query: 'shoes over $100',
    });

    expect(data.parsedFilters.priceMin).toBe(100);
    for (const result of data.results) {
      expect(result.price.current).toBeGreaterThanOrEqual(100);
    }
  });

  it('applies explicit filters', async () => {
    const { data } = await fetchResponse({
      ...baseBody,
      query: 'shoes',
      filters: {
        priceMin: null,
        priceMax: 80,
        categories: [],
        attributes: {},
      },
    });

    for (const result of data.results) {
      expect(result.price.current).toBeLessThanOrEqual(80);
    }
  });

  it('returns parsedFilters and suggestedChips', async () => {
    const { data } = await fetchResponse({
      ...baseBody,
      query: 'black shoes under $100',
    });

    expect(data.parsedFilters).toBeDefined();
    expect(data.suggestedChips).toBeDefined();
    expect(Array.isArray(data.suggestedChips)).toBe(true);

    // Should have a priceMax chip
    const priceChip = data.suggestedChips.find((c) => c.key === 'priceMax');
    expect(priceChip).toBeDefined();
    expect(priceChip!.value).toBe(100);
  });

  it('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockReturnValue({ allowed: false, retryAfter: 30 });

    const req = createRequest({ ...baseBody, query: 'shoes' });
    const res = await POST(req);

    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('30');
  });

  it('returns spell correction for typos', async () => {
    const { data } = await fetchResponse({
      ...baseBody,
      query: 'runing sheos',
    });

    expect(data.spellCorrection).not.toBeNull();
    expect(data.spellCorrection!.original).toBe('runing sheos');
    expect(data.spellCorrection!.corrected).toBe('running shoes');
  });

  it('returns null spellCorrection when no typos', async () => {
    const { data } = await fetchResponse({
      ...baseBody,
      query: 'running shoes',
    });

    expect(data.spellCorrection).toBeNull();
  });

  it('returns totalCount reflecting all matched results', async () => {
    const { data } = await fetchResponse({
      ...baseBody,
      query: 'shoes',
      pageSize: 2,
    });

    // totalCount should be >= number of results returned (since pageSize limits results)
    expect(data.totalCount).toBeGreaterThanOrEqual(data.results.length);
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/v2/search/smart', {
      method: 'POST',
      body: 'not-valid-json{{{',
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('detects color in query and adds it to parsedFilters', async () => {
    const { data } = await fetchResponse({
      ...baseBody,
      query: 'black shoes',
    });

    expect(data.parsedFilters.color).toBe('black');
  });
});
