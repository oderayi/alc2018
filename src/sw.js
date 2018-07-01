/**
 * sw.js
 * Service Worker
 * @author Steven Oderayi <oderayi@gmail.com>
 */

// caches
const assetsCacheName = 'cc-static-v5';
const allCaches = [
  assetsCacheName
];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(assetsCacheName).then(function(cache) {
        return cache.addAll([
          'index.html',
          'bundle.js',
          'main.css',
          'MaterialIcons-Regular.woff',
          'Simple-Line-Icons.woff',
          'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
          'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
        ]);
      })
    );
  });
  
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('cc-') &&
                   !allCaches.includes(cacheName);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
        event.respondWith(caches.match('index.html'));
        return;
      } 
    }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
  self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });