const CACHE = "iutgate-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting(e);
});

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
  // Ignore les requêtes non-GET et les requêtes API
  if (e.request.method !== "GET") return;
  if (e.request.url.includes("/api/")) return;
  if (e.request.url.includes("localhost:5000")) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Vérifie que la réponse est valide
        if (!response || response.status !== 200) return response;
        return response;
      })
      .catch(() => {
        // En cas d'erreur réseau, retourne la page depuis le cache
        return caches.match(e.request);
      }),
  );
});
