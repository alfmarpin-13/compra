// Intérprete de lo que se escribe o se dicta (sección 5.3 y 5.4).
// Funciones puras: reciben el contexto { products, stores, pending, store } y no tocan la base de datos.

import { norm, nameKey, singAll, lev, cap, bestKeyword } from "./util.js";
import { KW, CAT } from "./data.js";

const KW_LIST = Object.entries(KW).flatMap(([c, ws]) => ws.map((w) => [w, c]));

export function guessCategory(text) {
  return bestKeyword(text, KW_LIST) || "otros";
}

/** Visible en una tienda: genérica → lo suyo + «Cualquier súper»; única → solo lo suyo; null → todo. */
export function inStore(item, store) {
  if (!store) return true;
  if (store.kind === "generic") return item.storeId === store.id || item.storeId == null;
  return item.storeId === store.id;
}

/** Tienda dominante de una categoría en la despensa (al menos el 60 %). */
export function categoryHabit(category, products) {
  const xs = products.filter((p) => p.category === category);
  if (xs.length < 2) return null;
  const cnt = {};
  xs.forEach((p) => { const k = p.storeId || "_"; cnt[k] = (cnt[k] || 0) + 1; });
  const [k, v] = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
  return k !== "_" && v / xs.length >= 0.6 ? k : null;
}

/** Busca en la despensa tolerando faltas (≤ 0,26), plurales y tildes. */
export function matchProduct(q, products) {
  const sq = singAll(q);
  let best = null, score = 9, part = false;
  for (const p of products) {
    const t = singAll(p.nameKey || nameKey(p.name));
    let d, isPart = false;
    if (t === sq) d = 0;
    else if (sq.length >= 4 && (" " + t + " ").includes(" " + sq + " ")) {
      d = 0.05 + Math.abs(t.length - sq.length) / 400; isPart = true;
    } else d = lev(sq, t) / Math.max(sq.length, t.length);
    if (d < score) { score = d; best = p; part = isPart; }
  }
  if (best && score <= 0.26) return { product: best, exact: score === 0, partial: part, score };
  return null;
}

const FILLERS = [
  "me hacen falta", "me hace falta", "nos hace falta", "nos hacen falta", "hace falta", "hacen falta",
  "necesito", "necesitamos", "hay que comprar", "tenemos que comprar", "tengo que comprar", "apuntame", "apúntame",
  "apunta", "apunto", "añade", "añademe", "anade", "pon", "ponme", "compra", "comprar", "falta", "faltan", "quiero",
];
const L = "\\p{L}\\p{N}";
const FILLER_RE = new RegExp(`(?<![${L}])(${FILLERS.sort((a, b) => b.length - a.length).join("|")})(?![${L}])`, "giu");

/** Trocea una frase en artículos. */
export function splitUtterance(text) {
  let t = " " + String(text).replace(/[.;:¿?¡!\n]/g, ",") + " ";
  t = t.replace(FILLER_RE, ",");
  return t.split(/,|\s+y\s+|\s+e\s+|\s+tambi[eé]n\s+/i).map((s) => s.trim()).filter((s) => s.length > 1);
}

const NUM_WORDS = ["media docena de", "una docena de", "un par de", "un poco de", "algo de", "un", "una", "uno", "unos", "unas",
  "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "quince", "veinte", "medio", "media", "docena de", "par de", "mas", "otro", "otra", "otros", "otras"];
const UNITS = ["kilos", "kilo", "kg", "gramos", "gr", "g", "litros", "litro", "l", "ml", "paquetes", "paquete", "bolsas", "bolsa", "botes", "bote",
  "botellas", "botella", "cajas", "caja", "docenas", "docena", "unidades", "unidad", "latas", "lata", "tarros", "tarro", "barras", "barra", "packs", "pack", "rollos", "rollo", "bandejas", "bandeja", "mallas", "malla"];

/** Quita cantidades del principio: «dos kilos de patatas» → «patatas». */
export function stripQuantity(t) {
  let s = " " + t.trim() + " ", changed = true, qty = false;
  while (changed) {
    changed = false;
    const m = s.match(/^ (\d+(?:[.,]\d+)?|[½¼¾]) ?/);
    if (m) { s = " " + s.slice(m[0].length); changed = qty = true; }
    for (const w of NUM_WORDS) if (s.startsWith(" " + w + " ")) { s = s.slice(w.length + 1); changed = qty = true; break; }
    // La unidad solo se quita detrás de una cantidad: «dos bolsas de patatas» sí, «bolsas de basura» no.
    if (qty) for (const u of UNITS) if (s.startsWith(" " + u + " de ") && s.length > u.length + 5) { s = s.slice(u.length + 4); changed = true; break; }
  }
  s = s.replace(/^ (de|del) /, " ");
  s = s.replace(/^ (el|la|los|las|lo) /, " ");
  return s.trim();
}

function storeAliases(st) {
  const set = new Set([nameKey(st.name), ...(st.aliases || []).map(nameKey)]);
  return [...set].filter(Boolean).sort((a, b) => b.length - a.length);
}

/** Interpreta un trozo («pan de la panadería», «pañales para la niña», «dos pimientos»). */
export function parseOne(raw, ctx) {
  const { products, stores, pending } = ctx;
  let t = " " + norm(raw).replace(/,/g, " ") + " ";
  let storeId = null, explicit = false, lucia = false, generic = false;

  t = t.replace(/ (de|para|del|a) (la |el |mi |nuestra )?(nina|nena|bebe|peque|lucia|chiqui) /g, () => { lucia = true; return " "; });
  t = t.replace(/ (de|en|del|en el|en la|para) (cualquier|cualquiera) (sitio|super|supermercado|lado|tienda|parte) | (en )?(cualquier|cualquiera) (super|sitio|lado) | da igual (donde|en donde|la tienda) /g, () => { generic = true; explicit = true; return " "; });
  if (!generic) {
    outer: for (const st of stores) {
      for (const a of storeAliases(st)) {
        const re = new RegExp(` (?:(?:de|del|en|al|para) )?(?:(?:el|la|los) )?${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} `);
        if (re.test(t)) { storeId = st.id; explicit = true; t = t.replace(re, " "); break outer; }
      }
    }
  }
  t = stripQuantity(t.trim());
  if (!t || t.length < 2) return null;

  // Texto tal como lo escribieron (con tildes) para mostrar «escribiste «platnos»».
  const ow = String(raw).toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(Boolean);
  const nw = ow.map(norm), tt = t.split(" ");
  let shown = t;
  for (let k = 0; k + tt.length <= nw.length; k++) {
    if (nw.slice(k, k + tt.length).join(" ") === t) { shown = ow.slice(k, k + tt.length).join(" "); break; }
  }

  const hit = matchProduct(t, products);
  const e = { raw: String(raw).trim(), q: t, include: true, showAll: false, explicit, lucia };
  if (hit) {
    const p = hit.product;
    e.productId = p.id; e.name = p.name; e.category = lucia ? "lucia" : p.category; e.known = true;
    e.corrected = !hit.exact && !hit.partial ? shown : null;
    e.storeId = explicit ? (generic ? null : storeId) : p.storeId ?? null;
    e.habitual = p.storeId ?? null;
    e.ask = !explicit && p.storeId ? { storeId: p.storeId, kind: "habit" } : null;
  } else {
    e.productId = null; e.name = cap(shown); e.category = lucia ? "lucia" : guessCategory(t); e.known = false; e.corrected = null;
    const h = explicit ? null : categoryHabit(e.category, products);
    e.storeId = explicit ? (generic ? null : storeId) : h;
    e.habitual = null;
    e.ask = h ? { storeId: h, kind: "new" } : null;
  }
  const k = nameKey(e.name);
  e.dup = pending.some((i) => nameKey(i.name) === k);
  if (e.dup) e.include = false;
  return e;
}

export function parseUtterance(text, ctx) {
  const out = [];
  for (const chunk of splitUtterance(text)) {
    const e = parseOne(chunk, ctx);
    if (!e) continue;
    // Si se repite el mismo producto en la misma frase, solo una vez.
    if (out.some((o) => nameKey(o.name) === nameKey(e.name))) continue;
    out.push(e);
  }
  return out;
}

/** ¿Se puede añadir sin preguntar? (5.3) */
export function isClear(entries) {
  return entries.length > 0 && entries.every((e) => (e.known || e.explicit) && !e.corrected && !e.dup);
}

const CMD_RE = / (he|hemos|ya) (comprado|cogido|pillado|tengo|tenemos|compre|compramos)| (ya esta|ya estan|ya lo tengo) |^ (tacha|marca) /;

/** «He comprado todo lo de Mercadona menos los huevos». Devuelve null si no es una orden de tachado. */
export function parseCommand(text, ctx) {
  const { stores, pending } = ctx;
  const t = " " + norm(text).replace(/,/g, " , ") + " ";
  if (!CMD_RE.test(t)) return null;
  let store = null;
  for (const st of stores) for (const a of storeAliases(st)) if (!store && t.includes(" " + a + " ")) store = st;
  const target = store || ctx.store || null;
  const base = pending.filter((i) => inStore(i, target));
  const [main, exc] = (() => {
    const m = t.match(/ (menos|excepto|salvo|quitando|pero no) /);
    return m ? [t.slice(0, m.index) + " ", " " + t.slice(m.index + m[0].length)] : [t, ""];
  })();
  const findIn = (chunk, pool) => splitUtterance(chunk).map((s) => {
    let q = norm(s).replace(/ (he|hemos|ya) (comprado|cogido|pillado|tengo|tenemos|compre|compramos) /, " ").trim();
    q = q.replace(/^(he|hemos|ya) (comprado|cogido|pillado|tengo|tenemos|compre|compramos) /, "");
    q = singAll(stripQuantity(q.replace(/^(lo de|lo del) /, "")));
    for (const st of stores) for (const a of storeAliases(st)) q = q.replace(new RegExp(`(^| )(de |del |en )?(el |la )?${a}( |$)`), " ").trim();
    if (!q) return null;
    return pool.find((i) => {
      const n = singAll(nameKey(i.name));
      return n === q || (" " + n + " ").includes(" " + q + " ") || lev(q, n) / Math.max(q.length, n.length) <= 0.26;
    });
  }).filter(Boolean);
  const targets = / todo | toda /.test(main) ? base : findIn(main, pending);
  const ex = exc ? findIn(exc, targets) : [];
  if (!targets.length) return null;
  return { storeId: target ? target.id : null, text, rows: targets.map((i) => ({ id: i.id, on: !ex.includes(i), ex: ex.includes(i) })) };
}

export function categoryLabel(k) { return (CAT[k] || CAT.otros).l; }
