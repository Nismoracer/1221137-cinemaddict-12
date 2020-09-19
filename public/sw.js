const CACHE_PREFIX = `kinoman`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = `basic`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/css/normalize.css`,
            `/css/style.css`,
            `/bundle.js`,
            `/img/background.png`,
            `/img/bitmap.png`,
            `/img/bitmap@2x.png`,
            `/img/bitmap@3x.png`,
            `/img/emoji/angry.png`,
            `/img/emoji/puke.png`,
            `/img/emoji/smile.png`,
            `/img/icons/icon-favorite-active.svg`,
            `/img/icons/icon-favorite.svg`,
            `/img/icons/icon-watched-active.svg`,
            `/img/icons/icon-watched.svg`,
            `/img/icons/icon-watchlist-active.svg`,
            `/img/icons/icon-watchlist.svg`,
            `/img/posters/made-for-each-other.png`,
            `/img/posters/popeye-meets-sinbad.png`,
            `/img/posters/sagebrush-trail.jpg`,
            `/img/posters/santa-claus-conquers-the-martians.jpg`,
            `/img/posters/the-dance-of-life.jpg`,
            `/img/posters/the-great-flamarion.jpg`,
            `/img/posters/the-man-with-the-golden-arm.jpg`,
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      return null;
                    })
                  .filter((key) => key !== null)
            )
        )
  );
});

const handleFetch = (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }

          return fetch(request)
            .then((response) => {

              if (!response || response.status !== HTTP_STATUS_OK || response.type !== RESPONSE_SAFE_TYPE) {
                return response;
              }

              const clonedResponse = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clonedResponse));

              return response;
            });
        })
  );
};

self.addEventListener(`fetch`, handleFetch);
