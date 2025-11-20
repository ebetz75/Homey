const CACHE_NAME = 'ledgerlens-v1';
const OFFLINE_URL = 'index.html';

const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://aistudiocdn.com/react@^19.2.0/',
  'https://aistudiocdn.com/@google/genai@^1.30.0',
  'https://aistudiocdn.com/lucide-react@^0.554.0',
  'https://aistudiocdn.com/recharts@^3.4.1'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests that aren't in our cache list logic specifically
  // mostly to avoid caching API calls to Gemini or others blindly
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise network request
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
          return response;
        }

        // Clone the response because it's a stream and can only be consumed once
        const responseToCache = response.clone();

        // Cache the new resource (Stale-while-revalidate logic could be applied here, 
        // but simple cache-first fallback is safer for PWA shell)
        caches.open(CACHE_NAME).then((cache) => {
          // Only cache http/https
          if (event.request.url.startsWith('http')) {
             cache.put(event.request, responseToCache);
          }
        });

        return response;
      }).catch(() => {
        // If offline and navigation request, show index.html
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
