'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Product, CartItem } from '@/types';
import { initialCartItems } from '@/data/mock-data';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSelected: (productId: string) => void;
  toggleSelectAll: () => void;
  removeSelected: () => void;
  clearCart: () => void;
  totalItems: number;
  selectedItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selected: true }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const clamped = Math.max(1, Math.min(99, quantity));
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: clamped } : item
      )
    );
  }, []);

  const toggleSelected = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setItems((prev) => {
      const allSelected = prev.every((item) => item.selected);
      return prev.map((item) => ({ ...item, selected: !allSelected }));
    });
  }, []);

  const removeSelected = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.selected));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const deliveryFee = useMemo(() => {
    const hasNonExpressSelected = selectedItems.some(
      (item) => !item.product.express_delivery
    );
    return hasNonExpressSelected ? 3000 : 0;
  }, [selectedItems]);

  const discount = 0;

  const total = useMemo(() => subtotal + deliveryFee - discount, [subtotal, deliveryFee]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleSelected,
      toggleSelectAll,
      removeSelected,
      clearCart,
      totalItems,
      selectedItems,
      subtotal,
      deliveryFee,
      discount,
      total,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleSelected,
      toggleSelectAll,
      removeSelected,
      clearCart,
      totalItems,
      selectedItems,
      subtotal,
      deliveryFee,
      discount,
      total,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
