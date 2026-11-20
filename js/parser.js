// Intérprete de lo que se escribe o se dicta (sección 5.3 y 5.4).
// Funciones puras: reciben el contexto { products, stores, pending, store } y no tocan la base de datos.

import { norm, nameKey, singAll, lev, cap, bestKeyword } from "./util.js";
import { KW, CAT } from "./data.js";

const KW_LIST = Object.entries(KW).flatMap(([c, ws]) => ws.map((w) => [w, c]));

export function guessCategory(text) {
  return bestKeyword(text, KW_LIST) || "otros";
}

/** Tiendas de especialidad: una tienda única cuyo nombre dice qué se compra allí (frutería → fruta y verdura).
 *  No son excluyentes: ven también lo de «Cualquier súper» de sus categorías, y los súper ven lo suyo. */
const ESPECIALIDAD = [
  ["fruter", ["fruta", "verdura"]], ["verdul", ["verdura", "fruta"]], ["carnic", ["carne", "charcuteria"]], ["polleri", ["carne"]],
  ["pescader", ["pescado"]], ["marisquer", ["pescado"]], ["panader", ["pan", "bolleria"]], ["horno", ["pan", "bolleria"]],
  ["pasteler", ["bolleria"]], ["charcut", ["charcuteria"]], ["queser", ["quesos"]],
];
export function especialidad(st) {
  if (!st || st.kind !== "unique") return null;
  const k = nameKey(st.name);
  for (const [w, cats] of ESPECIALIDAD) if (k.includes(w)) return cats;
  return null;
}
/** Visible en una tienda (null → todo):
 *  - súper (genérica): lo suyo, lo de «Cualquier súper» y lo de las tiendas de especialidad (también se puede comprar allí);
 *  - de especialidad: lo suyo y lo de «Cualquier súper» de sus categorías (la frutería, toda la fruta y verdura);
 *  - única sin especialidad (farmacia): solo lo suyo. */
export function inStore(item, store, stores = []) {
  if (!store) return true;
  if (item.storeId === store.id) return true;
  if (store.kind === "generic") {
    if (item.storeId == null) return true;
    return !!especialidad(stores.find((s) => s.id === item.storeId));
  }
  const cats = especialidad(store);
  return !!(cats && item.storeId == null && cats.includes(item.category));
}

/** Tienda dominante de una categoría en la despensa (al menos el 60 %). */
export function categoryHabit(category, products, stores = []) {
  const xs = products.filter((p) => p.category === category);
  if (xs.length < 2) return null;
  const cnt = {};
  xs.forEach((p) => { const k = p.storeId || "_"; cnt[k] = (cnt[k] || 0) + 1; });
  const [k, v] = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
  // Las tiendas de especialidad no se sugieren: ya ven lo de su categoría aunque se apunte en «Cualquier súper».
  if (especialidad(stores.find((s) => s.id === k))) return null;
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

const PREP = new Set(["de", "del", "en", "al", "para"]);
const ART = new Set(["el", "la", "los", "las"]);
/** Nombre de tienda mal oído al dictar («frutiría», «lipercor» por «del Hipercor», «las armacias»): se acepta
 *  detrás de una preposición si se parece mucho a un alias de una sola palabra. Devuelve { store, len } o null. */
export function fuzzyStoreAt(w, i, stores) {
  if (!PREP.has(w[i])) return null;
  let j = i + 1;
  if (ART.has(w[j])) j++;
  const x = w[j];
  if (!x || x.length < 4) return null;
  let best = null, bd = 9;
  for (const st of stores || []) for (const a of storeAliases(st)) {
    if (a.includes(" ") || a.length < 4) continue;
    const cands = [x];
    if (x[0] === "l" && (w[i] === "de" || w[i] === "del")) cands.push(x.slice(1)); // «de lipercor» = «del hipercor»
    for (const c of cands) {
      const d = lev(c, a) / Math.max(c.length, a.length);
      if (d < bd) { bd = d; best = st; }
    }
  }
  return best && bd <= 0.25 ? { store: best, len: j - i + 1 } : null;
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
    if (!explicit) {
      const w = t.trim().split(" ");
      for (let i = 1; i < w.length; i++) {
        const f = fuzzyStoreAt(w, i, stores);
        if (f) { storeId = f.store.id; explicit = true; w.splice(i, f.len); t = " " + w.join(" ") + " "; break; }
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

  let hit = matchProduct(t, products);
  const e = { raw: String(raw).replace(/\s+/g, " ").trim(), q: t, include: true, showAll: false, explicit, lucia };
  // Que el nombre esté dentro de otro producto («vino blanco» en «Vino blanco cocinar») no quiere decir que sea
  // el mismo: se trata como nuevo y la hoja pregunta si es ese o es otro.
  if (hit && hit.partial) { e.maybe = { id: hit.product.id, name: hit.product.name }; hit = null; }
  if (hit) {
    const p = hit.product;
    e.productId = p.id; e.name = p.name; e.category = lucia ? "lucia" : p.category; e.known = true;
    e.corrected = !hit.exact && !hit.partial ? shown : null;
    e.storeId = explicit ? (generic ? null : storeId) : p.storeId ?? null;
    e.habitual = p.storeId ?? null;
    e.ask = !explicit && p.storeId ? { storeId: p.storeId, kind: "habit" } : null;
  } else {
    e.productId = null; e.name = cap(shown); e.category = lucia ? "lucia" : guessCategory(t); e.known = false; e.corrected = null;
    const h = explicit ? null : categoryHabit(e.category, products, stores);
    e.storeId = explicit ? (generic ? null : storeId) : h;
    e.habitual = null;
    e.ask = h ? { storeId: h, kind: "new" } : null;
  }
  const k = nameKey(e.name);
  e.dup = pending.some((i) => nameKey(i.name) === k);
  if (e.dup) e.include = false;
  return e;
}

// Palabras de relleno que, sueltas entre productos, no son un producto nuevo («este», «pues»…).
const STOP = new Set("este esta esto eso ese pues bueno vale venga oye mira que como y e o de del la el los las lo un una unos unas me nos te hace hacen falta es son a al en con por para mas tambien todo toda todos todas otro otra ya si no hay algo".split(" "));
const isModifierAt = (w, i, ctx) => {
  // «para la niña», «de Lucía», «del bebé» y «de/del/en (la/el) + tienda» acompañan al producto anterior.
  const rest = " " + w.slice(i).join(" ") + " ";
  const m = rest.match(/^ (?:de|para|del|a) (?:la |el |mi |nuestra )?(?:nina|nena|bebe|peque|lucia|chiqui) /);
  if (m) return m[0].trim().split(" ").length;
  const m2 = rest.match(/^ (?:de|en|del|en el|en la|para) (?:cualquier|cualquiera) (?:sitio|super|supermercado|lado|tienda|parte) /);
  if (m2) return m2[0].trim().split(" ").length;
  for (const st of ctx.stores || []) for (const a of storeAliases(st)) {
    const r = rest.match(new RegExp(`^ (?:(?:de|del|en|al|para) )?(?:(?:el|la|los) )?${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} `));
    if (r && !/^ (?:el|la|los) /.test(r[0]) && (/^ (?:de|del|en|al|para) /.test(r[0]))) return r[0].trim().split(" ").length;
  }
  const f = fuzzyStoreAt(w, i, ctx.stores);
  return f ? f.len : 0;
};
/** Al hablar no se dictan comas: «leche pan de la panadería» se separa reconociendo los productos de la despensa
 *  (el más largo primero), pegando a cada uno lo que le acompaña y dejando como producto nuevo lo que quede entre medias. */
export function segmentChunk(chunk, ctx) {
  const raw = String(chunk).trim().split(/\s+/);
  const w = raw.map((x) => norm(x)).filter(Boolean);
  if (w.length < 2 || !(ctx.products || []).length) return [chunk];
  const segs = []; // {words:[...originales], known:bool}
  let unknown = [];
  const flush = () => {
    const content = unknown.filter((x) => !STOP.has(norm(x)));
    if (content.length) segs.push({ words: unknown.slice(), known: false });
    unknown = [];
  };
  let i = 0;
  while (i < w.length) {
    const mod = segs.length || unknown.length ? isModifierAt(w, i, ctx) : 0;
    if (mod) {
      flush();
      if (segs.length) segs[segs.length - 1].words.push(...raw.slice(i, i + mod));
      i += mod; continue;
    }
    let hitLen = 0;
    for (let L = Math.min(5, w.length - i); L >= 1; L--) {
      const q = w.slice(i, i + L).join(" ");
      if (q.length < 3 || STOP.has(q)) continue;
      if (L > 1 && STOP.has(w[i + L - 1])) continue;
      const h = matchProduct(stripQuantity(q), ctx.products);
      if (h && h.score <= 0.2) { hitLen = L; break; }
    }
    // Dos productos pegados en una palabra al dictar («lechepan» = leche + pan).
    let glued = null;
    if (!hitLen && w[i].length >= 6 && !STOP.has(w[i])) {
      for (let k = 3; k <= w[i].length - 3 && !glued; k++) {
        const a = matchProduct(w[i].slice(0, k), ctx.products), b = matchProduct(w[i].slice(k), ctx.products);
        if (a && b && a.score <= 0.15 && b.score <= 0.15 && a.product !== b.product) glued = [a.product.name, b.product.name];
      }
    }
    if (hitLen) {
      flush();
      segs.push({ words: raw.slice(i, i + hitLen), known: true });
      i += hitLen;
    } else if (glued) {
      flush();
      segs.push({ words: [glued[0]], known: true }, { words: [glued[1]], known: true });
      i++;
    } else { unknown.push(raw[i]); i++; }
  }
  flush();
  // Solo se separa si de verdad hay más de un producto y al menos uno es conocido.
  if (segs.length < 2 || !segs.some((s) => s.known)) return [chunk];
  return segs.map((s) => s.words.join(" "));
}

// Muletillas del principio que el dictado deforma («abunta», «la punta», «desecito»).
const LEAD = ["apunta", "apuntame", "apuntad", "necesito", "necesitamos", "anade", "anademe", "ponme"];
export function dropLeadFiller(text, products = []) {
  const ws = String(text).trim().split(/\s+/);
  let k = 0;
  while (k < ws.length - 1 && k < 2 && STOP.has(norm(ws[k]))) k++;
  const x = norm(ws[k] || "");
  if (k < ws.length - 1 && x.length >= 5 && !matchProduct(x, products) && LEAD.some((f) => lev(x, f) / Math.max(x.length, f.length) <= 0.4)) return ws.slice(k + 1).join(" ");
  return text;
}

/** opts.voice: lo dictado no trae comas fiables, así que además se separa reconociendo productos
 *  («leche pan de la panadería»). Lo escrito no se separa así: «tomate frito» es un producto, no dos. */
export function parseUtterance(text, ctx, opts = {}) {
  const out = [];
  if (opts.voice) text = dropLeadFiller(text, ctx.products || []);
  const chunks = splitUtterance(text);
  for (const chunk of opts.voice ? chunks.flatMap((c) => segmentChunk(c, ctx)) : chunks) {
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
  // Solo productos que ya están en la despensa: lo nuevo siempre pasa por la hoja para revisar categoría y tienda.
  return entries.length > 0 && entries.every((e) => e.known && !e.corrected && !e.dup && !e.maybe);
}

const CMD_RE = / (he|hemos|ya|e) (comprado|cogido|pillado|tengo|tenemos|compre|compramos)| (ya esta|ya estan|ya lo tengo) |^ (tacha|marca) | (comprado|cogido) (todo|toda|todos|todas) /;

/** «He comprado todo lo de Mercadona menos los huevos». Devuelve null si no es una orden de tachado. */
export function parseCommand(text, ctx) {
  const { stores, pending } = ctx;
  const t = " " + norm(text).replace(/,/g, " , ") + " ";
  if (!CMD_RE.test(t)) return null;
  let store = null;
  for (const st of stores) for (const a of storeAliases(st)) if (!store && t.includes(" " + a + " ")) store = st;
  if (!store) {
    const w = t.trim().split(/\s+/);
    for (let i = 0; i < w.length && !store; i++) { const f = fuzzyStoreAt(w, i, stores); if (f) store = f.store; }
  }
  const target = store || ctx.store || null;
  const base = pending.filter((i) => inStore(i, target, stores));
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
  const targets = / (todo|toda|todos|todas) /.test(main) ? base : findIn(main, pending);
  const ex = exc ? findIn(exc, targets) : [];
  if (!targets.length) return null;
  return { storeId: target ? target.id : null, text, rows: targets.map((i) => ({ id: i.id, on: !ex.includes(i), ex: ex.includes(i) })) };
}

export function categoryLabel(k) { return (CAT[k] || CAT.otros).l; }
