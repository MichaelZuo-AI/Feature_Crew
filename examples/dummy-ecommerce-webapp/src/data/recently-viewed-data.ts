import type { RecentView } from '@/types';

export const mockRecentlyViewed: RecentView[] = [
  // Today
  { productId: 'p001', viewedAt: '2026-03-22T08:45:00.000Z' },
  { productId: 'p003', viewedAt: '2026-03-22T06:30:00.000Z' },
  // Yesterday
  { productId: 'p005', viewedAt: '2026-03-21T20:10:00.000Z' },
  { productId: 'p007', viewedAt: '2026-03-21T14:55:00.000Z' },
  // This week
  { productId: 'p008', viewedAt: '2026-03-20T11:20:00.000Z' },
  { productId: 'p010', viewedAt: '2026-03-19T09:05:00.000Z' },
  // Earlier
  { productId: 'p012', viewedAt: '2026-03-12T17:40:00.000Z' },
  { productId: 'p014', viewedAt: '2026-03-08T13:15:00.000Z' },
];
