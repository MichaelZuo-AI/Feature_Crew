'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from 'react';

interface Toast {
  id: string;
  message: string;
  removing: boolean;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string) => {
    const id = `toast-${Date.now()}-${++counterRef.current}`;
    setToasts((prev) => [...prev, { id, message, removing: false }]);

    // Start fade-out 300ms before removal
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
      );
    }, 2200);

    // Remove after full duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            left: 0,
            right: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            pointerEvents: 'none',
          }}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{
                background: 'rgba(30, 30, 30, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: 8,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                fontSize: 14,
                fontWeight: 500,
                maxWidth: '85%',
                textAlign: 'center',
                pointerEvents: 'auto',
                animation: toast.removing
                  ? 'toastFadeOut 300ms ease-out forwards'
                  : 'toastSlideUp 300ms ease-out forwards',
              }}
            >
              {toast.message}
            </div>
          ))}
          <style>{`
            @keyframes toastSlideUp {
              from {
                opacity: 0;
                transform: translateY(16px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes toastFadeOut {
              from {
                opacity: 1;
                transform: translateY(0);
              }
              to {
                opacity: 0;
                transform: translateY(8px);
              }
            }
          `}</style>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
