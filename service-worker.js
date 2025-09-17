const CACHE_NAME = 'mh-procurement-cache-v1';
const urlsToCache = [
  '/mh-procurement-portal/', // Cache the root index.html
  '/manifest.json',
  '/pages/about.html',
  '/pages/contact.html',
  '/pages/medical-supplies.html',
  '/pages/office-supplies.html',
  '/pages/pharmaceuticals.html',
  '/pages/services.html',
  '/pages/how-it-works.html',
  '/pages/lab-equipment.html',
  '/pages/emergency-contact.html',
  '/commons/header.html',
  '/commons/footer.html',

  '/assets/css/style.css',
  '/assets/css/output.css',
  '/assets/js/main.js',
  '/assets/images/icons/icon-72x72.png',
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',

];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
