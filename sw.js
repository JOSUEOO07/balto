const V="balto-v1";
const BASE=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  const local=new URL(r.url).origin===location.origin;
  if(local&&(r.mode==="navigate"||r.url.endsWith(".html"))){e.respondWith(fetch(r).then(res=>{caches.open(V).then(c=>c.put(r,res.clone()));return res}).catch(()=>caches.match(r).then(x=>x||caches.match("index.html"))));return}
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cl=res.clone();caches.open(V).then(c=>c.put(r,cl))}return res})))});
