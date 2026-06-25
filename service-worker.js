/* ===================================================================
   CRAVINS ICE CREAM — Service Worker
   Strategy: Stale-While-Revalidate for assets, network-first for nav
=================================================================== */

var CACHE_NAME = 'cravins-cache-v1';
var OFFLINE_URL = 'offline.html';

var PRECACHE_ASSETS = [
  'index.html',
  'offline.html',
  'css/styles.css',
  'js/script.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;

  if (request.method !== 'GET') return;

  /* Navigation requests: network-first, fall back to cache, then offline page */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  /* Other requests: stale-while-revalidate */
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(request).then(function (cachedResponse) {
        var networkFetch = fetch(request).then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200 && request.url.indexOf('http') === 0) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(function () {
          return cachedResponse;
        });
        return cachedResponse || networkFetch;
      });
    })
  );
});
