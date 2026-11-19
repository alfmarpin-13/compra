// Compra · lista de la compra compartida. Interfaz y lógica de la app.
import { firebaseConfig, isConfigured } from "./config.js";
import { APP_VERSION, APP_DATE } from "./version.js";
import * as DB from "./db.js";
import { CATS, CAT, GENERIC, USERS, ICON_KW, STORE_ICON_KW } from "./data.js";
import { LUCIDE, OPENMOJI } from "./iconos.js";
import { esc, norm, nameKey, singAll, lev, cap, plural, bestKeyword, dayKey, daysBetween, dayLabel, median } from "./util.js";
import { parseUtterance, parseCommand, isClear, inStore, matchProduct, guessCategory as guessCat } from "./parser.js";

/* ===================================================================
   Iconos
   =================================================================== */
const ICON_LIST = Object.entries(ICON_KW);
const STORE_ICON_LIST = Object.entries(STORE_ICON_KW);
function ic(name, size = 24, cls = "") {
  const inner = LUCIDE[name] || LUCIDE["shopping-basket"];
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
const LOGO = (px, label) => `<svg width="${px}" height="${px}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#D9F56E"/><path d="M27 50C27 21 73 21 73 50" fill="none" stroke="#1C3A2D" stroke-width="7" stroke-linecap="round"/><path d="M21 57H79L72.5 82.5Q71.4 87 66.8 87H33.2Q28.6 87 27.5 82.5Z" fill="#1C3A2D"/><g stroke="#D9F56E" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M24 66.5H76M26.3 76.5H73.7"/><path d="M33 59.5 34.6 84.5M44.3 59.5 45 84.5M55.7 59.5 55 84.5M67 59.5 65.4 84.5"/></g><rect x="15" y="46" width="70" height="11" rx="5.5" fill="#1C3A2D"/></svg>`;
export const iconKeyFor = (name) => bestKeyword(name, ICON_LIST);
function pic(name, category, iconKey) {
  const k = iconKey && OPENMOJI[iconKey] ? iconKey : iconKeyFor(name);
  if (k && OPENMOJI[k]) return `<svg viewBox="4 4 64 64" aria-hidden="true">${OPENMOJI[k]}</svg>`;
  return ic((CAT[category] || CAT.otros).g, 30);
}
const catStyle = (c) => { const C = CAT[c] || CAT.otros; return `--cl:${C.cl};--cd:${C.cd}`; };
function cico(c, size = 18, extra = "") { const C = CAT[c] || CAT.otros; return `<span class="cico" style="${catStyle(c)};${extra}">${ic(C.g, size)}</span>`; }

/* ===================================================================
   Estado
   =================================================================== */
const LS = {
  get(k, d) { try { const v = localStorage.getItem("compra." + k); return v == null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("compra." + k, v); } catch (e) {} },
};
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

const S = {
  phase: "boot", me: "", meKey: "", loginErr: false, loginBusy: false, remember: true,
  view: "list", store: null, layout: LS.get("layout", "grid"), theme: LS.get("theme", "system"), checkedOpen: false,
  stores: [], products: [], pending: [], today: [], history: [], historyLoaded: false,
  ready: { stores: false, products: false, pending: false },
  capture: "idle", draft: "", partial: "",
  sheet: null, menu: false, band: null, pantryQ: "", histQ: "", histSel: new Set(),
  fresh: new Set(),
};
let sub = null;

const otherName = () => (S.meKey === "alfonso" ? "Mariluz" : "Alfonso");
const storeById = (id) => (id ? S.stores.find((s) => s.id === id) || null : null);
const storeName = (id) => storeById(id)?.name || GENERIC;
const productById = (id) => (id ? S.products.find((p) => p.id === id) || null : null);
const productByKey = (k) => S.products.find((p) => p.nameKey === k) || null;
const productOf = (i) => productById(i.productId) || productByKey(nameKey(i.name));
const pendingFor = (p) => S.pending.find((i) => i.productId === p.id || nameKey(i.name) === p.nameKey);
const currentStore = () => storeById(S.store);
const visible = (rows) => rows.filter((i) => inStore(i, currentStore()));
const sortAdded = (a, b) => (a.addedAt || 0) - (b.addedAt || 0) || a.name.localeCompare(b.name, "es");

/* ---------- Os toca reponer (5.8) ---------- */
let statsCache = null;
function purchaseStats() {
  if (statsCache) return statsCache;
  const byKey = new Map();
  for (const i of [...S.history, ...S.today]) {
    if (!i.checkedAt) continue;
    const p = productOf(i);
    const k = p ? p.id : "k:" + nameKey(i.name);
    if (!byKey.has(k)) byKey.set(k, new Set());
    byKey.get(k).add(dayKey(i.checkedAt));
  }
  const today = dayKey(Date.now());
  const out = new Map();
  for (const [k, set] of byKey) {
    const days = [...set].sort();
    const last = days[days.length - 1];
    const since = daysBetween(last, today);
    let every = null;
    if (days.length >= 2) {
      const gaps = days.slice(1).map((d, ix) => daysBetween(days[ix], d));
      every = Math.max(1, Math.round(median(gaps)));
    }
    out.set(k, { count: days.length, last, since, every });
  }
  statsCache = out;
  return out;
}
const statsFor = (p) => purchaseStats().get(p.id) || null;
function isDue(p) {
  const st = statsFor(p);
  return !!(st && st.every && st.since >= 0.9 * st.every);
}
function dueList() {
  return S.products.filter((p) => isDue(p) && !pendingFor(p))
    .sort((a, b) => { const x = statsFor(a), y = statsFor(b); return y.since / y.every - x.since / x.every; });
}

/* ===================================================================
   Render con «morph»: actualiza el DOM sin recrearlo para no perder el foco,
   el desplazamiento ni repetir animaciones.
   =================================================================== */
const root = document.getElementById("root");
function morphNode(x, y) {
  if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName || (x.nodeType === 1 && (x.dataset.key || "") !== (y.dataset.key || ""))) { x.replaceWith(y); return; }
  if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
  for (const a of y.attributes) if (x.getAttribute(a.name) !== a.value) x.setAttribute(a.name, a.value);
  for (const a of [...x.attributes]) if (!y.hasAttribute(a.name)) x.removeAttribute(a.name);
  if (x.nodeName === "INPUT") {
    if (x.type === "checkbox") x.checked = y.hasAttribute("checked");
    else if (document.activeElement !== x) { const v = y.getAttribute("value") ?? ""; if (x.value !== v) x.value = v; }
    return;
  }
  morphChildren(x, y);
}
function morphChildren(from, to) {
  const keyed = new Map();
  for (const c of from.children) if (c.dataset.key) keyed.set(c.dataset.key, c);
  let cur = from.firstChild;
  for (const y of [...to.childNodes]) {
    const k = y.nodeType === 1 ? y.dataset.key : undefined;
    let x = null;
    if (k) { x = keyed.get(k) || null; if (x) keyed.delete(k); }
    else { while (cur && cur.nodeType === 1 && cur.dataset.key) cur = cur.nextSibling; x = cur; }
    if (!x) { from.insertBefore(y, cur); continue; }
    if (x === cur) cur = cur.nextSibling; else from.insertBefore(x, cur);
    morphNode(x, y);
  }
  while (cur) { const n = cur.nextSibling; if (!(cur.nodeType === 1 && cur.dataset.key)) cur.remove(); cur = n; }
  for (const n of keyed.values()) n.remove();
}
const tpl = document.createElement("template");
function render() {
  statsCache = null;
  applyTheme();
  let h = "";
  // Al arrancar se pinta ya la cabecera en su sitio, para que el logo no salte al cargar.
  if (S.phase === "boot") h = `<div class="scr" data-key="list"><div class="hb"><div class="hb-t"><span class="hb-brand">${LOGO(32)}<span class="hb-name">Compra</span></span></div></div></div>`;
  else if (S.phase === "setup") h = vSetup();
  else if (S.phase === "login") h = vLogin();
  else if (S.view === "pantry") h = vPantry();
  else if (S.view === "history") h = vHistory();
  else h = vList();
  if (S.phase === "app") {
    if (S.menu) h += vMenu();
    if (S.sheet) h += vSheet();
  }
  tpl.innerHTML = h;
  morphChildren(root, tpl.content);
}
function renderPartial() {
  const p = root.querySelector(".partial");
  if (p) { p.innerHTML = esc(S.partial) + '<span class="caret"></span>'; const l = root.querySelector(".list"); if (l) l.scrollTop = l.scrollHeight; }
}

// Color de la barra de estado del iPhone (theme-color). Con una hoja abierta se oscurece igual que el velo:
// claro = 32 % de tinta sobre el fondo; oscuro = 55 % de negro sobre el fondo.
const BAR = { light: "#F3F4EE", dark: "#0E1511", lightDim: "#ABB0AA", darkDim: "#060908" };
function applyTheme() {
  const dark = S.theme === "dark" || (S.theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const t = dark ? "dark" : "light";
  if (document.documentElement.dataset.theme !== t) document.documentElement.dataset.theme = t;
  const dim = S.phase === "app" && !!S.sheet;
  const color = BAR[t + (dim ? "Dim" : "")];
  const m = document.querySelector('meta[name="theme-color"]');
  if (m && m.content !== color) m.content = color;
}

/* ===================================================================
   Vistas
   =================================================================== */
function vSetup() {
  return `<div class="scr" data-key="setup"><div class="setup">
    <div class="wordmark">${LOGO(44, "Compra")}<span>Compra<span class="dotc">.</span></span></div>
    <h1 class="stitle">Falta conectar Firebase</h1>
    <p class="help">Pega la configuración web de tu proyecto en <code>js/config.js</code> y vuelve a cargar. Los pasos están en el README del repositorio.</p>
  </div></div>`;
}

function vLogin() {
  return `<div class="scr" data-key="login"><div class="login">
    <div class="wordmark">${LOGO(44, "Compra")}<span>Compra<span class="dotc">.</span></span></div>
    <h1>La lista de casa, en los dos teléfonos.</h1>
    <p class="lede">Lo que apuntéis aparece al momento para Alfonso y Mariluz, en el iPhone o en el ordenador.</p>
    <form id="loginForm" novalidate>
      <div class="field"><label for="lu">Usuario</label><input id="lu" name="username" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="alfonso o mariluz" value=""></div>
      <div class="field"><label for="lp">Contraseña</label><input id="lp" name="password" type="password" autocomplete="current-password" placeholder="Contraseña" value=""></div>
      ${S.loginErr ? `<p class="err" role="alert">No se ha podido verificar el usuario o la contraseña.</p>` : ""}
      <label class="remember"><input type="checkbox" id="remember" ${S.remember ? "checked" : ""}><span class="mini-ck ${S.remember ? "on" : ""}">${S.remember ? ic("check", 14) : ""}</span>Recordarme en este iPhone</label>
      <button class="btn fill tall" type="submit" ${S.loginBusy ? "disabled" : ""}>${S.loginBusy ? "Entrando…" : "Entrar"}</button>
    </form>
    <p class="note"><span class="sd"></span>Solo vosotros dos. Sin cuenta, nadie ve la lista aunque tenga el enlace.</p>
  </div></div>`;
}

function vHeader() {
  return `<div class="hb"><div class="hb-t"><span class="hb-brand">${LOGO(32)}<span class="hb-name">Compra</span></span></div>
    <div class="hb-r">
      <button class="ib sm" data-act="layout" aria-label="${S.layout === "grid" ? "Ver como lista" : "Ver como casillas"}">${ic(S.layout === "grid" ? "list" : "layout-grid", 20)}</button>
      <button class="ib sm" data-act="history" aria-label="Historial">${ic("history", 20)}</button>
      <button class="ib sm" data-act="menu" aria-label="Más opciones" aria-expanded="${S.menu}">${ic("ellipsis-vertical", 20)}</button>
    </div></div>`;
}
// Iconos que se pueden elegir para una tienda.
const STORE_ICONS = ["store", "shopping-basket", "croissant", "wheat", "cake-slice", "apple", "carrot", "beef", "drumstick", "fish", "ham", "cheese", "milk", "coffee", "wine", "pill", "spray-can", "baby", "leaf", "house"];
const autoStoreIcon = (name, kind) => (kind === "generic" ? "store" : bestKeyword(name, STORE_ICON_LIST) || "store");
// Logos de tienda en una sola tinta (se pintan con el color del texto mediante una máscara).
const LOGOS = {
  "logo-mercadona": { file: "icons/tiendas/mercadona.png", r: 1.27, match: "mercadona" },
  "logo-hipercor": { file: "icons/tiendas/hipercor.png", r: 1.77, match: "hipercor" },
  "logo-lidl": { file: "icons/tiendas/lidl.png", r: 2.53, match: "lidl" },
  "logo-domi-velez": { file: "icons/tiendas/domi-velez.png", r: 2.875, match: "domi velez" },
};
const autoLogo = (name) => Object.keys(LOGOS).find((k) => (" " + nameKey(name) + " ").includes(" " + LOGOS[k].match + " ")) || null;
const logoSpan = (key, big) => `<span class="slot logo${big ? " lg" : ""}" style="--logo:url('${LOGOS[key].file}');--r:${LOGOS[key].r}" aria-hidden="true"></span>`;
const storeIcon = (st) => (st.icon && LUCIDE[st.icon] ? st.icon : autoStoreIcon(st.name, st.kind));
function slot(id, big) {
  const st = storeById(id);
  if (!st) return "";
  const logo = st.icon && LOGOS[st.icon] ? st.icon : !st.icon ? autoLogo(st.name) : null;
  if (logo) return logoSpan(logo, big);
  const g = storeIcon(st);
  // Sin logo: el icono a una tinta, del mismo tamaño que los logos y sin recuadro.
  return `<span class="slot${big ? " lg" : ""}" aria-hidden="true">${ic(g, big ? 26 : 17)}</span>`;
}
function vChips() {
  const count = (st) => S.pending.filter((i) => inStore(i, st)).length;
  const shown = S.stores.filter((s) => s.id === S.store || S.pending.some((i) => i.storeId === s.id));
  return `<div class="chips" role="tablist" aria-label="Tiendas">
    <button class="chip ${!S.store ? "on" : ""}" role="tab" aria-selected="${!S.store}" data-act="store" data-k="">Todas<span class="n">${count(null)}</span></button>
    ${shown.map((s) => `<button class="chip ${S.store === s.id ? "on" : ""}" role="tab" aria-selected="${S.store === s.id}" data-act="store" data-k="${esc(s.id)}" data-key="chip-${esc(s.id)}">${slot(s.id)}${esc(s.name)}<span class="n">${count(s)}</span></button>`).join("")}
  </div>`;
}
function groupRows(rows) {
  const by = {};
  rows.forEach((r) => (by[CAT[r.category] ? r.category : "otros"] ||= []).push(r));
  return CATS.filter((c) => by[c.k]).map((c) => [c, by[c.k]]);
}
const byOther = (i) => i.addedBy && S.me && i.addedBy !== S.me;
function vRow(i) {
  const st = i.storeId && storeById(i.storeId) ? `${slot(i.storeId)}${esc(storeName(i.storeId))}` : esc(GENERIC);
  const by = byOther(i) ? `<span class="by">· ${esc(i.addedBy)}</span>` : "";
  return `<div class="row ${i.checked ? "done" : ""} ${S.fresh.has(i.id) ? "fresh" : ""}" data-key="${i.id}" data-id="${i.id}" role="checkbox" aria-checked="${i.checked}" tabindex="0">
    <span class="ck">${i.checked ? ic("check", 16) : ""}</span>
    <div class="rinfo"><div class="nm">${esc(i.name)}</div><div class="st">${st}${by}</div></div>
    <button class="edb" data-act="edit" data-id="${i.id}" aria-label="Editar ${esc(i.name)}">${ic("pencil", 15)}</button></div>`;
}
function vTile(i) {
  const st = storeById(i.storeId);
  const p = productOf(i);
  return `<div class="tile ${i.checked ? "done" : ""} ${S.fresh.has(i.id) ? "fresh" : ""}" style="${catStyle(i.category)}" data-key="${i.id}" data-id="${i.id}" role="checkbox" aria-checked="${i.checked}" aria-label="${esc(i.name)}${st ? ", " + esc(st.name) : ""}" tabindex="0">
    ${byOther(i) ? `<span class="tby" title="Lo apuntó ${esc(i.addedBy)}">${esc(i.addedBy.charAt(0))}</span>` : ""}<button class="edb" data-act="edit" data-id="${i.id}" aria-label="Editar ${esc(i.name)}">${ic("pencil", 15)}</button>
    <span class="tic">${pic(i.name, i.category, p?.icon)}</span>
    <span class="tnm">${esc(i.name)}</span>${st ? `<span class="tsub">${esc(st.name)}</span>` : ""}</div>`;
}
const block = (rows, key) => (S.layout === "grid" ? `<div class="tgrid" data-key="${key}">${rows.map(vTile).join("")}</div>` : `<div class="group" data-key="${key}">${rows.map(vRow).join("")}</div>`);

function vList() {
  const pend = visible(S.pending).sort(sortAdded);
  const done = visible(S.today).sort((a, b) => b.checkedAt - a.checkedAt);
  let body = "";
  if (!S.ready.pending) body = "";
  else if (!pend.length && !done.length && S.capture !== "listening") {
    body = S.store
      ? `<p class="storeempty">No hay artículos para ${esc(storeName(S.store))}. Elige Todas para ver el resto.</p>`
      : `<div class="empty"><h2>Añade tu primer artículo</h2><p>Escribe abajo o toca el micro y habla.</p></div>`;
  } else {
    body = groupRows(pend).map(([c, rows]) => `<div class="cath" data-key="h-${c.k}">${cico(c.k)}<span class="catl">${esc(c.l)}</span><span class="cnt">${rows.length}</span></div>${block(rows, "g-" + c.k)}`).join("");
    if (S.capture === "listening") body += `<div class="partial" data-key="partial" aria-live="polite">${esc(S.partial)}<span class="caret"></span></div>`;
    if (done.length) {
      body += `<button class="chkdiv" data-key="donediv" data-act="toggleChecked" aria-expanded="${S.checkedOpen}"><i></i><span>Comprado hoy · ${done.length}</span>${ic("chevron-down", 16)}<i></i></button>`;
      if (S.checkedOpen) body += `${block(done, "done")}<p class="donehint" data-key="donehint">Toca uno para devolverlo a la lista. Mañana pasa solo al historial.</p>`;
    }
  }
  return `<div class="scr" data-key="main">
    ${vHeader()}
    ${vTabs()}
    <div class="folder first" data-key="folder-list">
      ${vChips()}
      <div class="list">${body}</div>
    </div>
    ${S.capture === "typing" ? `<div class="catcher" data-act="closeDraft"></div>` : ""}
    ${S.band ? vBand() : ""}
    ${vDock()}
  </div>`;
}
/** Pestañas de archivador: Lista y Despensa, pegadas a la carpeta de abajo. */
function vTabs() {
  const list = S.view !== "pantry";
  return `<div class="tabs" role="tablist">
    <button class="tab ${list ? "on" : ""}" role="tab" aria-selected="${list}" data-act="tabList">Lista<span class="n">${S.pending.length}</span></button>
    <button class="tab ${!list ? "on" : ""}" role="tab" aria-selected="${!list}" data-act="pantry">Despensa<span class="n">${S.products.length}</span></button>
  </div>`;
}
function vBand() {
  const b = S.band;
  return `<div class="band" data-key="band-${b.n}" role="status"><div class="top"><div class="msg">${esc(b.msg)}</div><button class="x" data-act="closeBand" aria-label="Cerrar aviso">${ic("x", 22)}</button></div>
    ${b.undo ? `<div class="acts"><button class="tbtn" data-act="undo">Deshacer</button></div>` : `<div style="height:8px"></div>`}</div>`;
}
function sugChoices() {
  const q = singAll(norm(S.draft));
  const due = dueList();
  if (!q) return due.slice(0, 8);
  const score = (p) => { const t = singAll(p.nameKey); return t.startsWith(q) ? 0 : (" " + t).includes(" " + q) ? 0.1 : lev(q, t.slice(0, q.length + 1)) / Math.max(q.length, 3); };
  const ok = S.products.map((p) => [score(p), p]).filter(([d, p]) => d <= 0.34 && !pendingFor(p));
  const dueSet = new Set(due.map((p) => p.id));
  ok.sort((a, b) => (dueSet.has(b[1].id) - dueSet.has(a[1].id)) || a[0] - b[0] || a[1].name.localeCompare(b[1].name, "es"));
  return ok.map((x) => x[1]).slice(0, 8);
}
function vSug() {
  const xs = sugChoices();
  if (!xs.length) return "";
  const allDue = xs.every(isDue);
  return `<p class="from">${!S.draft || allDue ? "Os toca reponer" : "De la despensa"}</p><div class="sug">${xs.map((p) => `<button class="chip sm" data-act="quick" data-k="${esc(p.id)}">${p.storeId ? slot(p.storeId) : ""}${esc(p.name)}</button>`).join("")}</div>`;
}
function vDock() {
  if (S.capture === "typing") {
    const side = ""; // escribiendo no hay micro: solo el campo, «Añadir» y la X
    return `<div class="dock" data-key="dock-typing"><div class="draft"><div id="sug">${vSug()}</div>
      <form class="line" id="draftForm"><input id="draft" value="${esc(S.draft)}" placeholder="Escribe qué necesitas" aria-label="Escribe qué necesitas" autocomplete="off" autocorrect="on" enterkeyhint="done">
      <button class="tbtn" type="submit" id="draftSubmit" ${S.draft.trim() ? "" : "disabled"}>Añadir</button>
      <button class="dclose" type="button" data-act="closeDraft" aria-label="Cerrar">${ic("x", 20)}</button></form></div>
      ${side}</div>`;
  }
  const on = S.capture === "listening";
  // Micro a la derecha: botón redondo solo con el icono; al escuchar se ensancha y pide tocar para parar.
  const voiceBtn = `<button class="dk-voice ${on ? "on" : ""}" data-act="voice" aria-label="${on ? "Escuchando. Toca para parar" : "Toca y habla"}">${ic("mic", 22, "mic")}${on ? `<span>Escuchando…<small>toca para parar</small></span>` : ""}</button>`;
  return `<div class="dock ${on ? "listening" : ""}" data-key="dock">
    <button class="dk-add" data-act="type" aria-label="Añadir">${ic("plus", 20)}<span>Añadir</span></button>
    ${voiceBtn}</div>`;
}
function vMenu() {
  return `<div class="mscrim" data-act="closeMenu" data-key="mscrim"></div><div class="menu" role="menu" data-key="menu">
   <button role="menuitem" data-act="stores">${ic("store", 20)}Tiendas</button>
   <button role="menuitem" data-act="pantry">${ic("shelving-unit", 20)}Despensa</button>
   <button role="menuitem" data-act="review1">${ic("rotate-ccw", 20)}Repasar la despensa</button>
   <button role="menuitem" data-act="history">${ic("history", 20)}Historial</button>
   <hr>
   <button role="menuitem" data-act="share">${ic("users", 20)}Compartida con ${esc(otherName())}</button>
   <button role="menuitem" data-act="prefs">${ic("sliders-horizontal", 20)}Preferencias</button>
   <button role="menuitem" data-act="logout">${ic("log-out", 20)}Cerrar sesión</button>
   <p class="mver">Versión ${APP_VERSION}</p></div>`;
}

/* --- Despensa --- */
function vPantryRow(p) {
  const on = !!pendingFor(p), due = isDue(p), st = statsFor(p);
  return `<div class="prow tap" data-key="pr-${p.id}" data-act="ptoggle" data-k="${esc(p.id)}" role="checkbox" aria-checked="${on}" tabindex="0">
    <span class="mini-ck ${on ? "on" : ""}" style="margin-top:4px">${on ? ic("check", 14) : ""}</span>
    <div class="pmain"><div class="pname">${esc(p.name)}</div>
      <div class="st" style="margin-top:2px">${p.storeId && storeById(p.storeId) ? slot(p.storeId) + esc(storeName(p.storeId)) : esc(GENERIC)}${st?.every ? `<span class="by">· cada ${plural(st.every, "día", "días")}</span>` : ""}</div></div>
    ${due && !on ? `<span class="due">Toca</span>` : on ? `<span class="labelsm" style="align-self:center">En la lista</span>` : ""}<button class="edb" data-act="pedit" data-k="${esc(p.id)}" aria-label="Editar ${esc(p.name)}">${ic("pencil", 15)}</button></div>`;
}
function vPTile(p) {
  const on = !!pendingFor(p), due = isDue(p);
  return `<div class="tile ptile ${on ? "on" : ""}" style="${catStyle(p.category)}" data-key="pt-${p.id}" data-act="ptoggle" data-k="${esc(p.id)}" role="checkbox" aria-checked="${on}" aria-label="${esc(p.name)}" tabindex="0">
    ${on ? `<span class="tok">${ic("check", 12)}</span>` : ""}${due && !on ? `<span class="tdue">Toca</span>` : ""}<button class="edb" data-act="pedit" data-k="${esc(p.id)}" aria-label="Editar ${esc(p.name)}">${ic("pencil", 15)}</button>
    <span class="tic">${pic(p.name, p.category, p.icon)}</span>
    <span class="tnm">${esc(p.name)}</span><span class="tsub">${esc(p.storeId && storeById(p.storeId) ? storeName(p.storeId) : GENERIC)}</span></div>`;
}
const pblock = (rows, key) => (S.layout === "grid" ? `<div class="tgrid" data-key="${key}">${rows.map(vPTile).join("")}</div>` : `<div class="card" data-key="${key}">${rows.map(vPantryRow).join("")}</div>`);
function vPantry() {
  const q = singAll(norm(S.pantryQ));
  const all = [...S.products].sort((a, b) => a.name.localeCompare(b.name, "es"));
  const list = all.filter((p) => !q || singAll(p.nameKey).includes(q) || (q.length >= 4 && matchProduct(q, [p])));
  const due = q ? [] : dueList();
  return `<div class="scr" data-key="main">
   ${vHeader()}
   ${vTabs()}
   <div class="folder" data-key="folder-pantry">
   <div class="srow2"><label class="srch">${ic("search", 18)}<input id="pq" type="search" value="${esc(S.pantryQ)}" placeholder="Buscar entre ${plural(S.products.length, "producto", "productos")}" aria-label="Buscar en la despensa" autocomplete="off"></label><button class="ib sm newp" data-act="pnew" aria-label="Nuevo producto">${ic("plus", 22)}</button></div>
   <div class="pad">
    ${due.length ? `<div class="cath sec2" data-key="due-h"><span class="cico" style="--cl:var(--ink);--cd:var(--ink)">${ic("rotate-ccw", 16)}</span><span class="catl">Os toca reponer</span><button class="tbtn" data-act="review1">Repasar</button></div>${pblock(due.slice(0, S.layout === "grid" ? 6 : 5), "due")}` : ""}
    ${groupRows(list).map(([c, rows]) => `<div class="cath sec2" data-key="ph-${c.k}">${cico(c.k)}<span class="catl">${esc(c.l)}</span><span class="cnt">${rows.length}</span></div>${pblock(rows, "pg-" + c.k)}`).join("")}
    ${!list.length && S.pantryQ.trim() ? `<div class="noq" data-key="noq"><p>No está en la despensa.</p><button class="btn fill" data-act="pnewq">Añadir «${esc(cap(S.pantryQ.trim()))}»</button></div>` : ""}
    ${!S.products.length && !S.pantryQ.trim() ? `<div class="noq" data-key="noq0"><p>La despensa se llena sola con lo que apuntáis. También puedes añadir productos con el +.</p></div>` : ""}
   </div></div>
   ${S.capture === "typing" ? `<div class="catcher" data-act="closeDraft"></div>` : ""}
   ${S.band ? vBand() : ""}
   ${vDock()}</div>`;
}

/* --- Historial --- */
function historyDays() {
  const hq = singAll(norm(S.histQ));
  const by = new Map();
  for (const i of [...S.today, ...S.history]) {
    const k = dayKey(i.checkedAt);
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(i);
  }
  return [...by.entries()].sort((a, b) => b[0].localeCompare(a[0]))
    .map(([k, items]) => ({ k, items: items.sort((a, b) => a.checkedAt - b.checkedAt), shown: items.filter((i) => !hq || singAll(nameKey(i.name)).includes(hq)) }))
    .filter((d) => d.shown.length);
}
function vHistory() {
  const days = historyDays();
  const sel = S.histSel.size;
  return `<div class="scr" data-key="history">
   <div class="hb back"><button class="ib sm" data-act="back" aria-label="Volver">${ic("arrow-left", 20)}</button><div class="hb-t"><h1 class="hb-name">Historial</h1></div></div>
   <div class="srow2"><label class="srch">${ic("search", 18)}<input id="hq" type="search" value="${esc(S.histQ)}" placeholder="Buscar en lo que habéis comprado" aria-label="Buscar en el historial" autocomplete="off"></label></div>
   <div class="pad">
    ${!S.historyLoaded && !days.length ? `<p class="histempty">Cargando…</p>` : ""}
    ${S.historyLoaded && !days.length ? `<p class="histempty">${S.histQ ? "No aparece en el historial." : "Aquí irá lo que tachéis, agrupado por día."}</p>` : ""}
    ${days.map((d) => `<div class="trip" data-key="d-${d.k}"><h3>${esc(dayLabel(d.k))}</h3><p class="tsub2">${plural(d.items.length, "artículo tachado", "artículos tachados")}</p>
      <button class="tbtn" style="margin:8px 0 4px -12px" data-act="selDay" data-k="${d.k}">Seleccionar todo el día</button>
      ${d.shown.map((i) => { const on = S.histSel.has(i.id); return `<button class="titem" data-key="${i.id}" data-act="selItem" data-k="${i.id}" role="checkbox" aria-checked="${on}"><span class="mini-ck ${on ? "on" : ""}" style="margin:0">${on ? ic("check", 14) : ""}</span>${esc(i.name)}</button>`; }).join("")}
    </div>`).join("")}
   </div>
   ${sel ? `<div class="bottombtn" data-key="rebuy"><button class="btn fill" data-act="rebuy">Volver a añadir estos artículos (${sel})</button></div>` : ""}
   ${S.band ? vBand() : ""}
  </div>`;
}

/* --- Hojas --- */
function vSheet() {
  const s = S.sheet;
  const inner = { review: shReview, command: shCommand, edit: shEdit, stores: shStores, prefs: shPrefs, one: shOne, share: shShare, pedit: shPEdit, sedit: shSEdit }[s.type](s);
  return `<div class="scrim" data-act="closeSheet" data-key="scrim"></div><div class="sheet" role="dialog" aria-modal="true" data-key="sheet-${s.type}"><div class="handle"></div>${inner}</div>`;
}
function storeChip(id, selected, act, attrs = "") {
  return `<button class="chip sm ${selected === id ? "on" : ""}" data-act="${act}" data-k="${esc(id || "")}" ${attrs}>${id ? slot(id) : ""}${esc(id ? storeName(id) : GENERIC)}</button>`;
}
function entryChips(e, ix) {
  const all = S.stores.map((s) => s.id);
  const keys = e.showAll ? [null, ...all] : [...new Set([e.ask ? e.ask.storeId : e.storeId, null])];
  return keys.map((k) => storeChip(k, e.storeId, "eStore", `data-i="${ix}"`)).join("") + (e.showAll ? "" : `<button class="chip sm" data-act="eMore" data-i="${ix}">Otra…</button>`);
}
function entryNote(e) {
  if (e.dup) return `<p class="note">Ya está en la lista. No lo duplico.</p>`;
  let h = "";
  if (e.corrected) h += `<p class="note">Entiendo «${esc(e.name)}» (escribiste «${esc(e.corrected)}»).</p>`;
  if (e.explicit) {
    const p = e.productId ? productById(e.productId) : null;
    h += `<p class="pmeta" style="margin-top:4px">${p && (p.storeId ?? null) !== (e.storeId ?? null) ? `Normalmente en ${esc(storeName(p.storeId))}; esta vez en ${esc(storeName(e.storeId))}.` : e.known ? "Como has dicho." : "Es nuevo. Lo guardo en la despensa."}</p>`;
    if (e.showAll) h += `<div class="opts">${entryChips(e, e._ix)}</div>`;
    else h += `<div class="opts"><button class="chip sm" data-act="eMore" data-i="${e._ix}">Cambiar tienda</button></div>`;
    return h;
  }
  if (e.ask && e.ask.kind === "habit") h += `<p class="note">Normalmente lo apuntáis en ${esc(storeName(e.ask.storeId))}. ¿Lo dejo ahí o en cualquier súper?</p>`;
  else if (e.ask && e.ask.kind === "new") h += `<p class="note">Es nuevo. Lo de ${esc(CAT[e.category].l.toLowerCase())} soléis comprarlo en ${esc(storeName(e.ask.storeId))}.</p>`;
  else h += `<p class="note">${e.known ? "Lo soléis comprar en cualquier súper." : "Es nuevo. Lo guardo en la despensa."}</p>`;
  return h + `<div class="opts">${entryChips(e, e._ix)}</div>`;
}
function shReview(s) {
  const n = s.entries.filter((e) => e.include).length;
  s.entries.forEach((e, ix) => (e._ix = ix));
  return `<div class="sbody">
   <div class="shead"><h2>${s.entries.length > 1 ? "Esto es lo que he entendido" : "¿Dónde lo apunto?"}</h2><button class="tbtn" data-act="closeSheet">Cerrar</button></div>
   <p class="said">${s.voice ? "Has dicho" : "Has escrito"} <q>${esc(s.said)}</q></p>
   <div class="card">${s.entries.map((e, ix) => `<div class="prow ${e.include ? "" : "off"}">
      <button class="mini-ck ${e.include ? "on" : ""}" data-act="eInc" data-i="${ix}" role="checkbox" aria-checked="${e.include}" aria-label="Incluir ${esc(e.name)}">${e.include ? ic("check", 14) : ""}</button>
      <div class="pmain">
        <div class="pname">${esc(e.name)}</div>
        <div class="pmeta" style="display:flex;align-items:center;gap:6px">${cico(e.category, 14, "width:20px;height:20px;border-radius:6px")}${esc(CAT[e.category].l)} · ${esc(storeName(e.storeId))}</div>
        ${entryNote(e)}
      </div></div>`).join("")}</div>
   </div>
   <div class="sfoot"><button class="btn out" data-act="closeSheet">Cancelar</button><button class="btn fill" data-act="eAdd" ${n ? "" : "disabled"}>Añadir${n ? " " + n : ""}</button></div>`;
}
function shCommand(s) {
  const n = s.rows.filter((r) => r.on).length;
  return `<div class="sbody">
   <div class="shead"><h2>Marcar como comprado</h2><button class="tbtn" data-act="closeSheet">Cerrar</button></div>
   <p class="said">${s.voice ? "Has dicho" : "Has escrito"} <q>${esc(s.text)}</q></p>
   <div class="card">${s.rows.map((r, ix) => { const i = S.pending.find((x) => x.id === r.id); if (!i) return ""; return `<div class="prow tap ${r.on ? "" : "off"}" data-act="cToggle" data-i="${ix}" role="checkbox" aria-checked="${r.on}" tabindex="0">
      <span class="mini-ck ${r.on ? "on" : ""}">${r.on ? ic("check", 14) : ""}</span>
      <div class="pmain"><div class="pname">${esc(i.name)}</div><div class="pmeta">${esc(storeName(i.storeId))}${r.ex ? " · lo dejo pendiente" : ""}</div></div></div>`; }).join("")}</div>
   </div>
   <div class="sfoot"><button class="btn out" data-act="closeSheet">Cancelar</button><button class="btn fill" data-act="cApply" ${n ? "" : "disabled"}>Marcar ${n}</button></div>`;
}
function shEdit(s) {
  const d = s.draft;
  return `<div class="sbody">
   <h2 class="stitle">Editar artículo</h2>
   <div class="field"><label for="en">Nombre</label><input id="en" value="${esc(d.name)}" autocomplete="off"></div>
   <div><p class="labelsm" style="margin-bottom:8px">Dónde se compra</p><div class="wrap">
     ${[null, ...S.stores.map((x) => x.id)].map((k) => storeChip(k, d.storeId, "edStore")).join("")}</div>
     <p class="hint-ph" style="margin-top:8px">Se recordará para la próxima vez que lo apuntéis.</p></div>
   <div><p class="labelsm" style="margin-bottom:8px">Mover a…</p><div class="wrap">
     ${CATS.map((c) => `<button class="chip sm ${d.category === c.k ? "on" : ""}" data-act="edCat" data-k="${c.k}">${esc(c.l)}</button>`).join("")}</div></div>
   <button class="tbtn danger" style="align-self:flex-start;margin-left:-12px" data-act="edDel">Eliminar</button>
   </div>
   <div class="sfoot"><button class="btn out" data-act="closeSheet">Cancelar</button><button class="btn fill" data-act="edSave">Guardar</button></div>`;
}
function shStores() {
  const rows = S.stores.map((st) => { const all = S.pending.filter((i) => inStore(i, st)); const own = all.filter((i) => i.storeId === st.id).length; return { st, all: all.length, own }; });
  const meta = ({ st, all, own }) => {
    if (!all) return "nada pendiente";
    if (st.kind === "generic") return [own ? `${own} solo de aquí` : "", all - own ? `${all - own} de cualquier súper` : ""].filter(Boolean).join(" + ");
    return plural(all, "artículo", "artículos");
  };
  return `<div class="sbody">
   <div class="shead"><h2>Tiendas</h2><button class="tbtn" data-act="closeSheet">Cerrar</button></div>
   <p class="help">Una tienda <b>genérica</b> (Mercadona, Lidl…) muestra lo suyo y todo lo apuntado como «Cualquier súper», como los huevos. Una tienda <b>única</b> (farmacia, frutería…) solo muestra lo suyo. Toca una para ver su lista.</p>
   <div class="card">${rows.map((r) => `<div class="prow tap" data-key="s-${r.st.id}" data-act="shopAt" data-k="${esc(r.st.id)}" style="align-items:center" tabindex="0">${slot(r.st.id, true)}
      <div class="pmain"><div class="pname">${esc(r.st.name)}</div><div class="pmeta">${r.st.kind === "generic" ? "Genérica" : "Única"} · ${meta(r)}</div></div>
      <button class="ib" style="width:44px;height:44px;color:var(--muted);background:transparent" data-act="sedit" data-k="${esc(r.st.id)}" aria-label="Editar ${esc(r.st.name)}">${ic("pencil", 18)}</button></div>`).join("")}
   </div>
   <button class="btn out" data-act="snew">${ic("plus", 18)}Añadir tienda</button>
   </div>`;
}
function shSEdit(s) {
  const d = s.draft, ix = S.stores.findIndex((x) => x.id === s.k);
  const n = s.k ? S.pending.filter((i) => i.storeId === s.k).length : 0;
  const np = s.k ? S.products.filter((p) => p.storeId === s.k).length : 0;
  const kind = (k, t, subt) => `<div class="prow tap" data-act="sdKind" data-k="${k}" style="align-items:center" role="radio" aria-checked="${d.kind === k}" tabindex="0"><span class="mini-ck ${d.kind === k ? "on" : ""}" style="border-radius:50%">${d.kind === k ? ic("check", 12) : ""}</span><div class="pmain"><div class="pname">${t}</div><div class="pmeta">${subt}</div></div></div>`;
  return `<div class="sbody">
   <h2 class="stitle">${s.k ? "Editar tienda" : "Nueva tienda"}</h2>
   <div class="field"><label for="sn">Nombre</label><input id="sn" value="${esc(d.name)}" placeholder="p. ej. Pescadería" autocomplete="off"></div>
   ${s.err ? `<p class="note" style="color:var(--danger)">${esc(s.err)}</p>` : ""}
   <div class="card">${kind("generic", "Genérica", "Le caen también las cosas de «Cualquier súper», como los huevos")}${kind("unique", "Única", "Solo lo que se compra allí, como en la farmacia")}</div>
   <div><p class="labelsm" style="margin-bottom:8px">Icono</p><div class="wrap">
     <button class="chip sm ${!d.icon ? "on" : ""}" data-act="sdIcon" data-k="">${autoLogo(d.name) ? logoSpan(autoLogo(d.name)) : ic(autoStoreIcon(d.name, d.kind), 16)}Automático</button>
     ${Object.keys(LOGOS).map((g) => `<button class="chip sm iconchip ${d.icon === g ? "on" : ""}" data-act="sdIcon" data-k="${g}" aria-label="Logo ${LOGOS[g].match}">${logoSpan(g)}</button>`).join("")}
     ${STORE_ICONS.map((g) => `<button class="chip sm iconchip ${d.icon === g ? "on" : ""}" data-act="sdIcon" data-k="${g}" aria-label="Icono ${g}">${ic(g, 18)}</button>`).join("")}</div></div>
   ${s.k ? `<div><p class="labelsm" style="margin-bottom:8px">Posición en la barra de tiendas</p><div class="wrap">
     <button class="chip sm" data-act="sdMove" data-k="-1" ${ix <= 0 ? "disabled" : ""}>Mover antes</button><button class="chip sm" data-act="sdMove" data-k="1" ${ix >= S.stores.length - 1 ? "disabled" : ""}>Mover después</button></div></div>` : ""}
   ${s.k ? (s.confirm ? `<p class="note" style="margin:0">¿Borrar ${esc(storeName(s.k))}?${n || np ? ` Lo que tenga asignado (${[n ? plural(n, "artículo de la lista", "artículos de la lista") : "", np ? plural(np, "producto de la despensa", "productos de la despensa") : ""].filter(Boolean).join(" y ")}) pasará a «Cualquier súper».` : ""}</p>
     <div class="btns"><button class="btn out" data-act="sdNo">No</button><button class="btn danger" data-act="sdDelYes">Borrar tienda</button></div>`
    : `<button class="tbtn danger" style="align-self:flex-start;margin-left:-12px" data-act="sdDel">Borrar tienda</button>`) : ""}
   </div>
   <div class="sfoot"><button class="btn out" data-act="stores">Cancelar</button><button class="btn fill" data-act="sdSave">Guardar</button></div>`;
}
function shOne(s) {
  const p = s.queue[s.ix] && productById(s.queue[s.ix]);
  if (!p) return `<div class="sbody"><div class="shead"><h2>Repasa la despensa</h2><button class="tbtn" data-act="closeSheet">Cerrar</button></div>
     <p class="big-name" style="font-size:26px;line-height:34px">${!s.queue.length ? "No hay nada que reponer ahora mismo" : s.added === 0 ? "No se añadió nada" : s.added === 1 ? "Se añadió 1 artículo" : `Se añadieron ${s.added} artículos`}</p>
     ${!s.queue.length ? `<p class="help">Cuando algo lleve tiempo sin comprarse según vuestra costumbre, aparecerá aquí.</p>` : ""}
     <button class="btn fill tall" data-act="closeSheet">Volver a la lista</button></div>`;
  const st = statsFor(p);
  return `<div class="sbody">
   <div class="shead"><h2>Repasa la despensa</h2><button class="tbtn" data-act="closeSheet">Cerrar</button></div>
   <p class="labelsm" style="font-size:14px">${s.ix + 1} de ${s.queue.length}</p>
   <div class="card" style="padding:20px;display:flex;flex-direction:column;gap:12px">
     <div style="display:flex;align-items:center;gap:12px">${cico(p.category)}<span class="big-name" style="flex:1">${esc(p.name)}</span></div>
     <p class="help">Comprado hace ${plural(st.since, "día", "días")}. Soléis comprarlo cada ${plural(st.every, "día", "días")}.</p>
     <p class="help">${esc(storeName(p.storeId))}</p>
   </div>
   <div class="btns"><button class="btn out tall" data-act="oneSkip">Saltar</button><button class="btn fill tall" data-act="oneAdd">Añadir</button></div>
   </div>`;
}
function shPrefs() {
  return `<div class="sbody">
   <h2 class="stitle">Preferencias</h2>
   <div><p class="labelsm" style="margin-bottom:8px">Modo</p><div class="wrap">${[["system", "Como el iPhone"], ["light", "Claro"], ["dark", "Oscuro"]].map(([k, l]) => `<button class="chip sm ${S.theme === k ? "on" : ""}" data-act="theme" data-k="${k}">${l}</button>`).join("")}</div></div>
   <div class="rule"></div>
   <div><p class="labelsm" style="font-size:14px;color:var(--ink);margin-bottom:12px">Cuenta</p>
     <div class="acct"><span class="avatar">${esc(S.me.charAt(0))}</span><div><b>${esc(S.me)}</b><span>Sesión iniciada en este dispositivo</span></div></div></div>
   <div class="btns"><button class="btn out" data-act="logout">${ic("log-out", 18)}Cerrar sesión</button></div>
   <p class="version">Versión ${APP_VERSION} · ${APP_DATE}</p>
   <p class="credits">Iconos de productos: <a href="https://openmoji.org" target="_blank" rel="noopener">OpenMoji</a>, CC BY-SA 4.0. Iconos de interfaz: <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a>, ISC. Tipografías Bricolage Grotesque y Figtree, OFL.</p>
   </div>`;
}
function shPEdit(s) {
  const d = s.draft;
  const p = s.id ? productById(s.id) : null;
  const onList = p && pendingFor(p);
  return `<div class="sbody">
   <h2 class="stitle">${s.id ? "Editar producto" : "Nuevo producto"}</h2>
   <p class="help" style="margin-top:-8px">Así aparecerá cada vez que lo apuntéis${onList ? ". También se cambia en la lista, donde ya está" : ""}.</p>
   <div class="field"><label for="pn">Nombre</label><input id="pn" value="${esc(d.name)}" placeholder="p. ej. Queso de cabra" autocomplete="off"></div>
   ${s.err ? `<p class="note" style="color:var(--danger);margin-top:-8px">${esc(s.err)}</p>` : ""}
   <div><p class="labelsm" style="margin-bottom:8px">Dónde se compra</p><div class="wrap">
     ${[null, ...S.stores.map((x) => x.id)].map((k) => storeChip(k, d.storeId, "pdStore")).join("")}</div></div>
   <div><p class="labelsm" style="margin-bottom:8px">Categoría</p><div class="wrap">
     ${CATS.map((c) => `<button class="chip sm ${d.category === c.k ? "on" : ""}" data-act="pdCat" data-k="${c.k}">${esc(c.l)}</button>`).join("")}</div></div>
   ${s.id ? `<button class="tbtn danger" style="align-self:flex-start;margin-left:-12px" data-act="pdDel">Borrar de la despensa</button>` : ""}
   </div>
   <div class="sfoot"><button class="btn out" data-act="closeSheet">Cancelar</button><button class="btn fill" data-act="pdSave">Guardar</button></div>`;
}
function shShare() {
  return `<div class="sbody">
   <div class="shead"><h2 class="stitle">Compartida.</h2><button class="tbtn" data-act="closeSheet">Cerrar</button></div>
   <p class="help">Las dos personas ven los cambios en segundos y pueden añadir o tachar artículos. Nadie más puede entrar.</p>
   <div class="card" style="padding:16px">
     <div class="acct"><span class="avatar">${esc(S.me.charAt(0))}</span><div><b>${esc(S.me)}</b><span>Tú · este dispositivo</span></div></div>
     <div class="acct"><span class="avatar acc">${esc(otherName().charAt(0))}</span><div><b>${esc(otherName())}</b><span>Puede añadir y tachar</span></div></div>
   </div>
   <p class="hint-ph" style="display:flex;gap:8px;align-items:center">${ic("lock", 16)}Acceso con usuario y contraseña; el repositorio público no contiene datos.</p></div>`;
}

/* ===================================================================
   Avisos con Deshacer
   =================================================================== */
let bandN = 0, bandT = null;
function toast(msg, undo) {
  S.band = { msg, undo: undo || null, n: ++bandN };
  render();
  clearTimeout(bandT);
  const n = bandN;
  bandT = setTimeout(() => { if (S.band && S.band.n === n) { S.band = null; render(); } }, 6000);
}
function runUndo() {
  const u = S.band && S.band.undo;
  S.band = null;
  if (u) u();
  render();
}

/* ===================================================================
   Acciones sobre los datos
   =================================================================== */
const slugId = (k) => k.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "x";
function newProductId(k) {
  const base = slugId(k);
  return S.products.some((p) => p.id === base) ? DB.newId("products") : base;
}
function markFresh(ids) {
  ids.forEach((id) => S.fresh.add(id));
  setTimeout(() => { ids.forEach((id) => S.fresh.delete(id)); render(); }, 1800);
}

/** Apunta artículos. entries: [{name, category, storeId, productId?, include}] */
function addEntries(entries) {
  const ops = [], added = [], seen = new Set();
  for (const e of entries) {
    if (e.include === false) continue;
    const k = nameKey(e.name);
    if (!k || seen.has(k)) continue;
    let p = (e.productId && productById(e.productId)) || productByKey(k);
    if (p && pendingFor(p)) continue;
    if (!p && S.pending.some((i) => nameKey(i.name) === k)) continue;
    seen.add(k);
    const storeId = e.storeId ?? null;
    if (!p) {
      const id = newProductId(k);
      p = { id, name: e.name, nameKey: k, category: e.category, storeId, icon: iconKeyFor(e.name) };
      ops.push({ op: "set", col: "products", id, data: DB.productData(p, true) });
      S.products.push(p); // para que la siguiente entrada lo vea; el snapshot lo confirmará
    } else if ((p.storeId ?? null) !== storeId) {
      ops.push({ op: "update", col: "products", id: p.id, data: { storeId, ...DB.touch() } }); // aprende la tienda elegida
      p.storeId = storeId;
    }
    const id = DB.newId("items");
    const item = { productId: p.id, name: p.name, category: e.category || p.category, storeId, addedBy: S.me, checked: false };
    ops.push({ op: "set", col: "items", id, data: DB.itemData(item) });
    added.push({ id, ...item });
  }
  if (ops.length) DB.batch(ops);
  markFresh(added.map((a) => a.id));
  return added;
}
function undoAdd(added) {
  return () => DB.batch(added.map((a) => ({ op: "delete", col: "items", id: a.id })));
}
function addedToast(added) {
  if (!added.length) { toast("Ya estaba todo en la lista."); return; }
  toast(added.length === 1 ? `Añadido: ${added[0].name} · ${storeName(added[0].storeId)}` : `Añadidos ${added.length} artículos`, undoAdd(added));
}
function tick(i) {
  DB.batch([{ op: "update", col: "items", id: i.id, data: DB.checkData(S.me) }]);
  toast(`Se ha tachado ${i.name}`, () => DB.batch([{ op: "update", col: "items", id: i.id, data: DB.uncheckData() }]));
}
function untick(i) {
  DB.batch([{ op: "update", col: "items", id: i.id, data: DB.uncheckData() }]);
}
function addProductToList(p, fresh = true) {
  const added = addEntries([{ productId: p.id, name: p.name, category: p.category, storeId: p.storeId ?? null }]);
  if (!fresh) added.forEach((a) => S.fresh.delete(a.id));
  return added;
}

/* ---------- Escribir ---------- */
function ctx() { return { products: S.products, stores: S.stores, pending: S.pending, store: currentStore() }; }
function submitDraft() {
  const text = S.draft.trim();
  if (!text) return;
  const cmd = parseCommand(text, ctx());
  if (cmd && cmd.rows.length) { S.draft = ""; S.capture = "idle"; S.sheet = { type: "command", ...cmd, voice: false }; render(); return; }
  const entries = parseUtterance(text, ctx());
  if (!entries.length) return;
  S.draft = "";
  if (isClear(entries)) {
    const added = addEntries(entries);
    addedToast(added);
    focusDraft();
  } else {
    S.capture = "idle";
    S.sheet = { type: "review", said: text, entries, voice: false };
    render();
  }
}
function focusDraft() {
  const inp = root.querySelector("#draft");
  if (inp && document.activeElement !== inp) { inp.focus({ preventScroll: true }); try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) {} }
}
/** Cierra el campo de escribir sin saltos: la app vuelve ya a su altura completa y el teclado baja por encima. */
function closeTyping() {
  root.style.top = ""; root.style.height = ""; root.classList.remove("kb");
  const inp = root.querySelector("#draft");
  if (inp) inp.blur();
  S.capture = "idle"; S.draft = "";
  render();
}
function openTyping() {
  S.capture = "typing"; S.band = null; S.menu = false;
  render();
  focusDraft();
}

/* ---------- Toca y habla ---------- */
// Tocar para hablar: el micro se arranca en el «click» (el iPhone solo lo permite con un toque completo,
// no al apoyar el dedo). Termina solo al callarse o al volver a tocar. En iOS, una frase por vez.
const IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let rec = null, recText = "", recOn = false, recStart = 0, recGotResult = false, recError = false, recMax = null;
function toggleVoice() {
  if (S.capture === "listening") return stopListening();
  if (!SR) return toast("Este navegador no reconoce la voz.");
  if (S.capture === "typing") { const inp = root.querySelector("#draft"); if (inp) inp.blur(); }
  startListening();
}
function startListening(prefix = "") {
  if (rec) return;
  try {
    rec = new SR();
    rec.lang = "es-ES"; rec.interimResults = true; rec.continuous = !IOS; rec.maxAlternatives = 1;
  } catch (e) { rec = null; return toast("No se ha podido abrir el micrófono."); }
  recText = prefix; recOn = true;
  if (!prefix) { recStart = Date.now(); recGotResult = false; recError = false; }
  let finals = prefix ? prefix + " " : "";
  rec.onresult = (ev) => {
    let interim = "";
    for (let k = ev.resultIndex; k < ev.results.length; k++) {
      const r = ev.results[k];
      if (r.isFinal) finals += r[0].transcript + " "; else interim += r[0].transcript;
    }
    recGotResult = true;
    recText = (finals + interim).replace(/\s+/g, " ").trim();
    S.partial = recText;
    renderPartial();
  };
  rec.onerror = (ev) => {
    if (ev.error === "no-speech" || ev.error === "aborted") return; // lo gestiona onend
    recError = true; rec = null; recOn = false; clearTimeout(recMax); S.capture = "idle"; S.partial = "";
    render();
    if (ev.error === "not-allowed") toast("El micrófono no tiene permiso. Actívalo en Ajustes › Safari › Micrófono.");
    else toast(`La voz ha fallado (${ev.error}). Prueba otra vez.`);
  };
  rec.onend = () => {
    const r = rec; rec = null;
    if (!r || recError) return;
    // Fuera de iOS, si el navegador corta solo sin que se haya dicho nada aún, sigue escuchando.
    if (recOn && !IOS && !recText) { try { startListening(recText); if (rec) return; } catch (e) {} }
    recOn = false;
    finishListening(recText);
  };
  S.capture = "listening"; S.partial = ""; S.band = null; S.sheet = null;
  try { rec.start(); } catch (e) { rec = null; recOn = false; S.capture = "idle"; return toast("No se ha podido abrir el micrófono."); }
  clearTimeout(recMax);
  recMax = setTimeout(stopListening, 30000);
  render();
  const l = root.querySelector(".list"); if (l) l.scrollTop = l.scrollHeight;
}
function stopListening() {
  if (!recOn) return;
  recOn = false;
  clearTimeout(recMax);
  if (rec) {
    const r = rec;
    try { r.stop(); } catch (e) { rec = null; finishListening(recText); return; }
    // Si el motor no avisa de que ha terminado, se procesa igualmente.
    setTimeout(() => { if (rec === r) { rec = null; try { r.abort(); } catch (e) {} finishListening(recText); } }, 2500);
  } else finishListening(recText);
}
function finishListening(text) {
  if (S.capture !== "listening") return;
  clearTimeout(recMax);
  S.capture = "idle"; S.partial = "";
  text = (text || "").trim();
  if (!text) {
    render();
    toast(recGotResult ? "No te he oído. Toca el micro y habla." : "El micro no ha devuelto nada. Toca y habla otra vez.");
    return;
  }
  const cmd = parseCommand(text, ctx());
  if (cmd && cmd.rows.length) S.sheet = { type: "command", ...cmd, voice: true };
  else {
    const entries = parseUtterance(text, ctx());
    if (!entries.length) { render(); toast("No he entendido qué apuntar."); return; }
    S.sheet = { type: "review", said: text, entries, voice: true };
  }
  render();
}
/* ---------- Edición ---------- */
function openEdit(id) {
  const i = S.pending.find((x) => x.id === id) || S.today.find((x) => x.id === id);
  if (!i) return;
  S.sheet = { type: "edit", id, draft: { name: i.name, storeId: i.storeId ?? null, category: i.category } };
  S.menu = false;
  render();
}
function saveEdit(sh) {
  const i = S.pending.find((x) => x.id === sh.id) || S.today.find((x) => x.id === sh.id);
  const name = cap(root.querySelector("#en").value.trim());
  if (!i || !name) { S.sheet = null; render(); return; }
  const ops = [];
  const k = nameKey(name);
  let p = productByKey(k) || (nameKey(i.name) === k ? productOf(i) : null);
  const { storeId, category } = sh.draft;
  if (!p) {
    const id = newProductId(k);
    p = { id, name, nameKey: k, category, storeId, icon: iconKeyFor(name) };
    ops.push({ op: "set", col: "products", id, data: DB.productData(p, true) });
  } else if ((p.storeId ?? null) !== storeId || p.category !== category) {
    ops.push({ op: "update", col: "products", id: p.id, data: { storeId, category, ...DB.touch() } });
  }
  ops.push({ op: "update", col: "items", id: i.id, data: { name: p.name === name ? p.name : name, storeId, category, productId: p.id } });
  DB.batch(ops);
  S.sheet = null;
  render();
}
function openPEdit(id, name) {
  const p = id ? productById(id) : null;
  S.sheet = { type: "pedit", id: p ? p.id : null, draft: p ? { name: p.name, storeId: p.storeId ?? null, category: p.category } : { name: name || "", storeId: null, category: name ? guessCat(name) : "otros" } };
  render();
}
function savePEdit(sh) {
  const name = cap(root.querySelector("#pn").value.trim());
  if (!name) { root.querySelector("#pn").focus(); return; }
  const k = nameKey(name);
  const clash = S.products.find((p) => p.nameKey === k && p.id !== sh.id);
  if (clash) { sh.err = `«${clash.name}» ya está en la despensa.`; sh.draft.name = name; render(); return; }
  const { storeId, category } = sh.draft;
  const ops = [];
  if (sh.id) {
    const p = productById(sh.id);
    const oldStore = p.storeId ?? null;
    const icon = p.icon && nameKey(p.name) === k ? p.icon : iconKeyFor(name);
    ops.push({ op: "update", col: "products", id: p.id, data: { name, nameKey: k, category, storeId, icon: icon || null, ...DB.touch() } });
    for (const i of S.pending.filter((i) => i.productId === p.id || nameKey(i.name) === p.nameKey)) {
      const d = { name, category, productId: p.id };
      if ((i.storeId ?? null) === oldStore) d.storeId = storeId;
      ops.push({ op: "update", col: "items", id: i.id, data: d });
    }
    DB.batch(ops);
    S.sheet = null;
    toast(`Guardado: ${name}`);
  } else {
    const id = newProductId(k);
    DB.batch([{ op: "set", col: "products", id, data: DB.productData({ name, category, storeId, icon: iconKeyFor(name) }, true) }]);
    S.sheet = null;
    S.pantryQ = "";
    toast(`${name} añadido a la despensa`);
  }
}
function deleteProduct(sh) {
  const p = productById(sh.id);
  if (!p) return;
  DB.batch([{ op: "delete", col: "products", id: p.id }]);
  S.sheet = null;
  const copy = { ...p };
  toast(`Borrado de la despensa: ${p.name}`, () => DB.batch([{ op: "set", col: "products", id: copy.id, data: DB.productData(copy, true) }]));
}

/* ---------- Tiendas ---------- */
function saveStore(sh) {
  const name = cap(root.querySelector("#sn").value.trim());
  if (!name) { sh.err = "Escribe un nombre."; render(); return; }
  const k = nameKey(name);
  if (S.stores.some((s) => nameKey(s.name) === k && s.id !== sh.k)) { sh.err = "Ya hay una tienda con ese nombre."; sh.draft.name = name; render(); return; }
  if (sh.k) {
    const st = storeById(sh.k);
    const aliases = [...new Set([...(st.aliases || []), k])];
    DB.batch([{ op: "update", col: "stores", id: st.id, data: { name, kind: sh.draft.kind, aliases, icon: sh.draft.icon || null } }]);
  } else {
    let id = slugId(k), n = 2;
    while (S.stores.some((s) => s.id === id)) id = slugId(k) + "-" + n++;
    const order = S.stores.reduce((m, s) => Math.max(m, s.order), -1) + 1;
    DB.batch([{ op: "set", col: "stores", id, data: { name, kind: sh.draft.kind, order, aliases: [k], icon: sh.draft.icon || null } }]);
  }
  S.sheet = { type: "stores" };
  render();
}
function moveStore(sh, dir) {
  const list = [...S.stores];
  const i = list.findIndex((s) => s.id === sh.k), j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  DB.batch(list.map((s, ix) => ({ op: "update", col: "stores", id: s.id, data: { order: ix } })));
  list.forEach((s, ix) => (s.order = ix));
  S.stores = list;
  render();
}
function deleteStore(sh) {
  const id = sh.k;
  const ops = [];
  S.pending.filter((i) => i.storeId === id).forEach((i) => ops.push({ op: "update", col: "items", id: i.id, data: { storeId: null } }));
  S.products.filter((p) => p.storeId === id).forEach((p) => ops.push({ op: "update", col: "products", id: p.id, data: { storeId: null, ...DB.touch() } }));
  ops.push({ op: "delete", col: "stores", id });
  DB.batch(ops);
  if (S.store === id) S.store = null;
  S.sheet = { type: "stores" };
  render();
}

/* ---------- Historial ---------- */
let pruned = false;
async function refreshHistory() {
  try { S.history = await DB.loadHistory(); } catch (e) { console.warn(e); }
  S.historyLoaded = true;
  render();
}
function openHistory() {
  S.menu = false; S.band = null; S.view = "history"; S.histSel = new Set(); S.capture = "idle";
  render();
  refreshHistory();
  if (!pruned) { pruned = true; DB.pruneHistory(); }
}
function rebuy() {
  const all = new Map([...S.today, ...S.history].map((i) => [i.id, i]));
  const entries = [];
  for (const id of S.histSel) {
    const i = all.get(id);
    if (!i) continue;
    const p = productOf(i);
    entries.push(p ? { productId: p.id, name: p.name, category: p.category, storeId: p.storeId ?? null } : { name: i.name, category: i.category, storeId: storeById(i.storeId) ? i.storeId : null });
  }
  const added = addEntries(entries);
  S.histSel = new Set();
  S.view = "list";
  toast(added.length ? `${plural(added.length, "artículo añadido", "artículos añadidos")} a la lista` : "Ya estaba todo en la lista.", added.length ? undoAdd(added) : null);
}

/* ===================================================================
   Eventos
   =================================================================== */
let lp = null, lpFired = false, lpXY = null;
root.addEventListener("pointerdown", (e) => {
  if (e.button && e.button !== 0) return;
  const target = e.target.closest("[data-act='ptoggle'], .row[data-id], .tile[data-id]");
  if (target && !e.target.closest(".edb")) {
    lpFired = false; lpXY = [e.clientX, e.clientY];
    clearTimeout(lp);
    lp = setTimeout(() => {
      lpFired = true;
      if (navigator.vibrate) try { navigator.vibrate(10); } catch (x) {}
      if (target.dataset.act === "ptoggle") openPEdit(target.dataset.k); else openEdit(target.dataset.id);
    }, 500);
  }
});
root.addEventListener("pointermove", (e) => { if (lpXY && Math.hypot(e.clientX - lpXY[0], e.clientY - lpXY[1]) > 8) clearTimeout(lp); });
["pointerup", "pointercancel"].forEach((t) => window.addEventListener(t, () => clearTimeout(lp)));
root.addEventListener("pointerleave", () => clearTimeout(lp));
root.addEventListener("scroll", () => clearTimeout(lp), true);
root.addEventListener("contextmenu", (e) => {
  const t = e.target.closest("[data-act='ptoggle'], .row[data-id], .tile[data-id]");
  if (!t) return;
  e.preventDefault(); clearTimeout(lp); lpFired = true;
  if (t.dataset.act === "ptoggle") openPEdit(t.dataset.k); else openEdit(t.dataset.id);
});
// En el ordenador, la rueda del ratón desplaza en horizontal la barra de tiendas.
root.addEventListener("wheel", (e) => {
  const c = e.target.closest(".chips, .sug");
  if (c && Math.abs(e.deltaY) > Math.abs(e.deltaX)) { c.scrollLeft += e.deltaY; e.preventDefault(); }
}, { passive: false });

function itemById(id) { return S.pending.find((x) => x.id === id) || S.today.find((x) => x.id === id); }

root.addEventListener("click", (e) => {
  const row = e.target.closest(".row[data-id], .tile[data-id]");
  if (row && !e.target.closest("[data-act]")) {
    if (lpFired) { lpFired = false; return; }
    const i = itemById(row.dataset.id);
    if (i) { if (i.checked) untick(i); else tick(i); }
    return;
  }
  const el = e.target.closest("[data-act]");
  if (!el) return;
  if (el.disabled) return;
  act(el.dataset.act, el, e);
});
root.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches(".row[data-id], .tile[data-id], .prow[tabindex]")) {
    e.preventDefault(); e.target.click();
  }
});

function act(a, el, e) {
  const k = el.dataset.k;
  const sh = S.sheet;
  switch (a) {
    case "menu": S.menu = !S.menu; return render();
    case "closeMenu": S.menu = false; return render();
    case "layout": S.layout = S.layout === "grid" ? "list" : "grid"; LS.set("layout", S.layout); return render();
    case "history": return openHistory();
    case "pantry": S.menu = false; S.band = null; S.view = "pantry"; return render();
    case "tabList": S.band = null; S.view = "list"; return render();
    case "back": S.view = "list"; S.band = null; S.histSel = new Set(); return render();
    case "store": S.store = k || null; return render();
    case "stores": S.menu = false; S.sheet = { type: "stores" }; return render();
    case "shopAt": if (lpFired) { lpFired = false; return; } S.store = k || null; S.sheet = null; S.view = "list"; return render();
    case "sedit": { e.stopPropagation(); const st = storeById(k); S.sheet = { type: "sedit", k, draft: { name: st.name, kind: st.kind, icon: st.icon || null } }; return render(); }
    case "snew": S.sheet = { type: "sedit", k: null, draft: { name: "", kind: "unique", icon: null } }; return render();
    case "sdIcon": sh.draft.name = root.querySelector("#sn").value; sh.draft.icon = k || null; return render();
    case "sdKind": sh.draft.name = root.querySelector("#sn").value; sh.draft.kind = k; return render();
    case "sdMove": sh.draft.name = root.querySelector("#sn").value; return moveStore(sh, +k);
    case "sdDel": sh.draft.name = root.querySelector("#sn").value; sh.confirm = true; return render();
    case "sdNo": sh.confirm = false; return render();
    case "sdDelYes": return deleteStore(sh);
    case "sdSave": return saveStore(sh);
    case "toggleChecked": S.checkedOpen = !S.checkedOpen; return render();
    case "edit": return openEdit(el.dataset.id);
    case "edStore": sh.draft.name = root.querySelector("#en").value; sh.draft.storeId = k || null; return render();
    case "edCat": sh.draft.name = root.querySelector("#en").value; sh.draft.category = k; return render();
    case "edSave": return saveEdit(sh);
    case "edDel": {
      const i = itemById(sh.id);
      S.sheet = null;
      if (!i) return render();
      DB.batch([{ op: "delete", col: "items", id: i.id }]);
      const copy = { ...i };
      return toast(`Eliminado: ${i.name}`, () => DB.batch([{ op: "set", col: "items", id: copy.id, data: DB.itemData(copy) }]));
    }
    case "pedit": e.stopPropagation(); return openPEdit(k);
    case "pnew": return openPEdit(null);
    case "pnewq": { const n = cap(S.pantryQ.trim()); return openPEdit(null, n); }
    case "pdStore": sh.draft.name = root.querySelector("#pn").value; sh.draft.storeId = k || null; return render();
    case "pdCat": sh.draft.name = root.querySelector("#pn").value; sh.draft.category = k; return render();
    case "pdSave": return savePEdit(sh);
    case "pdDel": return deleteProduct(sh);
    case "ptoggle": {
      if (lpFired) { lpFired = false; return; }
      const p = productById(k); if (!p) return;
      const ex = pendingFor(p);
      if (ex) DB.batch([{ op: "delete", col: "items", id: ex.id }]); else addProductToList(p, false);
      return render();
    }
    case "undo": return runUndo();
    case "closeBand": S.band = null; return render();
    case "type": return openTyping();
    case "closeDraft": return closeTyping();
    case "quick": {
      const p = productById(k); if (!p) return;
      const added = addProductToList(p);
      addedToast(added);
      if (S.capture === "typing") { const s = root.querySelector("#sug"); if (s) s.innerHTML = vSug(); focusDraft(); }
      return;
    }
    case "closeSheet": S.sheet = null; return render();
    case "eInc": { const en = sh.entries[+el.dataset.i]; en.include = !en.include; return render(); }
    case "eStore": { const en = sh.entries[+el.dataset.i]; en.storeId = k || null; return render(); }
    case "eMore": sh.entries[+el.dataset.i].showAll = true; return render();
    case "eAdd": { const added = addEntries(sh.entries); S.sheet = null; return addedToast(added); }
    case "cToggle": sh.rows[+el.dataset.i].on = !sh.rows[+el.dataset.i].on; return render();
    case "cApply": {
      const ids = sh.rows.filter((r) => r.on && S.pending.some((i) => i.id === r.id)).map((r) => r.id);
      S.sheet = null;
      if (!ids.length) return render();
      DB.batch(ids.map((id) => ({ op: "update", col: "items", id, data: DB.checkData(S.me) })));
      return toast(ids.length === 1 ? "Se ha tachado 1 artículo" : `Se han tachado ${ids.length} artículos`, () => DB.batch(ids.map((id) => ({ op: "update", col: "items", id, data: DB.uncheckData() }))));
    }
    case "review1": { S.menu = false; S.sheet = { type: "one", queue: dueList().slice(0, 12).map((p) => p.id), ix: 0, added: 0 }; return render(); }
    case "oneAdd": { const p = productById(sh.queue[sh.ix]); if (p && !pendingFor(p)) { addProductToList(p); sh.added++; } sh.ix++; return render(); }
    case "oneSkip": sh.ix++; return render();
    case "selDay": {
      const d = historyDays().find((x) => x.k === k);
      if (d) { const all = d.shown.every((i) => S.histSel.has(i.id)); d.shown.forEach((i) => (all ? S.histSel.delete(i.id) : S.histSel.add(i.id))); }
      return render();
    }
    case "selItem": if (S.histSel.has(k)) S.histSel.delete(k); else S.histSel.add(k); return render();
    case "rebuy": return rebuy();
    case "share": S.menu = false; S.sheet = { type: "share" }; return render();
    case "prefs": S.menu = false; S.sheet = { type: "prefs" }; return render();
    case "theme": S.theme = k; LS.set("theme", k); return render();
    case "logout": return doLogout();
    case "voice": return toggleVoice();
  }
}

root.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "loginForm") doLogin();
  if (e.target.id === "draftForm") submitDraft();
});
root.addEventListener("change", (e) => {
  if (e.target.id === "remember") { S.remember = e.target.checked; render(); }
});
root.addEventListener("input", (e) => {
  const id = e.target.id;
  if (id === "draft") {
    S.draft = e.target.value;
    const s = root.querySelector("#sug"); if (s) s.innerHTML = vSug();
    const b = root.querySelector("#draftSubmit"); if (b) b.disabled = !S.draft.trim();
  } else if (id === "pq") { S.pantryQ = e.target.value; render(); }
  else if (id === "hq") { S.histQ = e.target.value; render(); }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (S.sheet) S.sheet = null; else if (S.menu) S.menu = false; else if (S.capture === "typing") return closeTyping(); else if (S.view !== "list") S.view = "list";
    render();
  }
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => render());

/* ===================================================================
   Sesión y arranque
   =================================================================== */
async function doLogin() {
  const u = norm(root.querySelector("#lu").value).replace(/@.*$/, "").replace(/\s/g, "");
  const p = root.querySelector("#lp").value;
  if (!USERS.includes(u) || !p) { S.loginErr = true; return render(); }
  S.loginBusy = true; S.loginErr = false; render();
  try {
    await DB.login(u, p, S.remember);
  } catch (err) {
    S.loginErr = true;
    const lp = root.querySelector("#lp"); if (lp) lp.value = "";
  }
  S.loginBusy = false;
  render();
}
function doLogout() {
  S.menu = false; S.sheet = null;
  stopData();
  DB.logout();
}
function stopData() {
  if (sub) { sub.stop(); sub = null; }
  Object.assign(S, { stores: [], products: [], pending: [], today: [], history: [], historyLoaded: false, ready: { stores: false, products: false, pending: false }, view: "list", store: null, band: null, capture: "idle", draft: "", histSel: new Set() });
}
let initialPending = true;
function startData() {
  initialPending = true;
  sub = DB.subscribe({
    stores(list) { S.stores = list; S.ready.stores = true; if (S.store && !storeById(S.store)) S.store = null; render(); },
    products(list) { S.products = list; S.ready.products = true; render(); },
    pending(list, added) {
      // Lo que apunta la otra persona se resalta igual, sin avisos.
      if (!initialPending) markFresh(added.filter((a) => !a.local).map((a) => a.id));
      initialPending = false;
      S.pending = list; S.ready.pending = true; render();
    },
    today(list) { S.today = list; render(); },
    error(e) { console.warn("Firestore", e); },
  });
  refreshHistory();
}
const vv = window.visualViewport;
function fitViewport() {
  if (!vv) return;
  // Teclado abierto y escribiendo. Mientras el teclado se cierra no se reajusta, para que la barra no dé saltos.
  const kb = window.innerHeight - vv.height > 80 && document.activeElement && document.activeElement.tagName === "INPUT";
  root.style.top = kb ? vv.offsetTop + "px" : "";
  root.style.height = kb ? vv.height + "px" : "";
  root.classList.toggle("kb", kb);
}
if (vv) { vv.addEventListener("resize", fitViewport); vv.addEventListener("scroll", fitViewport); }

let lastDay = dayKey(Date.now());
function checkDay() {
  const d = dayKey(Date.now());
  if (d !== lastDay && sub) { lastDay = d; sub.refreshDay(); refreshHistory(); }
  else render();
}
setInterval(checkDay, 60000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkDay(); });

async function boot() {
  applyTheme();
  render();
  if (!isConfigured()) { S.phase = "setup"; return render(); }
  try { await DB.connect(firebaseConfig); }
  catch (e) { console.error(e); S.phase = "setup"; return render(); }
  DB.onUser((user) => {
    if (user) {
      S.me = DB.whoFromEmail(user.email);
      S.meKey = S.me.toLowerCase();
      if (S.phase !== "app") { S.phase = "app"; startData(); }
    } else {
      stopData();
      S.me = ""; S.meKey = ""; S.phase = "login";
    }
    render();
  });
}

// Actualizaciones: al volver a la app se busca versión nueva; si ya se instaló, se recarga
// sin avisar al volver a abrirla (o al momento si aún no se ha tocado nada).
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  const hadController = !!navigator.serviceWorker.controller;
  let touched = false, updated = false;
  ["pointerdown", "keydown"].forEach((t) => window.addEventListener(t, () => (touched = true), { once: true, capture: true }));
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) return;
    updated = true;
    if (!touched) location.reload();
  });
  navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).then((reg) => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;
      if (updated) location.reload(); else reg.update().catch(() => {});
    });
  }).catch(() => {});
}
boot();
