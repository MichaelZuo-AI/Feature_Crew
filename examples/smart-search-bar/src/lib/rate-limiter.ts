// ---------------------------------------------------------------------------
// In-memory per-session rate limiter
// Window: 60 s · Max: 60 requests per window
// ---------------------------------------------------------------------------

interface SessionBucket {
  timestamps: number[];
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const CLEANUP_INTERVAL_MS = 120_000;

const store = new Map<string, SessionBucket>();

// Periodically purge sessions whose most recent request is older than the window.
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [id, bucket] of store) {
      // Remove timestamps that have fallen outside the window
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
      if (bucket.timestamps.length === 0) {
        store.delete(id);
      }
    }
    // If the store is empty, stop the timer to avoid leaking in tests / short-lived processes
    if (store.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, CLEANUP_INTERVAL_MS);
  // Allow the Node process to exit even if the timer is still running
  if (typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

export function checkRateLimit(sessionId: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  ensureCleanup();

  const now = Date.now();
  let bucket = store.get(sessionId);

  if (!bucket) {
    bucket = { timestamps: [] };
    store.set(sessionId, bucket);
  }

  // Evict timestamps outside the current window
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.timestamps.length >= MAX_REQUESTS) {
    // Earliest timestamp still in the window – caller must wait until it expires
    const oldest = bucket.timestamps[0];
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  bucket.timestamps.push(now);
  return { allowed: true };
}
