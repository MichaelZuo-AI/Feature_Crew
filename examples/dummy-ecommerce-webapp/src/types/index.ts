export interface Product {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  original_price: number;
  discount_pct: number;
  rocket_delivery: boolean;
  rating: number;
  review_count: number;
  popularity_score: number;
  description: string;
  reviews: Review[];
  qa: QAItem[];
}

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  date: string;
  body: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'preparing' | 'shipping' | 'delivered';
  items: { product: Product; quantity: number }[];
  total: number;
  payment_method: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  coupang_cash: number;
  stats: { coupons: number; points: number; gift_cards: number };
  orders: Order[];
  is_rocket_member: boolean;
}

export interface Address {
  recipient: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  postal_code: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta_label: string;
}
