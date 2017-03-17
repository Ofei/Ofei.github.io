var cacheName = 'blog-1';

var filesToCache = [
    '/',
    '/index.html',
    '/css/bootstrap.min.css',
    '/css/blog.min.css',
    '/css/syntax.css',
    '/css/font-awesome.min.css',
    '/css/fontawesome-webfont.eot',
    '/css/fontawesome-webfont.woff2',
    '/css/fontawesome-webfont.woff',
    '/css/fontawesome-webfont.ttf',
    '/css/fontawesome-webfont.svg',
    '/js/fastclick.min.js',
    '/js/jquery.min.js',
    '/js/bootstrap.min.js',
    '/js/blog.min.js',
    '/js/jquery.tagcloud.js',
    '/img/tag-bg.jpg',
    '/img/post-bg-rwd.jpg',
    '/img/avatar_m.jpg',
    '/img/home-bg-o.jpg',
    '/img/post-bg-digital-native.jpg',
    '/img/post-bg-2015.jpg'
];

self.addEventListener('install',function(e){
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    )
});

self.addEventListener('activate',function(e){
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                console.log(key);
                console.log('[ServiceWorker] Removing old cache', key);
                if(key !== cacheName){
                    return caches.delete(key);
                }
            }))
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        var responseToCache = response.clone();

                        caches.open(cacheName)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});