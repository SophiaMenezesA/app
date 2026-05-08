const CACHE_NAME = 'morangoapp-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/roleta.html',
  '/tickets.html',
  '/frases.html',
  '/caracoroa.html',
  '/admin.html',
  '/style.css',
  '/script.js',
  '/admin.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())  // ← IMPORTANTE: força ativação
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())  // ← IMPORTANTE: assume controle
  );
});