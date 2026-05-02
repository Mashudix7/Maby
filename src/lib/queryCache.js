/**
 * Centralized in-memory query cache with TTL.
 * Reduces redundant Firestore reads when navigating between pages.
 */

const cache = new Map();

/**
 * Get a cached value. Returns `undefined` if expired or missing.
 */
export function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.data;
}

/**
 * Store a value with a time-to-live (in milliseconds).
 */
export function setCached(key, data, ttlMs = 5 * 60 * 1000) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Invalidate a single cache key.
 */
export function invalidate(key) {
  cache.delete(key);
}

/**
 * Invalidate all keys that start with a given prefix.
 * Useful for `invalidate('moments:')` to clear all moment caches.
 */
export function invalidatePrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
