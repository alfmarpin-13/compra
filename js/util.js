// Utilidades sin dependencias: texto, distancias y fechas en Europe/Madrid.

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Minúsculas, sin tildes ni signos; espacios simples. La «ñ» pasa a «n». */
export const norm = (s) =>
  String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ,]/g, " ").replace(/\s+/g, " ").trim();

/** Clave para buscar y evitar duplicados en la despensa. */
export const nameKey = (s) => norm(s).replace(/,/g, " ").replace(/\s+/g, " ").trim();

/** Singular aproximado en español: «plátanos» → «platano», «pimientos» → «pimiento», «limones» → «limon». */
export function sing(w) {
  if (w.length <= 3) return w;
  if (/ces$/.test(w) && w.length > 4) return w.slice(0, -3) + "z";
  if (/[lnrdjy]es$/.test(w) && w.length > 4) return w.slice(0, -2);
  if (w.endsWith("s")) return w.slice(0, -1);
  return w;
}
export const singAll = (s) => s.split(" ").map(sing).join(" ");

export function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let p = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const c = [i];
    for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    p = c;
  }
  return p[n];
}

/** Nombre limpio: sin espacios al principio ni al final y sin espacios dobles. */
export const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** ¿Aparece la palabra clave al inicio de una palabra del texto? Las claves cortas deben ser palabra completa. */
export function hasWord(text, w) {
  const t = " " + text + " ";
  if (w.length <= 3) return t.includes(" " + w + " ");
  return t.includes(" " + w);
}
/** Mejor coincidencia (la más larga) de un diccionario palabra → valor. */
export function bestKeyword(text, dict) {
  const t = singAll(norm(text)), raw = norm(text);
  let best = null, len = 0;
  for (const [w, v] of dict) {
    if (w.length > len && (hasWord(t, w) || hasWord(raw, w))) { best = v; len = w.length; }
  }
  return best;
}

/* ---------- Fechas en Europe/Madrid ---------- */
const TZ = "Europe/Madrid";
const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
function parts(ms) {
  const o = {};
  for (const p of fmt.formatToParts(new Date(ms))) o[p.type] = p.value;
  return o;
}
/** "2026-11-19" del día en Madrid. */
export function dayKey(ms) { const p = parts(ms); return `${p.year}-${p.month}-${p.day}`; }
function offsetAt(ms) {
  const p = parts(ms);
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(ms / 1000) * 1000;
}
/** Instante (ms) de las 00:00 en Madrid del día de `ms`. */
export function startOfDay(ms) {
  const [y, m, d] = dayKey(ms).split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - offsetAt(guess);
  t = guess - offsetAt(t);
  return t;
}
/** Días de calendario entre dos claves de día. */
export function daysBetween(k1, k2) {
  const a = Date.UTC(...k1.split("-").map((x, i) => (i === 1 ? x - 1 : +x)));
  const b = Date.UTC(...k2.split("-").map((x, i) => (i === 1 ? x - 1 : +x)));
  return Math.round((b - a) / 864e5);
}
export function dayLabel(k, now = Date.now()) {
  const today = dayKey(now);
  const diff = daysBetween(k, today);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  const [y, m, d] = k.split("-").map(Number);
  const s = new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("es-ES", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });
  return cap(s);
}

export function median(xs) {
  const s = [...xs].sort((a, b) => a - b), n = s.length;
  if (!n) return 0;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
