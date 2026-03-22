'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { User, Order, SubmittedReview, PendingReview } from '@/types';
import { mockUser } from '@/data/mock-data';
import { mockSubmittedReviews, mockPendingReviews } from '@/data/reviews';

interface UserContextValue {
  user: User;
  submittedReviews: SubmittedReview[];
  pendingReviews: PendingReview[];
  applyCash: (amount: number) => void;
  addOrder: (order: Order) => void;
  submitReview: (review: SubmittedReview) => void;
  deleteReview: (reviewId: string) => void;
  activateMembership: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [submittedReviews, setSubmittedReviews] = useState<SubmittedReview[]>(mockSubmittedReviews);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>(mockPendingReviews);

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

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      submittedReviews,
      pendingReviews,
      applyCash,
      addOrder,
      submitReview,
      deleteReview,
      activateMembership,
    }),
    [user, submittedReviews, pendingReviews, applyCash, addOrder, submitReview, deleteReview, activateMembership]
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
