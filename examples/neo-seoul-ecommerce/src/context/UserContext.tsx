'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { User, Order } from '@/types';
import { mockUser } from '@/data/mock-data';

interface UserContextValue {
  user: User;
  applyCash: (amount: number) => void;
  addOrder: (order: Order) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);

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

  const value = useMemo<UserContextValue>(
    () => ({ user, applyCash, addOrder }),
    [user, applyCash, addOrder]
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
