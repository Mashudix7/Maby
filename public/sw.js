const CACHE_NAME = 'maby-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests, network first.
  // We use a very basic strategy just to satisfy PWA installability requirements.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
