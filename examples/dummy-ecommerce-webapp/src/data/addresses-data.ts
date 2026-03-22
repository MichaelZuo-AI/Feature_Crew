import type { SavedAddress } from '@/types';

export const mockAddresses: SavedAddress[] = [
  {
    id: 'addr-001',
    name: '김민준',
    phone: '010-1234-5678',
    line1: '서울특별시 강남구 테헤란로 152',
    line2: '강남파이낸스센터 12층',
    postal_code: '06236',
    city: '서울특별시',
    isDefault: true,
  },
  {
    id: 'addr-002',
    name: '김민준 (집)',
    phone: '010-1234-5678',
    line1: '서울특별시 마포구 와우산로 94',
    line2: '홍대 아파트 303동 501호',
    postal_code: '04066',
    city: '서울특별시',
    isDefault: false,
  },
];
