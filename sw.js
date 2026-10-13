/* 해군 장병 교통안전 교육 — Service Worker
   ※ 콘텐츠(문항·영상 목록 등)를 수정한 뒤에는 아래 CACHE 버전을 올리세요(예: v1 → v2).
     그래야 사용자 기기에서 새 버전으로 갱신됩니다. */
const CACHE = "navy-safety-v4";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                 // 시트 전송(POST) 등은 그대로 통과
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;  // 외부(영상 CDN 등)는 캐시 개입 안 함

  // 대용량 영상은 캐시하지 않고 네트워크로 스트리밍
  if (/\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return;

  // 앱 셸: 캐시 우선, 없으면 네트워크(받아서 캐시), 오프라인 시 index로 폴백
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
