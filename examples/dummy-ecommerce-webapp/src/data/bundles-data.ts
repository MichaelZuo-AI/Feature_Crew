import { products } from '@/data/products';

export interface Bundle {
  id: string;
  name: string;
  category: string;
  productIds: string[];
  bundlePrice: number;
  individualTotal: number;
  savings: number;
  savingsPercent: number;
}

function makeBundle(
  id: string,
  name: string,
  category: string,
  productIndices: number[],
  discount: number
): Bundle {
  const bundleProducts = productIndices.map((i) => products[i]);
  const individualTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0);
  const bundlePrice = individualTotal - discount;
  const savings = discount;
  const savingsPercent = Math.round((savings / individualTotal) * 100);

  return {
    id,
    name,
    category,
    productIds: bundleProducts.map((p) => p.id),
    bundlePrice,
    individualTotal,
    savings,
    savingsPercent,
  };
}

export const bundles: Bundle[] = [
  makeBundle('bundle-001', 'Ultimate Audio Kit', 'Electronics', [0, 3, 7], 45000),
  makeBundle('bundle-002', 'Home Office Pro Set', 'Electronics', [2, 6, 10], 38000),
  makeBundle('bundle-003', 'Morning Ritual Kit', 'Kitchen', [4, 5, 14], 22000),
  makeBundle('bundle-004', 'Fitness Starter Pack', 'Fashion', [8, 9, 15], 31000),
  makeBundle('bundle-005', 'Weekend Vibes Bundle', 'Electronics', [1, 11, 12], 27000),
];

export const BUNDLE_CATEGORIES = ['All', 'Electronics', 'Kitchen', 'Fashion'] as const;
export type BundleCategory = (typeof BUNDLE_CATEGORIES)[number];
