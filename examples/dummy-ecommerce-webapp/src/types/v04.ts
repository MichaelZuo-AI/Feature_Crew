// Note: type-only circular import with index.ts is safe in TypeScript's isolatedModules mode
import type { Product, Order } from './index';

export interface WishlistItem {
  productId: string;
  savedAt: string;
  savedPrice: number;
}

export interface RecentView {
  productId: string;
  viewedAt: string;
}

export interface OrderDetail extends Order {
  trackingNumber: string;
  carrier: string;
  statusHistory: {
    status: 'pending' | 'preparing' | 'shipping' | 'delivered';
    timestamp: string;
    description?: string;
  }[];
}

export interface FlashSaleItem {
  productId: string;
  flashPrice: number;
  originalPrice: number;
  claimedPercentage: number;
  totalStock: number;
}

export interface FlashSale {
  id: string;
  title: string;
  endTime: string;
  items: FlashSaleItem[];
  claimsLastHour: number;
}

export interface ComparisonSpec {
  label: string;
  key: keyof Product;
  category: 'general' | 'specifications' | 'reviews' | 'delivery';
  bestIs: 'highest' | 'lowest' | 'none';
}

export interface Coupon {
  id: string;
  name: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minSpend: number;
  categories: string[];
  expiresAt: string;
  status: 'available' | 'used' | 'expired';
  usedAt?: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'price_drop' | 'promotion' | 'system';
  title: string;
  body: string;
  link: string;
  createdAt: string;
  readAt: string | null;
}

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  postal_code: string;
  city: string;
  isDefault: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  heroImage: string;
  tagline: string;
  story: string;
  pullQuote: string;
  foundedYear: number;
  avgRating: number;
  productCount: number;
}

export interface ReturnRequest {
  orderId: string;
  items: { productId: string; quantity: number }[];
  reason: string;
  details?: string;
  photos: string[];
  refundAmount: number;
  status: 'submitted';
}
