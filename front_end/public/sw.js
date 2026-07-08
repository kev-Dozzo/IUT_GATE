const CACHE = "iutgate-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );
});

self.addEventListener("fetch", (e) => {
  const url = e.request.url;

  // Ignore tout sauf GET
  if (e.request.method !== "GET") return;

  // Ignore API, fonts Google, localhost backend
  if (url.includes("/api/")) return;
  if (url.includes("localhost:5000")) return;
  if (url.includes("fonts.googleapis.com")) return;
  if (url.includes("fonts.gstatic.com")) return;

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
