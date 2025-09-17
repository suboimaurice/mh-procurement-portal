const CACHE_NAME = 'mh-procurement-cache-v1';
const urlsToCache = [
  '/mh-procurement-portal/', // Cache the root index.html
  '/mh-procurement-portal/manifest.json',
  '/mh-procurement-portal/pages/about.html',
  '/mh-procurement-portal/pages/contact.html',
  '/mh-procurement-portal/pages/medical-supplies.html',
  '/mh-procurement-portal/pages/office-supplies.html',
  '/mh-procurement-portal/pages/pharmaceuticals.html',
  '/mh-procurement-portal/pages/services.html',
  '/mh-procurement-portal/pages/how-it-works.html',
  '/mh-procurement-portal/pages/lab-equipment.html',
  '/mh-procurement-portal/pages/emergency-contact.html',
  '/mh-procurement-portal/commons/header.html',
  '/mh-procurement-portal/commons/footer.html',

  '/mh-procurement-portal/assets/css/style.css',
  '/mh-procurement-portal/assets/css/output.css',
  '/mh-procurement-portal/assets/js/main.js',
  '/mh-procurement-portal/assets/images/icons/icon-72x72.png',
  '/mh-procurement-portal/assets/images/icons/icon-192x192.png',
  '/mh-procurement-portal/assets/images/icons/icon-512x512.png',
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
