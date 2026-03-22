import type { FlashSale } from '@/types';

export const mockFlashSale: FlashSale = {
  id: 'fs-2026-0322',
  title: 'MEGA FLASH SALE',
  endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  claimsLastHour: 127,
  items: [
    {
      productId: 'p001',
      flashPrice: 119000,
      originalPrice: 239000,
      claimedPercentage: 30,
      totalStock: 500,
    },
    {
      productId: 'p005',
      flashPrice: 399000,
      originalPrice: 899000,
      claimedPercentage: 55,
      totalStock: 300,
    },
    {
      productId: 'p009',
      flashPrice: 299000,
      originalPrice: 599000,
      claimedPercentage: 73,
      totalStock: 200,
    },
    {
      productId: 'p003',
      flashPrice: 499000,
      originalPrice: 699000,
      claimedPercentage: 91,
      totalStock: 150,
    },
    {
      productId: 'p016',
      flashPrice: 59000,
      originalPrice: 149000,
      claimedPercentage: 45,
      totalStock: 400,
    },
  ],
};
