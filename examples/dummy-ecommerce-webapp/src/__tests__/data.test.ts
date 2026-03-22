import { describe, it, expect } from 'vitest';
import { products } from '../data/products';
import { mockUser, banners, goldbox, rocketProducts, weeklyEdit, initialCartItems } from '../data/mock-data';
import { formatPrice } from '../lib/format';

describe('Products data integrity', () => {
  it('should have exactly 20 products', () => {
    expect(products).toHaveLength(20);
  });

  it.each(products)('product $id ($name) should have all required fields', (product) => {
    expect(product.id).toBeTruthy();
    expect(typeof product.id).toBe('string');
    expect(product.name).toBeTruthy();
    expect(typeof product.name).toBe('string');
    expect(product.brand).toBeTruthy();
    expect(typeof product.brand).toBe('string');
    expect(product.price).toBeGreaterThan(0);
    expect(product.original_price).toBeGreaterThanOrEqual(product.price);
    expect(product.image).toBeTruthy();
    expect(typeof product.image).toBe('string');
    expect(product.rating).toBeGreaterThanOrEqual(0);
    expect(product.rating).toBeLessThanOrEqual(5);
    expect(product.review_count).toBeGreaterThan(0);
    expect(typeof product.rocket_delivery).toBe('boolean');
    expect(typeof product.discount_pct).toBe('number');
    expect(product.discount_pct).toBeGreaterThanOrEqual(0);
    expect(product.discount_pct).toBeLessThan(100);
    expect(product.description).toBeTruthy();
    expect(typeof product.popularity_score).toBe('number');
  });

  it.each(products)('product $id should have at least 3 reviews', (product) => {
    expect(product.reviews.length).toBeGreaterThanOrEqual(3);
    product.reviews.forEach((review) => {
      expect(review.id).toBeTruthy();
      expect(review.reviewer).toBeTruthy();
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
      expect(review.date).toBeTruthy();
      expect(review.body).toBeTruthy();
    });
  });

  it.each(products)('product $id should have at least 2 Q&A items', (product) => {
    expect(product.qa.length).toBeGreaterThanOrEqual(2);
    product.qa.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.question).toBeTruthy();
      expect(item.answer).toBeTruthy();
      expect(item.date).toBeTruthy();
    });
  });

  it('all product IDs should be unique', () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('discount_pct should be consistent with price and original_price', () => {
    products.forEach((product) => {
      if (product.discount_pct === 0) {
        expect(product.price).toBe(product.original_price);
      } else {
        expect(product.price).toBeLessThan(product.original_price);
      }
    });
  });
});

describe('formatPrice', () => {
  it('should format KRW currency correctly', () => {
    const result = formatPrice(149000);
    // Should contain the won symbol and the number with thousands separators
    expect(result).toContain('149,000');
  });

  it('should format zero correctly', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('should format large numbers correctly', () => {
    const result = formatPrice(1000000);
    expect(result).toContain('1,000,000');
  });
});

describe('Mock user data', () => {
  it('should have valid user profile', () => {
    expect(mockUser.id).toBeTruthy();
    expect(mockUser.name).toBeTruthy();
    expect(mockUser.email).toContain('@');
    expect(mockUser.phone).toBeTruthy();
    expect(typeof mockUser.is_rocket_member).toBe('boolean');
  });

  it('should have valid address', () => {
    const { address } = mockUser;
    expect(address.recipient).toBeTruthy();
    expect(address.phone).toBeTruthy();
    expect(address.line1).toBeTruthy();
    expect(address.line2).toBeTruthy();
    expect(address.city).toBeTruthy();
    expect(address.postal_code).toBeTruthy();
  });

  it('should have valid stats', () => {
    expect(mockUser.stats.coupons).toBeGreaterThanOrEqual(0);
    expect(mockUser.stats.points).toBeGreaterThanOrEqual(0);
    expect(mockUser.stats.gift_cards).toBeGreaterThanOrEqual(0);
  });

  it('should have valid orders', () => {
    expect(mockUser.orders.length).toBeGreaterThanOrEqual(2);
    mockUser.orders.forEach((order) => {
      expect(order.id).toBeTruthy();
      expect(order.date).toBeTruthy();
      expect(['pending', 'preparing', 'shipping', 'delivered']).toContain(order.status);
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.total).toBeGreaterThan(0);
      expect(order.payment_method).toBeTruthy();
    });
  });

  it('should have coupang_cash for checkout flow', () => {
    expect(mockUser.coupang_cash).toBeGreaterThan(0);
  });
});

describe('Mock data collections', () => {
  it('should have at least 1 banner', () => {
    expect(banners.length).toBeGreaterThanOrEqual(1);
    banners.forEach((b) => {
      expect(b.id).toBeTruthy();
      expect(b.title).toBeTruthy();
      expect(b.image).toBeTruthy();
    });
  });

  it('goldbox should have at least 4 products', () => {
    expect(goldbox.products.length).toBeGreaterThanOrEqual(4);
    expect(goldbox.ends_at).toBeTruthy();
  });

  it('rocketProducts should only contain rocket_delivery items', () => {
    expect(rocketProducts.length).toBeGreaterThan(0);
    rocketProducts.forEach((p) => {
      expect(p.rocket_delivery).toBe(true);
    });
  });

  it('weeklyEdit should have at least 2 editorial cards', () => {
    expect(weeklyEdit.length).toBeGreaterThanOrEqual(2);
    weeklyEdit.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.image).toBeTruthy();
    });
  });

  it('initialCartItems should have valid products and quantities', () => {
    expect(initialCartItems.length).toBeGreaterThan(0);
    initialCartItems.forEach((item) => {
      expect(item.product).toBeTruthy();
      expect(item.quantity).toBeGreaterThanOrEqual(1);
      expect(item.selected).toBe(true);
    });
  });
});
