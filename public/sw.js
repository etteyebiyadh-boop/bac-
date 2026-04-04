self.addEventListener("install", (event) => {
  // Simple "install" for PWA compliance
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass-through fetch for now
  event.respondWith(fetch(event.request));
});
