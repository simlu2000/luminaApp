/* eslint-disable no-restricted-globals */
const CACHE_NAME = "lumina-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/manifest.json",
  "/favicon.ico",
];

// 1. Installazione
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Attivazione: Pulizia vecchie cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Strategia Fetch: Stale-While-Revalidate
// Serve i file dalla cache subito, ma cerca aggiornamenti in background
self.addEventListener("fetch", (event) => {
  // 1. Ignora richieste non-GET (come la POST a get-advice) e le API meteo
  if (event.request.method !== "GET" || event.request.url.includes("api.openweathermap.org") || event.request.url.includes(".netlify/functions/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Controlliamo che la risposta sia valida prima di clonarla
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => cachedResponse); // Se il network fallisce, usa la cache

      return cachedResponse || fetchPromise;
    })
  );
});