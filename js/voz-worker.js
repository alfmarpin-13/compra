// Reconocimiento de voz en el propio dispositivo: Whisper (modelo «base», cuantizado) con transformers.js.
// Va en un worker para no congelar la pantalla mientras transcribe. El modelo se descarga una sola vez
// de Hugging Face (Xenova/whisper-base) y queda guardado en la caché del navegador; el motor (onnxruntime)
// va en vendor/ y se guarda en la caché «compra-voz».
import { AutoProcessor, AutoTokenizer, WhisperForConditionalGeneration, env } from "../vendor/transformers.min.js";

const MODEL = "Xenova/whisper-base";
const VENDOR = new URL("../vendor/", import.meta.url).href;
const WASM = VENDOR + "ort-wasm-simd-threaded.asyncify.wasm";
const WASM_CACHE = "compra-voz-1";
const SIZES = { wasm: 26861777, "onnx/encoder_model_quantized.onnx": 23200850, "onnx/decoder_model_merged_quantized.onnx": 53707539 };

env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.wasmPaths = VENDOR;
env.backends.onnx.wasm.numThreads = 1; // GitHub Pages no permite el aislamiento que necesitan los hilos
env.backends.onnx.wasm.proxy = false;
// Para las pruebas: el modelo puede venir de otro servidor con la misma estructura que Hugging Face.
const qs = new URL(self.location.href).searchParams;
if (qs.get("host")) env.remoteHost = qs.get("host");

let loading = null, proc, tok, model, sp;
const prog = {}; // bytes descargados por archivo
const post = (m, t) => self.postMessage(m, t || []);
function report() {
  let loaded = 0, total = 0;
  for (const k of Object.keys(SIZES)) { total += SIZES[k]; loaded += Math.min(prog[k] || 0, SIZES[k]); }
  post({ type: "progress", loaded, total });
}

async function getWasm() {
  let cache = null;
  try { cache = await caches.open(WASM_CACHE); } catch (e) { /* sin Cache API */ }
  const hit = cache && (await cache.match(WASM));
  if (hit) { prog.wasm = SIZES.wasm; return hit.arrayBuffer(); }
  const res = await fetch(WASM, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo descargar el motor de voz (" + res.status + ")");
  const parts = [];
  let n = 0;
  const rd = res.body.getReader();
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    parts.push(value); n += value.length; prog.wasm = n; report();
  }
  const buf = new Uint8Array(n);
  let o = 0;
  for (const p of parts) { buf.set(p, o); o += p.length; }
  if (cache) { try { await cache.put(WASM, new Response(buf, { headers: { "Content-Type": "application/wasm" } })); } catch (e) {} }
  return buf.buffer;
}

function load() {
  if (loading) return loading;
  loading = (async () => {
    const t0 = performance.now();
    env.backends.onnx.wasm.wasmBinary = await getWasm();
    report();
    const progress_callback = (p) => {
      if (p.status === "progress" && p.file) { prog[p.file] = p.loaded; if (!SIZES[p.file] && p.total) SIZES[p.file] = p.total; report(); }
      if (p.status === "done" && p.file && SIZES[p.file]) { prog[p.file] = SIZES[p.file]; report(); }
    };
    [proc, tok, model] = await Promise.all([
      AutoProcessor.from_pretrained(MODEL, { progress_callback }),
      AutoTokenizer.from_pretrained(MODEL, { progress_callback }),
      WhisperForConditionalGeneration.from_pretrained(MODEL, { dtype: "q8", device: "wasm", progress_callback }),
    ]);
    sp = (t) => tok.convert_tokens_to_ids(t);
    // transformers.js descarta en generate() lo que no está en forward_params; sin esto, el codificador
    // (lo caro) se recalcularía en cada pasada aunque se le pase ya hecho.
    if (!model.forward_params.includes("encoder_outputs")) model.forward_params = [...model.forward_params, "encoder_outputs"];
    // Primera pasada en vacío: prepara el motor para que la primera frase de verdad no tarde más.
    await model.generate({ ...(await proc(new Float32Array(16000))), decoder_input_ids: [initIds()], max_new_tokens: 1 });
    return Math.round(performance.now() - t0);
  })();
  loading.catch(() => { loading = null; });
  return loading;
}

const initIds = () => [sp("<|startoftranscript|>"), sp("<|es|>"), sp("<|transcribe|>"), sp("<|notimestamps|>")];

/** «Pista» para Whisper con lo que soléis comprar y las tiendas: mejora mucho cómo escribe esos nombres.
 *  Se escribe como texto normal: «Leche, pan de molde, huevos… Mercadona, Lidl, frutería. Para la niña.» */
function promptIds(vocab, budget = 200) {
  const { products = [], stores = [], text = "" } = vocab || {};
  const enc = (s) => tok.encode(s, { add_special_tokens: false });
  if (text) return { ids: [sp("<|startofprev|>"), ...enc(" " + text).slice(-220)], used: 0 };
  const low = (x) => x.charAt(0).toLowerCase() + x.slice(1);
  const up = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const tailIds = enc((stores.length ? " " + up(stores.join(", ")) + "." : "") + " Para la niña.");
  const ids = [];
  let used = 0;
  for (const p of products) {
    const t = enc(ids.length ? ", " + low(p) : " " + up(p));
    if (ids.length + t.length + tailIds.length + 2 > budget) break;
    ids.push(...t); used++;
  }
  if (ids.length) ids.push(...enc("."));
  return { ids: [sp("<|startofprev|>"), ...ids, ...tailIds], used };
}

// Whisper, ante ruido o silencio, a veces repite una frase en bucle o suelta frases típicas de subtítulos.
const JUNK = /subt[ií]tulos? (realizados|por)|amara\.org|suscr[ií]bete|gracias por ver|gracias por su atenci[oó]n|¡?gracias!?$/i;
export function cleanText(s) {
  let w = String(s || "").replace(/\s+/g, " ").trim().split(" ");
  for (let n = 1; n <= 6; n++) {
    for (let i = 0; i + 2 * n <= w.length; i++) {
      const a = w.slice(i, i + n).join(" ").toLowerCase().replace(/[.,;!?¡¿]/g, "");
      let j = i + n, reps = 0;
      while (j + n <= w.length && w.slice(j, j + n).join(" ").toLowerCase().replace(/[.,;!?¡¿]/g, "") === a) { j += n; reps++; }
      if (reps >= 2) w.splice(i + n, j - i - n);
    }
  }
  let t = w.join(" ").trim();
  if (JUNK.test(t)) t = t.replace(JUNK, "").trim();
  return t.replace(/^[,.\s]+|[,\s]+$/g, "");
}

// Comparación aproximada (sin tildes, sin mayúsculas) para buscar en la despensa lo que suena parecido.
const nrm = (x) => String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
function lev(a, b) {
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
/** Productos (de los que no cupieron en la pista) que se parecen a algo de lo transcrito. */
export function similarProducts(text, products, max = 24) {
  const w = nrm(text).split(" ").filter(Boolean);
  const grams = [];
  for (let n = 1; n <= 3; n++) for (let i = 0; i + n <= w.length; i++) grams.push(w.slice(i, i + n).join(" "));
  // También las palabras pegadas («lechepan»): cada gram sin espacios.
  const scored = [];
  for (const p of products) {
    const k = nrm(p);
    if (k.length < 3) continue;
    const kk = k.replace(/ /g, "");
    let best = 9;
    for (const g of grams) {
      if (Math.abs(g.length - k.length) > Math.max(3, k.length * 0.5)) continue;
      best = Math.min(best, lev(g, k) / Math.max(g.length, k.length), lev(g.replace(/ /g, ""), kk) / Math.max(g.replace(/ /g, "").length, kk.length));
    }
    if (best <= 0.42) scored.push([best, p]);
  }
  return scored.sort((a, b) => a[0] - b[0]).slice(0, max).map((x) => x[1]);
}

async function run(audio, vocab) {
  await load();
  const t0 = performance.now();
  const feats = await proc(audio);
  const tm = { proc: Math.round(performance.now() - t0) };
  const secs = audio.length / 16000;
  const max_new_tokens = Math.min(160, Math.round(secs * 7) + 12);
  // El codificador del audio (lo que más tarda) se calcula una vez y sirve para las dos pasadas.
  const { encoder_outputs } = await model._prepare_encoder_decoder_kwargs_for_generation({
    inputs_tensor: feats.input_features, model_inputs: { ...feats }, model_input_name: "input_features", generation_config: model.generation_config,
  });
  tm.enc = Math.round(performance.now() - t0) - tm.proc;
  const decode = async (v, budget) => {
    const p = promptIds(v, budget);
    const dec = [...p.ids, ...initIds()];
    const out = await model.generate({ ...feats, encoder_outputs, decoder_input_ids: [dec], max_new_tokens });
    const ids = out.tolist()[0].map(Number).slice(dec.length);
    return { raw: tok.decode(ids, { skip_special_tokens: true }).trim(), used: p.used };
  };
  let t1 = performance.now();
  let r = await decode(vocab), pass = 1;
  tm.dec1 = Math.round(performance.now() - t1);
  // Si la despensa no cabe entera en la pista, segunda pasada (rápida) con lo que se parece a lo entendido.
  const products = (vocab && vocab.products) || [];
  if (products.length > r.used) {
    const cands = similarProducts(r.raw, products.slice(r.used));
    if (cands.length) {
      const set = new Set(cands);
      t1 = performance.now();
      // Pista más corta (lo parecido primero): la pasada tarda la mitad.
      r = await decode({ ...vocab, products: [...cands, ...products.filter((x) => !set.has(x))] }, 110);
      pass = 2; tm.dec2 = Math.round(performance.now() - t1);
    }
  }
  return { text: cleanText(r.raw), raw: r.raw, pass, tm, ms: Math.round(performance.now() - t0) };
}

self.onmessage = async (e) => {
  const { id, type } = e.data || {};
  try {
    if (type === "load") post({ id, type: "ready", ms: await load() });
    else if (type === "run") post({ id, type: "result", ...(await run(e.data.audio, e.data.vocab)) });
  } catch (err) {
    post({ id, type: "error", message: String((err && err.message) || err) });
  }
};
