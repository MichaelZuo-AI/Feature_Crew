import type { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  // Unread
  {
    id: 'noti-001',
    type: 'order',
    title: '주문이 배송 중입니다',
    body: '주문번호 ORD-20260322-001의 상품이 오늘 오후 배송될 예정입니다. 현재 강남구 물류센터를 출발했습니다.',
    link: '/orders/ORD-20260322-001',
    createdAt: '2026-03-22T07:00:00.000Z',
    readAt: null,
  },
  {
    id: 'noti-002',
    type: 'price_drop',
    title: '위시리스트 상품 가격이 내려갔어요!',
    body: 'Dyson Airwrap Multi-Styler의 가격이 699,000원에서 549,000원으로 내렸습니다. 지금 바로 구매하세요!',
    link: '/products/p003',
    createdAt: '2026-03-22T05:30:00.000Z',
    readAt: null,
  },
  // Read
  {
    id: 'noti-003',
    type: 'promotion',
    title: '오늘만! MEGA FLASH SALE 시작',
    body: '최대 70% 할인! 오늘 자정까지만 진행되는 플래시 세일을 놓치지 마세요. 인기 상품이 빠르게 소진되고 있습니다.',
    link: '/flash-sale',
    createdAt: '2026-03-21T00:00:00.000Z',
    readAt: '2026-03-21T08:45:00.000Z',
  },
  {
    id: 'noti-004',
    type: 'system',
    title: '새로운 쿠폰이 발급되었습니다',
    body: '로켓배송 5,000원 할인 쿠폰이 지급되었습니다. 30,000원 이상 구매 시 사용 가능합니다. 4월 30일까지 유효합니다.',
    link: '/coupons',
    createdAt: '2026-03-20T12:00:00.000Z',
    readAt: '2026-03-20T15:20:00.000Z',
  },
  {
    id: 'noti-005',
    type: 'system',
    title: '개인정보 처리방침이 업데이트되었습니다',
    body: '2026년 4월 1일부터 개인정보 처리방침이 변경됩니다. 변경 사항을 확인하시고 동의해 주세요.',
    link: '/privacy-policy',
    createdAt: '2026-03-18T09:00:00.000Z',
    readAt: '2026-03-19T10:05:00.000Z',
  },
];
