// Capa de datos: Firebase Auth + Cloud Firestore con caché persistente.
// La app no habla con Firestore directamente: usa estas funciones.

import { EMAIL_DOMAIN, STORES_SEED } from "./data.js";
import { startOfDay, nameKey } from "./util.js";

export const FIREBASE_VERSION = "10.14.1";
const BASE = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
export const FIREBASE_URLS = [`${BASE}/firebase-app.js`, `${BASE}/firebase-auth.js`, `${BASE}/firebase-firestore.js`];

let A, F, auth, db;

export async function connect(config) {
  const [appMod, authMod, fsMod] = await Promise.all(FIREBASE_URLS.map((u) => import(u)));
  A = authMod; F = fsMod;
  const app = appMod.initializeApp(config);
  auth = A.getAuth(app);
  try {
    // En el iPhone con datos móviles, la conexión «en streaming» de Firestore puede quedarse colgada y tardar
    // 30-60 s en pasar a long polling: se usa long polling desde el principio. Y caché de una sola pestaña
    // (forceOwnership) para no esperar a coordinarse con pestañas que en la app instalada no existen.
    db = F.initializeFirestore(app, {
      experimentalForceLongPolling: true,
      localCache: F.persistentLocalCache({ tabManager: F.persistentSingleTabManager({ forceOwnership: true }) }),
    });
  } catch (e) {
    console.warn("Sin caché persistente", e);
    db = F.getFirestore(app);
  }
}

/* ---------------- Sesión ---------------- */
export const emailFor = (user) => `${user}@${EMAIL_DOMAIN}`;
export const whoFromEmail = (email) => { const u = String(email || "").split("@")[0]; return u.charAt(0).toUpperCase() + u.slice(1); };

export function onUser(cb) { return A.onAuthStateChanged(auth, cb); }
export async function login(user, pass, remember) {
  await A.setPersistence(auth, remember ? A.browserLocalPersistence : A.browserSessionPersistence);
  return A.signInWithEmailAndPassword(auth, emailFor(user), pass);
}
export function logout() { return A.signOut(auth); }

/* ---------------- Lectura en tiempo real ---------------- */
const ts = (v) => (v && typeof v.toMillis === "function" ? v.toMillis() : typeof v === "number" ? v : null);
function itemFrom(d) {
  const x = d.data({ serverTimestamps: "estimate" });
  return {
    id: d.id, productId: x.productId || null, name: x.name || "", category: x.category || "otros", storeId: x.storeId ?? null,
    addedBy: x.addedBy || "", addedAt: ts(x.addedAt), checked: !!x.checked, checkedAt: ts(x.checkedAt), checkedBy: x.checkedBy || null,
    local: d.metadata.hasPendingWrites,
  };
}
function productFrom(d) {
  const x = d.data({ serverTimestamps: "estimate" });
  return { id: d.id, name: x.name || "", nameKey: x.nameKey || nameKey(x.name), category: x.category || "otros", storeId: x.storeId ?? null, icon: x.icon ?? null, createdAt: ts(x.createdAt) };
}
function storeFrom(d) {
  const x = d.data();
  return { id: d.id, name: x.name || d.id, kind: x.kind === "unique" ? "unique" : "generic", order: typeof x.order === "number" ? x.order : 99, aliases: Array.isArray(x.aliases) ? x.aliases : [], icon: typeof x.icon === "string" ? x.icon : null };
}

/**
 * Se suscribe a tiendas, despensa, pendientes y tachados de hoy.
 * h: { stores(list), products(list), pending(list, changes), today(list), error(e) }
 */
export function subscribe(h) {
  const unsubs = [];
  const col = (n) => F.collection(db, n);
  let seeded = false;
  unsubs.push(F.onSnapshot(col("stores"), { includeMetadataChanges: false }, (s) => {
    if (s.empty && !s.metadata.fromCache && !seeded) { seeded = true; seedStores(); }
    h.stores(s.docs.map(storeFrom).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)));
  }, h.error));
  unsubs.push(F.onSnapshot(col("products"), (s) => h.products(s.docs.map(productFrom)), h.error));
  unsubs.push(F.onSnapshot(F.query(col("items"), F.where("checked", "==", false)), (s) => {
    h.pending(s.docs.map(itemFrom), s.docChanges().filter((c) => c.type === "added").map((c) => ({ id: c.doc.id, local: c.doc.metadata.hasPendingWrites })), s.metadata.fromCache);
  }, h.error));

  // Tachados de hoy: se rehace la consulta al cambiar de día.
  let todayUnsub = null, todayStart = 0;
  const listenToday = () => {
    const s0 = startOfDay(Date.now());
    if (s0 === todayStart && todayUnsub) return false;
    todayStart = s0;
    if (todayUnsub) todayUnsub();
    todayUnsub = F.onSnapshot(F.query(col("items"), F.where("checkedAt", ">=", F.Timestamp.fromMillis(s0))),
      (s) => h.today(s.docs.map(itemFrom).filter((i) => i.checked)), h.error);
    return true;
  };
  listenToday();
  return {
    refreshDay: listenToday,
    stop() { unsubs.forEach((u) => u()); if (todayUnsub) todayUnsub(); },
  };
}

function seedStores() {
  const b = F.writeBatch(db);
  for (const s of STORES_SEED) b.set(F.doc(db, "stores", s.id), { name: s.name, kind: s.kind, order: s.order, aliases: s.aliases });
  b.commit().catch((e) => console.warn("No se pudieron crear las tiendas", e));
}

/* ---------------- Historial (carga incremental) ---------------- */
const HIST_KEY = "compra.histSync";
/**
 * Devuelve lo tachado antes de hoy en los últimos 12 meses.
 * Lee primero de la caché local y luego pide al servidor solo lo nuevo desde la última vez,
 * para no gastar lecturas en cada apertura.
 */
export async function loadHistory() {
  const now = Date.now(), today = startOfDay(now), cutoff = now - 365 * 864e5;
  const col = F.collection(db, "items");
  const range = (from) => F.query(col, F.where("checkedAt", ">=", F.Timestamp.fromMillis(from)), F.where("checkedAt", "<", F.Timestamp.fromMillis(today)));
  const map = new Map();
  const add = (s) => s.docs.forEach((d) => { const i = itemFrom(d); if (i.checked) map.set(i.id, i); else map.delete(i.id); });
  try { add(await F.getDocsFromCache(range(cutoff))); } catch (e) { /* caché vacía */ }
  let last = 0;
  try { last = +localStorage.getItem(HIST_KEY) || 0; } catch (e) {}
  // Margen de 3 días para lo que el otro teléfono tachó sin conexión y subió tarde.
  const from = last ? Math.max(cutoff, last - 3 * 864e5) : cutoff;
  try {
    add(await F.getDocsFromServer(range(from)));
    try { localStorage.setItem(HIST_KEY, String(today)); } catch (e) {}
  } catch (e) { /* sin conexión: nos quedamos con la caché */ }
  return [...map.values()].filter((i) => i.checkedAt && i.checkedAt >= cutoff && i.checkedAt < today);
}

/** Borra de forma perezosa lo tachado hace más de 12 meses. */
export async function pruneHistory() {
  const cutoff = Date.now() - 365 * 864e5;
  try {
    const s = await F.getDocs(F.query(F.collection(db, "items"), F.where("checkedAt", "<", F.Timestamp.fromMillis(cutoff)), F.limit(400)));
    if (s.empty) return;
    const b = F.writeBatch(db);
    s.docs.forEach((d) => b.delete(d.ref));
    await b.commit();
  } catch (e) { console.warn("No se pudo limpiar el historial", e); }
}

/* ---------------- Escritura ----------------
   Las escrituras no se esperan: con la caché persistente se aplican al momento en local
   (y los listeners se disparan), y se suben al servidor cuando haya conexión. */
const fail = (e) => console.warn("Error al guardar", e);
// Las escrituras se pueden preparar antes de que Firebase esté listo (arranque instantáneo):
// las fechas van como marcas y se convierten al escribir; el lote espera a que haya sesión.
const T = (ms) => ({ __ts: ms });
const SERVER = { __server: true };
let readyResolve;
const ready = new Promise((r) => (readyResolve = r));
export const markReady = () => readyResolve();
function conv(data) {
  if (!data) return data;
  const o = {};
  for (const [k, v] of Object.entries(data)) {
    o[k] = v && typeof v === "object" && "__ts" in v ? F.Timestamp.fromMillis(v.__ts) : v && v.__server ? F.serverTimestamp() : v;
  }
  return o;
}
const ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/** Identificador como los de Firestore (20 caracteres aleatorios), sin necesitar Firebase cargado. */
export const newId = () => { const a = crypto.getRandomValues(new Uint8Array(20)); let id = ""; for (const x of a) id += ID_CHARS[x % 62]; return id; };

/** Lote de operaciones: ops = [{op:"set"|"update"|"delete", col, id, data}] */
export function batch(ops) {
  ready.then(() => {
    for (let i = 0; i < ops.length; i += 450) {
      const b = F.writeBatch(db);
      for (const o of ops.slice(i, i + 450)) {
        const ref = F.doc(db, o.col, o.id);
        if (o.op === "set") b.set(ref, conv(o.data));
        else if (o.op === "update") b.update(ref, conv(o.data));
        else if (o.op === "delete") b.delete(ref);
      }
      b.commit().catch(fail);
    }
  });
}

export const itemData = (x) => ({
  productId: x.productId, name: x.name, category: x.category, storeId: x.storeId ?? null,
  addedBy: x.addedBy, addedAt: T(x.addedAt || Date.now()),
  checked: !!x.checked, checkedAt: x.checkedAt ? T(x.checkedAt) : null, checkedBy: x.checkedBy || null,
});
export const productData = (x, isNew) => {
  const d = { name: x.name, nameKey: nameKey(x.name), category: x.category, storeId: x.storeId ?? null, icon: x.icon ?? null, updatedAt: SERVER };
  if (isNew) d.createdAt = SERVER;
  return d;
};
export const checkData = (by) => ({ checked: true, checkedAt: T(Date.now()), checkedBy: by });
export const uncheckData = () => ({ checked: false, checkedAt: null, checkedBy: null });
export const touch = () => ({ updatedAt: SERVER });
