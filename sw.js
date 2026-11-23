const CACHE_NAME =
  "pracoro-counter-v5";

const CORE_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon_180.png",
  "./icon_192.png",
  "./icon_512.png"
];

self.addEventListener(
  "install",
  event => {

    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(cache => {
          return cache.addAll(
            CORE_FILES
          );
        })
        .then(() => {
          return self.skipWaiting();
        })
    );

  }
);

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {

          return Promise.all(
            cacheNames
              .filter(
                name =>
                  name !== CACHE_NAME
              )
              .map(
                name =>
                  caches.delete(name)
              )
          );

        })
        .then(() => {
          return self.clients.claim();
        })
    );

  }
);

self.addEventListener(
  "fetch",
  event => {

    if(
      event.request.method !==
      "GET"
    ){
      return;
    }

    event.respondWith(

      fetch(event.request)
        .then(response => {

          if(
            !response ||
            response.status !== 200
          ){
            return response;
          }

          const copy =
            response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {

              cache.put(
                event.request,
                copy
              );

            });

          return response;
        })

        .catch(() => {

          return caches.match(
            event.request
          );

        })

    );

  }
);
