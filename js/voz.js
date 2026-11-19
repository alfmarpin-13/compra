// Toca y habla: graba un mensaje de voz y luego lo transcribe en el propio dispositivo (Whisper, en un worker).
// Sustituye al reconocimiento de voz de Safari, que en la app instalada se quedaba sordo tras la primera vez.
//
// Grabación: getUserMedia + AudioWorklet (o ScriptProcessor si no hay). Cada vez se abre y se cierra todo
// (micro, AudioContext), así no queda nada a medias para la siguiente.
// Detector de voz por energía: sabe si has hablado, para solo tras un silencio y recorta los silencios
// antes de transcribir. Si no has dicho nada, ni siquiera se transcribe (Whisper se inventa frases con el silencio).

const RATE = 16000;
export const SILENCE_MS = 2000;  // silencio tras hablar para terminar solo (pausas entre cosas, sin cortar)
export const NOTHING_MS = 8000;  // sin hablar en este tiempo, se para
export const MAX_MS = 30000;     // grabación máxima
const MIN_SPEECH_MS = 250;       // voz mínima para considerar que has dicho algo

let worker = null, seq = 0;
const waiting = new Map();
let onProgress = null;

function getWorker() {
  if (worker) return worker;
  const u = new URL("./voz-worker.js", import.meta.url);
  const host = new URLSearchParams(location.search).get("vozhost");
  if (host) u.searchParams.set("host", host);
  worker = new Worker(u, { type: "module" });
  worker.onmessage = (e) => {
    const m = e.data || {};
    if (m.type === "progress") { onProgress && onProgress(m.loaded, m.total); return; }
    const w = waiting.get(m.id);
    if (!w) return;
    waiting.delete(m.id);
    if (m.type === "error") w.reject(new Error(m.message)); else w.resolve(m);
  };
  worker.onerror = (e) => {
    const err = new Error((e && e.message) || "El reconocimiento de voz ha fallado");
    for (const w of waiting.values()) w.reject(err);
    waiting.clear();
    worker = null;
  };
  return worker;
}
function call(msg, transfer) {
  const id = ++seq;
  return new Promise((resolve, reject) => {
    waiting.set(id, { resolve, reject });
    getWorker().postMessage({ ...msg, id }, transfer || []);
  });
}

let modelState = "none"; // none | loading | ready
let loadP = null;
/** Prepara el modelo (lo descarga la primera vez). Se llama al empezar a grabar para ganar tiempo. */
export function preload(progress) {
  if (progress) onProgress = progress;
  if (!loadP) {
    modelState = "loading";
    loadP = call({ type: "load" }).then((m) => {
      modelState = "ready";
      // Pide al navegador que no borre el modelo para hacer sitio (son ~100 MB que no queremos volver a bajar).
      try { navigator.storage && navigator.storage.persist && navigator.storage.persist().catch(() => {}); } catch (e) {}
      return m;
    }, (e) => { modelState = "none"; loadP = null; throw e; });
  }
  return loadP;
}
export const modelReady = () => modelState === "ready";
export function setProgress(fn) { onProgress = fn; }

/** Transcribe audio a 16 kHz. vocab = { products: [...], tail: [...] } para orientar al modelo. */
export async function transcribe(audio, vocab) {
  await preload();
  return call({ type: "run", audio, vocab }, [audio.buffer]);
}

export const supported = () =>
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (window.AudioContext || window.webkitAudioContext) && window.Worker && window.WebAssembly);

/* ---------- Grabación ---------- */
let R = null; // grabación en curso

/**
 * Empieza a grabar. Hay que llamarla dentro del toque (el iPhone solo deja abrir el audio así).
 * opts: { onLevel(0..1), onReady(), onSpeech(), onAutoStop(reason) } — reason: "silence" | "nothing" | "max"
 */
export async function startRecording(opts = {}) {
  if (R) cancelRecording();
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = new AC();
  // resume() dentro del toque: si no, en el iPhone el contexto puede quedarse parado.
  try { ctx.resume(); } catch (e) {}
  const rec = { ctx, chunks: [], flags: [], stream: null, node: null, src: null, sink: null, opts, t0: performance.now(),
    heard: false, vad: new Vad(), done: false, timer: null };
  R = rec;
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  } catch (e) {
    try { ctx.close(); } catch (x) {}
    if (R === rec) R = null;
    const err = new Error(e && e.name === "NotAllowedError" ? "permiso" : "micro");
    err.cause = e;
    throw err;
  }
  if (R !== rec) { stream.getTracks().forEach((t) => t.stop()); try { ctx.close(); } catch (x) {} return false; }
  rec.stream = stream;
  if (!(await wire(rec, ctx))) return false;
  rec.t0 = performance.now();
  rec.timer = setInterval(() => tick(rec), 100);
  opts.onReady && opts.onReady();
  return true;
}

/** Conecta el micro al procesador de audio en ese AudioContext. */
async function wire(rec, ctx) {
  rec.ctx = ctx;
  if (ctx.state !== "running") { try { await ctx.resume(); } catch (e) {} }
  const src = ctx.createMediaStreamSource(rec.stream);
  rec.src = src;
  const onChunk = (data) => { if (rec.ctx === ctx) feed(rec, data); };
  let node = null;
  if (ctx.audioWorklet && window.AudioWorkletNode) {
    try {
      await ctx.audioWorklet.addModule(new URL("./voz-rec.js", import.meta.url));
      if (R !== rec || rec.ctx !== ctx) return false;
      node = new AudioWorkletNode(ctx, "compra-rec", { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1 });
      node.port.onmessage = (e) => onChunk(e.data);
    } catch (e) { node = null; }
  }
  if (!node) {
    node = ctx.createScriptProcessor(4096, 1, 1);
    node.onaudioprocess = (e) => onChunk(new Float32Array(e.inputBuffer.getChannelData(0)));
  }
  rec.node = node;
  // Salida a volumen cero: algunos navegadores no procesan el nodo si no llega a ningún sitio.
  const sink = ctx.createGain(); sink.gain.value = 0;
  src.connect(node); node.connect(sink); sink.connect(ctx.destination);
  rec.sink = sink;
  return true;
}

/** Si en 1,2 s no ha llegado sonido de verdad (el iPhone a veces da ceros si el audio se abrió antes de dar
 *  permiso al micro), se vuelve a conectar el micro en un AudioContext nuevo, una sola vez. */
async function rewire(rec) {
  rec.rewired = true;
  unwire(rec);
  rec.chunks = []; rec.flags = []; rec.vad = new Vad(); rec.heard = false;
  const AC = window.AudioContext || window.webkitAudioContext;
  try { await wire(rec, new AC()); } catch (e) { /* se queda como estaba: lo parará «nothing» */ }
}

/**
 * Detector de voz por energía (exportado para poder probarlo). Ruido de fondo = percentil 10 del volumen de
 * los últimos ~6 s. Al hablar siempre hay huecos entre sílabas y palabras, así que ese percentil se queda en
 * el ruido; un ruido constante (calle, campana, súper) lo sube a su nivel y deja de contar como voz. Los trozos
 * con voz entran en la cuenta solo uno de cada tres, para que hablar seguido no suba el «ruido» y te corte
 * (salvo que la «voz» dure más de 4 s sin un solo hueco, que es un ruido que acaba de empezar).
 */
export class Vad {
  constructor() { this.hist = []; this.n = 0; this.t = 0; this.speechMs = 0; this.heard = false; this.lastVoiceT = 0; this.floor = 0; this.firstT = -1; this.lastT = -1; }
  push(rms, ms) {
    this.t += ms; this.n++;
    const sorted = this.hist.slice().sort((x, y) => x - y);
    this.floor = sorted.length ? sorted[Math.floor(sorted.length * 0.1)] : rms;
    let voice = this.n > 2 && rms > Math.max(this.floor * 3.2, 0.006);
    this.run = voice ? (this.run || 0) + ms : 0;
    this.recent = (this.recent || []).concat(rms).slice(-Math.round(1500 / ms));
    // Una «voz» sin ningún hueco durante más de 4 s no es voz: es un ruido que acaba de empezar (campana,
    // grifo…). Pasa a ser el nuevo ruido de fondo y se descuenta lo que se había tomado por voz.
    if (voice && this.run > 4000) {
      this.hist = this.recent.slice();
      this.speechMs = Math.max(0, this.speechMs - this.run);
      if (this.speechMs < MIN_SPEECH_MS) this.heard = false;
      this.lastVoiceT = Math.min(this.lastVoiceT, this.t - this.run);
      if (this.lastT >= this.t - this.run) this.lastT = this.t - this.run;
      this.run = 0;
      return false;
    }
    if (!voice || this.n % 3 === 0) {
      this.hist.push(rms);
      if (this.hist.length > Math.round(6000 / ms)) this.hist.shift();
    }
    if (voice) {
      this.speechMs += ms; this.lastVoiceT = this.t;
      if (this.firstT < 0) this.firstT = this.t - ms;
      this.lastT = this.t;
      if (!this.heard && this.speechMs >= MIN_SPEECH_MS) { this.heard = true; return "heard"; }
    }
    return voice;
  }
  silenceMs() { return this.t - this.lastVoiceT; }
}

function feed(rec, data) {
  if (rec.done || R !== rec) return;
  rec.chunks.push(data);
  let s = 0;
  for (let i = 0; i < data.length; i++) s += data[i] * data[i];
  const rms = Math.sqrt(s / data.length);
  if (rms > 0) rec.gotAudio = true;
  const ms = (data.length / rec.ctx.sampleRate) * 1000;
  const v = rec.vad.push(rms, ms);
  rec.flags.push(!!v);
  if (v === "heard") rec.opts.onSpeech && rec.opts.onSpeech();
  rec.heard = rec.vad.heard;
  rec.opts.onLevel && rec.opts.onLevel(Math.min(1, rms / 0.12));
}

function tick(rec) {
  if (rec.done || R !== rec) return;
  const now = performance.now();
  if (!rec.gotAudio && !rec.rewired && now - rec.t0 > 1200) { rewire(rec); return; }
  let reason = null;
  if (now - rec.t0 > MAX_MS) reason = "max";
  else if (rec.heard && rec.vad.silenceMs() > SILENCE_MS) reason = "silence";
  else if (!rec.heard && now - rec.t0 > NOTHING_MS) reason = "nothing";
  if (reason) rec.opts.onAutoStop && rec.opts.onAutoStop(reason);
}

function unwire(rec) {
  try { rec.node && rec.node.port && (rec.node.port.onmessage = null); } catch (e) {}
  try { rec.node && (rec.node.onaudioprocess = null); } catch (e) {}
  try { rec.src && rec.src.disconnect(); } catch (e) {}
  try { rec.node && rec.node.disconnect(); } catch (e) {}
  try { rec.sink && rec.sink.disconnect(); } catch (e) {}
  try { rec.ctx.close(); } catch (e) {}
}
function close(rec) {
  rec.done = true;
  clearInterval(rec.timer);
  unwire(rec);
  if (rec.stream) rec.stream.getTracks().forEach((t) => { try { t.stop(); } catch (e) {} });
}

export function cancelRecording() {
  const rec = R;
  R = null;
  if (rec) close(rec);
}
export const isRecording = () => !!R;

/** Para y devuelve { audio (Float32Array a 16 kHz, sin los silencios de los extremos), heard, secs }. */
export async function stopRecording() {
  const rec = R;
  R = null;
  if (!rec) return { audio: null, heard: false, secs: 0 };
  const rate = rec.ctx.sampleRate;
  close(rec);
  if (!rec.heard || !rec.chunks.length) return { audio: null, heard: false, secs: 0 };
  // Recorte: desde un poco antes de la primera voz hasta un poco después de la última.
  const first = rec.flags.indexOf(true), last = rec.flags.lastIndexOf(true);
  const per = rec.chunks[0].length;
  const pre = Math.ceil((0.35 * rate) / per), postN = Math.ceil((0.5 * rate) / per);
  const a = Math.max(0, first - pre), b = Math.min(rec.chunks.length, last + 1 + postN);
  const parts = rec.chunks.slice(a, b);
  const n = parts.reduce((s, p) => s + p.length, 0);
  const raw = new Float32Array(n);
  let o = 0;
  for (const p of parts) { raw.set(p, o); o += p.length; }
  const audio = await resample(raw, rate);
  return { audio, heard: true, secs: audio.length / RATE };
}

async function resample(x, rate) {
  if (rate === RATE) return x;
  const len = Math.max(1, Math.round((x.length * RATE) / rate));
  try {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const oc = new OAC(1, len, RATE);
    const buf = oc.createBuffer(1, x.length, rate);
    buf.getChannelData(0).set(x);
    const s = oc.createBufferSource();
    s.buffer = buf; s.connect(oc.destination); s.start();
    const r = await oc.startRendering();
    return new Float32Array(r.getChannelData(0));
  } catch (e) {
    // Plan B: media de cada tramo (filtro paso bajo sencillo) e interpolación.
    const out = new Float32Array(len), k = rate / RATE;
    for (let i = 0; i < len; i++) {
      const s0 = Math.floor(i * k), s1 = Math.min(x.length, Math.floor((i + 1) * k));
      let s = 0; for (let j = s0; j < s1; j++) s += x[j];
      out[i] = s1 > s0 ? s / (s1 - s0) : x[Math.min(s0, x.length - 1)];
    }
    return out;
  }
}
