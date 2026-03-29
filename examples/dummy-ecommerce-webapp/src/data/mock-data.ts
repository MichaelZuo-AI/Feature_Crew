import { User, Banner } from '@/types';
import { products } from './products';

export const mockUser: User = {
  id: "u001",
  name: "Alex Kim",
  email: "alex.kim@example.com",
  phone: "010-1234-5678",
  address: {
    recipient: "Alex Kim",
    phone: "010-1234-5678",
    line1: "82, Seogang-daero, Mapo-gu, Seoul",
    line2: "Unit 402, Green Apartments",
    city: "Seoul",
    postal_code: "04157"
  },
  store_credit: 15000,
  stats: { coupons: 12, points: 4250, gift_cards: 0 },
  orders: [
    {
      id: "20260315-8472910",
      date: "2026-03-15",
      status: "shipping",
      items: [{ product: products[0], quantity: 1 }],
      total: 149000,
      payment_method: "ShopPay"
    },
    {
      id: "20260320-1928374",
      date: "2026-03-20",
      status: "delivered",
      items: [{ product: products[1], quantity: 2 }],
      total: 65800,
      payment_method: "KakaoPay"
    }
  ],
  is_premium_member: false
};

export const banners: Banner[] = [
  {
    id: "b001",
    title: "FLASH SALE",
    subtitle: "Up to 50% off today only",
    image: "https://picsum.photos/seed/banner1/800/400",
    cta_label: "Shop Now"
  }
];

export const goldbox = {
  ends_at: new Date(Date.now() + 8 * 60 * 60 * 1000 + 42 * 60 * 1000 + 19 * 1000).toISOString(),
  products: products.slice(0, 4)
};

export const expressProducts = products.filter(p => p.express_delivery).slice(0, 6);

export const weeklyEdit = [
  { id: "we001", label: "NEW SEASON", title: "The Minimalist Collective: Timepieces", subtitle: "Discover timeless aesthetics from world-renowned craftspeople.", image: "https://picsum.photos/seed/editorial1/600/400" },
  { id: "we002", label: "BEST SELLER", title: "Performance Footwear & Apparel", subtitle: "Engineering meets style in this month's top athletic picks.", image: "https://picsum.photos/seed/editorial2/600/400" }
];

export const initialCartItems = [
  { product: products[0], quantity: 1, selected: true },
  { product: products[4], quantity: 1, selected: true },
  { product: products[5], quantity: 1, selected: true },
];

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet';
  brand: string;
  label: string;
  lastFour?: string;
  expiry?: string;
  balance?: number;
  isDefault: boolean;
  icon: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'pm-1', type: 'wallet', brand: 'CoupangPay', label: 'CoupangPay Wallet', balance: 50000, isDefault: false, icon: 'account_balance_wallet' },
  { id: 'pm-2', type: 'card', brand: 'Visa', label: 'Visa', lastFour: '4242', expiry: '12/28', isDefault: true, icon: 'credit_card' },
  { id: 'pm-3', type: 'card', brand: 'Mastercard', label: 'Mastercard', lastFour: '8888', expiry: '06/27', isDefault: false, icon: 'credit_card' },
  { id: 'pm-4', type: 'wallet', brand: 'NaverPay', label: 'NaverPay Linked', isDefault: false, icon: 'payments' },
];
