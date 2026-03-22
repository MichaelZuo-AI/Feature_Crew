'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { User, Order, SubmittedReview, PendingReview, WishlistItem, RecentView, Coupon, Notification, SavedAddress } from '@/types';
import { mockUser } from '@/data/mock-data';
import { mockSubmittedReviews, mockPendingReviews } from '@/data/reviews';
import { mockWishlistItems } from '@/data/wishlist-data';
import { mockRecentlyViewed } from '@/data/recently-viewed-data';
import { mockCoupons } from '@/data/coupons-data';
import { mockNotifications } from '@/data/notifications-data';
import { mockAddresses } from '@/data/addresses-data';

interface UserContextValue {
  user: User;
  submittedReviews: SubmittedReview[];
  pendingReviews: PendingReview[];
  wishlist: WishlistItem[];
  recentlyViewed: RecentView[];
  coupons: Coupon[];
  notifications: Notification[];
  savedAddresses: SavedAddress[];
  applyCash: (amount: number) => void;
  addOrder: (order: Order) => void;
  submitReview: (review: SubmittedReview) => void;
  deleteReview: (reviewId: string) => void;
  activateMembership: () => void;
  addToWishlist: (productId: string, savedPrice: number) => void;
  removeFromWishlist: (productId: string) => void;
  addRecentView: (productId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  useCoupon: (couponId: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [submittedReviews, setSubmittedReviews] = useState<SubmittedReview[]>(mockSubmittedReviews);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>(mockPendingReviews);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(mockWishlistItems);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentView[]>(mockRecentlyViewed);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(mockAddresses);

  const applyCash = useCallback((amount: number) => {
    setUser((prev) => ({
      ...prev,
      coupang_cash: Math.max(0, prev.coupang_cash - amount),
    }));
  }, []);

  const addOrder = useCallback((order: Order) => {
    setUser((prev) => ({
      ...prev,
      orders: [order, ...prev.orders],
    }));
  }, []);

  const submitReview = useCallback((review: SubmittedReview) => {
    setSubmittedReviews((prev) => [review, ...prev.filter((r) => r.productId !== review.productId)]);
    setPendingReviews((prev) => prev.filter((p) => p.productId !== review.productId));
  }, []);

  const deleteReview = useCallback((reviewId: string) => {
    setSubmittedReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }, []);

  const activateMembership = useCallback(() => {
    setUser((prev) => ({ ...prev, is_rocket_member: true }));
  }, []);

  const addToWishlist = useCallback((productId: string, savedPrice: number) => {
    const newItem: WishlistItem = {
      productId,
      savedPrice,
      savedAt: new Date().toISOString(),
    };
    setWishlist((prev) => [newItem, ...prev.filter((w) => w.productId !== productId)]);
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((w) => w.productId !== productId));
  }, []);

  const addRecentView = useCallback((productId: string) => {
    const newView: RecentView = {
      productId,
      viewedAt: new Date().toISOString(),
    };
    setRecentlyViewed((prev) => [newView, ...prev.filter((v) => v.productId !== productId)].slice(0, 50));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    const now = new Date().toISOString();
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
  }, []);

  const addAddress = useCallback((address: Omit<SavedAddress, 'id'>) => {
    const newAddress: SavedAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((prev) => {
      if (newAddress.isDefault) {
        return [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [newAddress, ...prev];
    });
  }, []);

  const updateAddress = useCallback((id: string, address: Partial<SavedAddress>) => {
    setSavedAddresses((prev) => {
      if (address.isDefault) {
        return prev.map((a) =>
          a.id === id ? { ...a, ...address, isDefault: true } : { ...a, isDefault: false }
        );
      }
      return prev.map((a) => (a.id === id ? { ...a, ...address } : a));
    });
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }, []);

  const useCoupon = useCallback((couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === couponId ? { ...c, status: 'used' as const, usedAt: new Date().toISOString() } : c
      )
    );
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      submittedReviews,
      pendingReviews,
      wishlist,
      recentlyViewed,
      coupons,
      notifications,
      savedAddresses,
      applyCash,
      addOrder,
      submitReview,
      deleteReview,
      activateMembership,
      addToWishlist,
      removeFromWishlist,
      addRecentView,
      markNotificationRead,
      markAllNotificationsRead,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      useCoupon,
    }),
    [
      user,
      submittedReviews,
      pendingReviews,
      wishlist,
      recentlyViewed,
      coupons,
      notifications,
      savedAddresses,
      applyCash,
      addOrder,
      submitReview,
      deleteReview,
      activateMembership,
      addToWishlist,
      removeFromWishlist,
      addRecentView,
      markNotificationRead,
      markAllNotificationsRead,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      useCoupon,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
