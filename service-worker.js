const CACHE_NAME = 'mh-procurement-cache-v1';
const urlsToCache = [
  './', // Cache the root
  './index.html', // Cache the main index.html
  './manifest.json',
  './pages/about.html',
  './pages/contact.html',
  './pages/medical-supplies.html',
  './pages/office-supplies.html',
  './pages/pharmaceuticals.html',
  './pages/services.html',
  './pages/how-it-works.html',
  './pages/lab-equipment.html',
  './pages/emergency-contact.html',
  './commons/header.html',
  './commons/footer.html',

  './assets/css/style.css',
  './assets/css/output.css',
  './assets/js/index.js',
  './assets/images/logo.png',
  './assets/images/icons/icon-72x72.png',
  './assets/images/icons/manifest-icon-192.maskable.png',
  './assets/images/icons/manifest-icon-512.maskable.png',

    // Screenshots for PWA install prompt
  './assets/images/screenshots/homepage-wide.png',
  './assets/images/screenshots/homepage-mobile.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',

];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
        if (response) { 
          return response;
         }
        return fetch(e.request);
      })
  );
});
