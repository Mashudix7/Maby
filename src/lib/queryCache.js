/**
 * Centralized in-memory query cache with TTL + localStorage persistence.
 * Reduces redundant Firestore reads when navigating between pages.
 * Falls back to localStorage data when offline (view-only mode).
 */

const cache = new Map();
const STORAGE_PREFIX = 'maby_cache:';

/**
 * Get a cached value. Returns `undefined` if expired or missing.
 * Falls back to localStorage for offline support.
 */
export function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() <= entry.expiresAt) {
    return entry.data;
  }
  if (entry) cache.delete(key);

  // Offline fallback: try localStorage
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Don't check TTL for localStorage — it's a stale-but-usable fallback
      return parsed.data;
    }
  } catch { /* ignore parse errors */ }

  return undefined;
}

/**
 * Store a value with a time-to-live (in milliseconds).
 * Also persists to localStorage for offline access.
 */
export function setCached(key, data, ttlMs = 5 * 60 * 1000) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });

  // Persist to localStorage for offline fallback
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({ data }));
  } catch { /* quota exceeded — ignore */ }
}

/**
 * Invalidate a single cache key.
 */
export function invalidate(key) {
  cache.delete(key);
  try { localStorage.removeItem(STORAGE_PREFIX + key); } catch {}
}

/**
 * Invalidate all keys that start with a given prefix.
 * Useful for `invalidatePrefix('moments')` to clear all moment caches.
 */
export function invalidatePrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
  // Also clean localStorage
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const storageKey = localStorage.key(i);
      if (storageKey?.startsWith(STORAGE_PREFIX + prefix)) {
        localStorage.removeItem(storageKey);
      }
    }
  } catch {}
}
