import type { WishlistItem } from '@/types';

export const mockWishlistItems: WishlistItem[] = [
  {
    productId: 'p001',
    savedAt: '2026-03-21T10:30:00.000Z',
    savedPrice: 179000, // was higher — price dropped from 179k to 149k
  },
  {
    productId: 'p002',
    savedAt: '2026-03-20T14:15:00.000Z',
    savedPrice: 32900, // same as current
  },
  {
    productId: 'p003',
    savedAt: '2026-03-15T09:00:00.000Z',
    savedPrice: 599000, // price dropped from 599k to 549k
  },
  {
    productId: 'p004',
    savedAt: '2026-03-14T18:45:00.000Z',
    savedPrice: 34900, // same as current (no discount)
  },
  {
    productId: 'p005',
    savedAt: '2026-03-10T11:20:00.000Z',
    savedPrice: 599000, // price dropped significantly from 599k to 494k
  },
  {
    productId: 'p006',
    savedAt: '2026-03-08T16:00:00.000Z',
    savedPrice: 249000, // price dropped from 249k to 209k
  },
];
