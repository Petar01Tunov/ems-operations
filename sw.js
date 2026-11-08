// Кешира само статичните файлове на приложението. API заявки и лични данни НЕ се кешират.
const CACHE = 'pulsar-static-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('shell', copy)); return res; }).catch(() => caches.open(CACHE).then((c) => c.match('shell')).then((r) => r || Response.error())));
    return;
  }
  if (/\.(js|css|woff2?|svg|webmanifest)$/.test(new URL(req.url).pathname)) {
    e.respondWith(caches.open(CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }))));
  }
});
