import { SubmittedReview, PendingReview } from '@/types';

export const mockSubmittedReviews: SubmittedReview[] = [
  {
    id: 'sr001',
    productId: 'p007',
    rating: 5,
    text: 'Exceptional cushioning for long distance runs. The breathability of the mesh upper is noticeably better than the previous version. Highly recommend for city marathons.',
    photos: [],
    date: '2026-03-10',
    helpfulCount: 12,
  },
  {
    id: 'sr002',
    productId: 'p006',
    rating: 4,
    text: 'The noise cancellation is top-tier. I can finally work in cafes without distraction. Battery life actually exceeds the advertised 30 hours. Build quality is solid.',
    photos: [],
    date: '2026-03-05',
    helpfulCount: 8,
  },
  {
    id: 'sr003',
    productId: 'p005',
    rating: 5,
    text: "Elegant design that fits any outfit. The health tracking features are more accurate than my previous brand. The display is bright even in direct sunlight.",
    photos: [],
    date: '2026-02-20',
    helpfulCount: 24,
  },
];

export const mockPendingReviews: PendingReview[] = [
  { productId: 'p001', purchaseDate: '2026-03-15', pointsEarnable: 500 },
  { productId: 'p002', purchaseDate: '2026-03-12', pointsEarnable: 300 },
  { productId: 'p008', purchaseDate: '2026-03-08', pointsEarnable: 200 },
  { productId: 'p013', purchaseDate: '2026-03-05', pointsEarnable: 150 },
];
