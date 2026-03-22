'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import BottomNavBar from '@/components/layout/BottomNavBar';
import type { Notification } from '@/types';

// ---------------------------------------------------------------------------
// Time-ago helper
// ---------------------------------------------------------------------------
function timeAgo(isoString: string): string {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

// ---------------------------------------------------------------------------
// Grouping helpers
// ---------------------------------------------------------------------------
type Group = 'Today' | 'This Week' | 'Earlier';

function getGroup(isoString: string): Group {
  const now = new Date();
  const then = new Date(isoString);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  if (then >= startOfToday) return 'Today';
  if (then >= startOfWeek) return 'This Week';
  return 'Earlier';
}

// ---------------------------------------------------------------------------
// Icon config per notification type
// ---------------------------------------------------------------------------
interface IconConfig {
  icon: string;
  containerClass: string;
  iconClass: string;
}

function getIconConfig(type: Notification['type']): IconConfig {
  switch (type) {
    case 'order':
      return {
        icon: 'local_shipping',
        containerClass: 'bg-primary/10',
        iconClass: 'text-primary',
      };
    case 'price_drop':
      return {
        icon: 'trending_down',
        containerClass: 'bg-secondary/10',
        iconClass: 'text-secondary',
      };
    case 'promotion':
      return {
        icon: 'local_offer',
        containerClass: 'bg-secondary/10',
        iconClass: 'text-secondary',
      };
    case 'system':
    default:
      return {
        icon: 'info',
        containerClass: 'bg-surface-container-high',
        iconClass: 'text-on-surface-variant',
      };
  }
}

// ---------------------------------------------------------------------------
// Notification card
// ---------------------------------------------------------------------------
function NotificationCard({
  notification,
  onTap,
}: {
  notification: Notification;
  onTap: (notification: Notification) => void;
}) {
  const isUnread = !notification.readAt;
  const { icon, containerClass, iconClass } = getIconConfig(notification.type);

  return (
    <button
      type="button"
      onClick={() => onTap(notification)}
      className="w-full bg-white rounded-lg p-4 flex gap-3 text-left active:bg-black/5 transition-colors"
    >
      {/* Left: icon in colored circle */}
      <div
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${containerClass}`}
      >
        <span className={`material-symbols-outlined text-xl ${iconClass}`}>{icon}</span>
      </div>

      {/* Center: text content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            isUnread ? 'font-semibold text-on-surface' : 'font-normal text-on-surface'
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2 leading-relaxed">
          {notification.body}
        </p>
        <p className="text-[10px] text-outline mt-1">{timeAgo(notification.createdAt)}</p>
      </div>

      {/* Right: unread dot */}
      <div className="shrink-0 flex items-start pt-1">
        {isUnread ? (
          <span className="w-2 h-2 rounded-full bg-primary" />
        ) : (
          <span className="w-2 h-2" />
        )}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="bg-surface-container-low rounded-lg px-4 py-2">
      <p className="text-xs font-semibold text-on-surface-variant">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const GROUP_ORDER: Group[] = ['Today', 'This Week', 'Earlier'];

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useUser();

  const allRead = notifications.every((n) => !!n.readAt);

  // Group notifications
  const grouped: Record<Group, Notification[]> = {
    Today: [],
    'This Week': [],
    Earlier: [],
  };

  for (const n of notifications) {
    grouped[getGroup(n.createdAt)].push(n);
  }

  const handleTap = (notification: Notification) => {
    markNotificationRead(notification.id);
    router.push(notification.link);
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Custom top bar */}
      <header className="glass fixed top-0 left-0 right-0 z-50 mx-auto max-w-md h-16">
        <div className="flex items-center h-full px-4">
          {/* Back arrow */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full active:bg-black/5 transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>

          {/* Center title */}
          <h1 className="flex-1 text-center text-base font-bold text-on-surface">
            Notifications
          </h1>

          {/* Mark all read */}
          <button
            type="button"
            onClick={markAllNotificationsRead}
            disabled={allRead}
            className={`text-sm transition-opacity ${
              allRead ? 'text-primary opacity-40 pointer-events-none' : 'text-primary'
            }`}
          >
            Mark All Read
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pt-20 px-4">
        {notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">
              notifications
            </span>
            <p className="text-base font-semibold text-on-surface">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {GROUP_ORDER.map((group) => {
              const items = grouped[group];
              if (items.length === 0) return null;

              return (
                <div key={group} className="flex flex-col gap-2">
                  <SectionHeader label={group} />
                  {items.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onTap={handleTap}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
