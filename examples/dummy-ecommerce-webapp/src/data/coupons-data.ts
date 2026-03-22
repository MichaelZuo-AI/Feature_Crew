import type { Coupon } from '@/types';

export const mockCoupons: Coupon[] = [
  // Available coupons
  {
    id: 'cpn-001',
    name: '로켓배송 5,000원 할인',
    discountType: 'fixed',
    discountValue: 5000,
    minSpend: 30000,
    categories: ['electronics', 'appliances'],
    expiresAt: '2026-04-30T23:59:59.000Z',
    status: 'available',
  },
  {
    id: 'cpn-002',
    name: '뷰티 10% 할인 쿠폰',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 20000,
    categories: ['beauty', 'skincare'],
    expiresAt: '2026-03-31T23:59:59.000Z',
    status: 'available',
  },
  {
    id: 'cpn-003',
    name: '신규 가입 15,000원 할인',
    discountType: 'fixed',
    discountValue: 15000,
    minSpend: 50000,
    categories: [],
    expiresAt: '2026-05-15T23:59:59.000Z',
    status: 'available',
  },
  // Used coupons
  {
    id: 'cpn-004',
    name: '패션 20% 할인 쿠폰',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 40000,
    categories: ['fashion', 'shoes'],
    expiresAt: '2026-03-10T23:59:59.000Z',
    status: 'used',
    usedAt: '2026-03-08T14:22:00.000Z',
  },
  {
    id: 'cpn-005',
    name: '식품 3,000원 할인',
    discountType: 'fixed',
    discountValue: 3000,
    minSpend: 15000,
    categories: ['food', 'grocery'],
    expiresAt: '2026-02-28T23:59:59.000Z',
    status: 'used',
    usedAt: '2026-02-20T09:15:00.000Z',
  },
  // Expired coupon
  {
    id: 'cpn-006',
    name: '설날 특별 할인 8%',
    discountType: 'percentage',
    discountValue: 8,
    minSpend: 25000,
    categories: [],
    expiresAt: '2026-02-15T23:59:59.000Z',
    status: 'expired',
  },
];
