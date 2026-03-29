export interface StoreReview {
  id: string;
  reviewer: string;
  rating: number;
  date: string;
  body: string;
  productId: string;
  helpful: number;
}

export interface RatingBreakdown {
  stars: number;
  count: number;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  memberSince: number;
  description: string;
  returnPolicy: string;
  shippingInfo: string;
  stats: {
    rating: number;
    totalSales: string;
    responseRate: number;
    onTimeRate: number;
  };
  ratingBreakdown: RatingBreakdown[];
  reviews: StoreReview[];
  productIds: string[];
}

export const stores: Store[] = [
  {
    id: 'store-1',
    name: 'Seoul Electronics Hub',
    logo: 'https://picsum.photos/seed/store1/200/200',
    verified: true,
    memberSince: 2019,
    description:
      'Seoul Electronics Hub is your trusted source for premium consumer electronics in Korea. We partner directly with Samsung, Sony, and top-tier audio brands to bring you the latest tech at competitive prices. Every product is officially imported and backed by a full manufacturer warranty.',
    returnPolicy:
      'Hassle-free returns within 30 days of delivery. Items must be in original packaging with all accessories included. Defective products are eligible for free return shipping and immediate replacement or full refund.',
    shippingInfo:
      'Free standard shipping on orders over ₩50,000. Express next-day delivery available for ₩3,500. All orders are processed and dispatched within 24 hours on business days. Same-day dispatch for orders placed before 1 PM KST.',
    stats: {
      rating: 4.7,
      totalSales: '12.4K',
      responseRate: 98,
      onTimeRate: 97,
    },
    ratingBreakdown: [
      { stars: 5, count: 7820 },
      { stars: 4, count: 2940 },
      { stars: 3, count: 890 },
      { stars: 2, count: 310 },
      { stars: 1, count: 204 },
    ],
    reviews: [
      {
        id: 'sr001a',
        reviewer: 'Jordan M.',
        rating: 5,
        date: '2026-03-15',
        body: 'Incredible seller. My Galaxy Buds arrived next day in perfect condition with original Samsung packaging. Will definitely buy from Seoul Electronics Hub again.',
        productId: 'p001',
        helpful: 34,
      },
      {
        id: 'sr001b',
        reviewer: 'Chris L.',
        rating: 5,
        date: '2026-03-08',
        body: 'Ordered the WH-900 headphones and they were genuine, sealed, and shipped within hours. Best electronics seller on the platform.',
        productId: 'p006',
        helpful: 21,
      },
      {
        id: 'sr001c',
        reviewer: 'Eunji C.',
        rating: 4,
        date: '2026-02-22',
        body: 'Great prices and fast shipping. Had a small question about my tablet and the support team replied within 10 minutes. Very professional.',
        productId: 'p005',
        helpful: 12,
      },
    ],
    productIds: ['p001', 'p005', 'p006', 'p010', 'p012', 'p014'],
  },
  {
    id: 'store-2',
    name: 'K-Beauty Select',
    logo: 'https://picsum.photos/seed/store2/200/200',
    verified: true,
    memberSince: 2020,
    description:
      'K-Beauty Select curates the finest Korean beauty products sourced directly from certified dermatologist-approved labs. We specialize in science-backed skincare, featuring vitamin C serums, hyaluronic acid formulas, and innovative sheet masks trusted by beauty professionals across Asia.',
    returnPolicy:
      'We accept returns within 14 days if the product is unopened and unused. For allergic reactions or product defects, full refunds are provided with no return required — just send us a photo. Your skin health is our priority.',
    shippingInfo:
      'Free shipping on all orders over ₩30,000. Express shipping available for ₩2,500. Products are carefully packaged with bubble wrap and temperature-controlled pouches to preserve formula integrity. Orders ship Monday–Saturday.',
    stats: {
      rating: 4.9,
      totalSales: '8.7K',
      responseRate: 99,
      onTimeRate: 99,
    },
    ratingBreakdown: [
      { stars: 5, count: 7310 },
      { stars: 4, count: 1120 },
      { stars: 3, count: 190 },
      { stars: 2, count: 62 },
      { stars: 1, count: 18 },
    ],
    reviews: [
      {
        id: 'sr002a',
        reviewer: 'Mina K.',
        rating: 5,
        date: '2026-03-18',
        body: 'K-Beauty Select is the real deal. My Vitamin C serum set arrived with a personal note and a sample. Packaging was beautiful and the products are 100% authentic.',
        productId: 'p002',
        helpful: 56,
      },
    ],
    productIds: ['p002', 'p003', 'p008', 'p013'],
  },
];
