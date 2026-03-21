/**
 * @jest-environment node
 */
/**
 * QA Edge Case Tests for POST /api/v2/search/smart
 *
 * Tests for special characters, long queries, HTML/SQL injection, and rate limiting edge cases.
 */
import { POST } from '@/app/api/v2/search/smart/route';
import { NextRequest } from 'next/server';
import type { SmartSearchResponse } from '@/lib/types';

// ---------------------------------------------------------------------------
// Mock rate-limiter
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
  const data = (await res.json()) as SmartSearchResponse & { error?: string };
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

describe('POST /api/v2/search/smart - Edge Cases', () => {
  beforeEach(() => {
    mockCheckRateLimit.mockReturnValue({ allowed: true });
  });

  it('handles very long query (> 500 chars) without crashing', async () => {
    const longQuery = 'a'.repeat(600);
    const { res } = await fetchResponse({
      ...baseBody,
      query: longQuery,
    });

    // Should not crash — returns 200 with empty or some results
    expect(res.status).toBe(200);
  });

  it('handles HTML injection attempt in query', async () => {
    const { res, data } = await fetchResponse({
      ...baseBody,
      query: '<script>alert("xss")</script>',
    });

    expect(res.status).toBe(200);
    // The response should not contain unescaped HTML
    const responseStr = JSON.stringify(data);
    expect(responseStr).not.toContain('<script>');
  });

  it('handles SQL injection attempt in query', async () => {
    const { res } = await fetchResponse({
      ...baseBody,
      query: "'; DROP TABLE products; --",
    });

    expect(res.status).toBe(200);
    // Should return successfully (no real DB to drop, but no crash)
  });

  it('handles special characters in query', async () => {
    const { res } = await fetchResponse({
      ...baseBody,
      query: 'shoes 👟 @#$%^&*()',
    });

    expect(res.status).toBe(200);
  });

  it('handles empty string query', async () => {
    const { res, data } = await fetchResponse({
      ...baseBody,
      query: '',
    });

    expect(res.status).toBe(200);
    expect(data.results).toBeDefined();
    expect(Array.isArray(data.results)).toBe(true);
  });

  it('handles query with only whitespace', async () => {
    const { res, data } = await fetchResponse({
      ...baseBody,
      query: '   ',
    });

    expect(res.status).toBe(200);
    expect(data.results).toBeDefined();
  });

  it('handles unicode/multilingual query', async () => {
    const { res } = await fetchResponse({
      ...baseBody,
      query: '运动鞋 나이키',
    });

    expect(res.status).toBe(200);
  });

  it('rate limit returns 429 with Retry-After header', async () => {
    mockCheckRateLimit.mockReturnValue({ allowed: false, retryAfter: 45 });

    const req = createRequest({ ...baseBody, query: 'shoes' });
    const res = await POST(req);

    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('45');

    const data = await res.json();
    expect(data.error).toBe('Too many requests');
  });

  it('handles negative page number gracefully', async () => {
    const { res } = await fetchResponse({
      ...baseBody,
      query: 'shoes',
      page: -1,
    });

    // Should not crash
    expect(res.status).toBe(200);
  });

  it('handles zero pageSize gracefully', async () => {
    const { res, data } = await fetchResponse({
      ...baseBody,
      query: 'shoes',
      pageSize: 0,
    });

    expect(res.status).toBe(200);
    expect(data.results).toEqual([]);
  });
});
