/* eslint-disable no-restricted-globals */
const CACHE_NAME = "lumina-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/manifest.json",
  "/favicon.ico",
  // Aggiungi qui eventuali font o icone fisse
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
  // Ignora le richieste API (dati meteo sempre receneti)
  if (event.request.url.includes("api.openweathermap.org")) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});