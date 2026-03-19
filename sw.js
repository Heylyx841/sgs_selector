const CACHE_NAME = 'msgs-tool-v1';
// 需要缓存的资源列表
const ASSETS_TO_CACHE =[
  './',
  './index.html',
  './manifest.json',
  './logo-1024.png',
  './logo-512.png'
];

// 安装阶段：缓存所有静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting()) // 【已修复】修改为回调函数
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 【优化】立即接管当前客户端
  );
});

// 策略：网络优先，失败后使用缓存（保证数据最新，且没网也能开）
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});