// Service worker de Compra: carcasa en caché para abrir al instante y sin conexión.
// Los datos los gestiona la caché de Firestore. Sube VERSION en cada despliegue.
const VERSION = "compra-v37"; // mismo número que js/version.js
const FIREBASE = "10.14.1";
const SHELL = [
  "./", "index.html", "styles.css", "manifest.webmanifest", "logo.svg",
  "js/app.js", "js/config.js", "js/version.js", "js/data.js", "js/db.js", "js/iconos.js", "js/parser.js", "js/util.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/icon-maskable-512.png",
  "fonts/figtree-400.woff2", "fonts/figtree-500.woff2", "fonts/figtree-600.woff2", "fonts/figtree-700.woff2", "fonts/bricolage-grotesque-800.woff2",
  "icons/tiendas/mercadona.png", "icons/tiendas/hipercor.png", "icons/tiendas/lidl.png", "icons/tiendas/domi-velez.png",
];
const REMOTE = [
  `https://www.gstatic.com/firebasejs/${FIREBASE}/firebase-app.js`,
  `https://www.gstatic.com/firebasejs/${FIREBASE}/firebase-auth.js`,
  `https://www.gstatic.com/firebasejs/${FIREBASE}/firebase-firestore.js`,
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    // cache: "reload" para no guardar copias viejas de la caché HTTP de GitHub Pages.
    // Cada archivo se pide con la versión en la URL: así el CDN de GitHub Pages no puede devolver una copia
    // vieja de algún archivo y mezclar versiones (pasaba justo después de publicar). Se guarda con su nombre normal.
    await Promise.all(SHELL.map(async (u) => {
      const r = await fetch(`${u}${u.includes("?") ? "&" : "?"}v=${VERSION}`, { cache: "reload" });
      if (!r.ok) throw new Error(`No se pudo descargar ${u}`);
      await c.put(new Request(u), r);
    }));
    // Comprobación: el número de version.js tiene que coincidir con el de este service worker.
    const vr = await c.match("js/version.js");
    const vtxt = vr ? await vr.clone().text() : "";
    if (!vtxt.includes(`"${VERSION.replace("compra-v", "")}"`)) throw new Error("Versión a medio publicar; se reintentará");
    await Promise.all(REMOTE.map((u) => fetch(u, { mode: "cors", cache: "reload" }).then((r) => r.ok && c.put(u, r)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

const cacheable = (url) =>
  url.origin === self.location.origin ||
  url.href.startsWith("https://www.gstatic.com/firebasejs/");

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!cacheable(url)) return; // Firestore y Auth van directos a la red
  if (req.mode === "navigate") {
    e.respondWith(caches.match("index.html").then((r) => r || fetch(req)));
    return;
  }
  // Primero la caché (abre al instante); si no está, red y se guarda.
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: url.origin === self.location.origin });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) (await caches.open(VERSION)).put(req, res.clone());
      return res;
    } catch (err) {
      return hit || Response.error();
    }
  })());
});
