// Service worker – ENCO HRV/ERV v9: index.html ưu tiên mạng, dữ liệu ưu tiên cache
const VER='v10-2026-11-08';
const CORE=['./','./index.html','./manifest.webmanifest','./logo.jpg','./icon-192.png','./icon-512.png','./wx_all.js','./xlsx.full.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==VER)await caches.delete(k);await self.clients.claim();})());});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);if(url.origin!==location.origin)return;
  const isPage=e.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('index.html')||url.pathname.endsWith('manifest.webmanifest');
  e.respondWith((async()=>{const c=await caches.open(VER);
    if(isPage){try{const r=await fetch(e.request,{cache:'no-store'});if(r.ok)c.put(e.request,r.clone());return r;}catch(err){return (await c.match(e.request,{ignoreSearch:true}))||(await c.match('./index.html'))||new Response('Offline',{status:503});}}
    const hit=await c.match(e.request,{ignoreSearch:true});if(hit)return hit;
    try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r;}catch(err){return new Response('Offline',{status:503});}
  })());});
