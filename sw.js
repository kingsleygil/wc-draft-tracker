const CACHE = 'snl-wc-v6';
const ASSETS = [
  '/wc-draft-tracker/',
  '/wc-draft-tracker/index.html',
  '/wc-draft-tracker/icon-192.png',
  '/wc-draft-tracker/icon-512.png',
  '/wc-draft-tracker/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for ESPN API calls, cache-first for app shell
  if (e.request.url.includes('espn.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('[]')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
