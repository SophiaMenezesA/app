const CACHE_NAME = 'morangoapp-v1';
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
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});