// Copia de seguridad de la despensa y las tiendas (no la lista ni el historial de compras).
// La ejecuta GitHub Actions cada noche. Lee Firestore con una cuenta de servicio guardada en el
// secreto FIREBASE_CUENTA_SERVICIO y escribe copia/despensa.json.cifrado y copia/tiendas.json.cifrado.
//
// El repositorio es PÚBLICO: la copia se guarda CIFRADA (AES-256-GCM, clave derivada con scrypt del
// secreto COPIA_CLAVE). Sin esa clave no se puede leer. Si falta la clave, no se escribe nada.
// Para leerla: COPIA_CLAVE='…' node scripts/descifrar-copia.mjs copia/despensa.json.cifrado
// Sin dependencias: solo Node 20.
import { createSign, createCipheriv, createHmac, randomBytes, scryptSync } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";

/** Cifra el texto. La «huella» (HMAC) sirve para saber si ha cambiado sin descifrar ni volver a guardar. */
export function cifrar(texto, clave) {
  const salt = randomBytes(16), iv = randomBytes(12);
  const key = scryptSync(clave, salt, 32, { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const c = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([c.update(texto, "utf8"), c.final()]);
  return { v: 1, alg: "aes-256-gcm+scrypt", huella: huella(texto, clave), salt: salt.toString("base64"), iv: iv.toString("base64"), tag: c.getAuthTag().toString("base64"), data: data.toString("base64") };
}
export const huella = (texto, clave) => createHmac("sha256", clave).update(texto).digest("hex");
async function guardar(ruta, texto, clave) {
  try { const viejo = JSON.parse(await readFile(ruta, "utf8")); if (viejo.huella === huella(texto, clave)) return; } catch (e) {}
  await writeFile(ruta, JSON.stringify(cifrar(texto, clave), null, 1) + "\n");
}

let sa = null, project = "";

const b64 = (x) => Buffer.from(typeof x === "string" ? x : JSON.stringify(x)).toString("base64url");
async function token() {
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: "RS256", typ: "JWT" });
  const body = b64({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/datastore", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 });
  const sig = createSign("RSA-SHA256").update(`${head}.${body}`).sign(sa.private_key, "base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${head}.${body}.${sig}` }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("No se pudo obtener el token: " + JSON.stringify(j));
  return j.access_token;
}

// Valor de Firestore (REST) → JSON normal.
export function plain(v) {
  if (!v || typeof v !== "object") return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(plain);
  if ("mapValue" in v) return fields(v.mapValue.fields || {});
  return null;
}
export const fields = (f) => Object.fromEntries(Object.keys(f).sort().map((k) => [k, plain(f[k])]));

async function list(col, tk) {
  const out = [];
  let pageToken = "";
  do {
    const u = new URL(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${col}`);
    u.searchParams.set("pageSize", "300");
    if (pageToken) u.searchParams.set("pageToken", pageToken);
    const r = await fetch(u, { headers: { authorization: `Bearer ${tk}` } });
    const j = await r.json();
    if (j.error) throw new Error(`${col}: ${j.error.message}`);
    for (const d of j.documents || []) out.push({ id: d.name.split("/").pop(), ...fields(d.fields || {}) });
    pageToken = j.nextPageToken || "";
  } while (pageToken);
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  sa = JSON.parse(process.env.FIREBASE_CUENTA_SERVICIO || "null");
  const clave = process.env.COPIA_CLAVE || "";
  if (!sa || !sa.client_email || !sa.private_key) {
    console.error("Falta el secreto FIREBASE_CUENTA_SERVICIO (el JSON de la cuenta de servicio).");
    process.exit(1);
  }
  if (clave.length < 20) {
    console.error("Falta el secreto COPIA_CLAVE (mínimo 20 caracteres). Sin él no se guarda nada: el repositorio es público.");
    process.exit(1);
  }
  project = sa.project_id;
  const tk = await token();
  const productos = (await list("products", tk)).map(({ createdAt, updatedAt, ...p }) => p); // sin fechas: la copia solo cambia si cambia algo de verdad
  const tiendas = await list("stores", tk);
  await mkdir("copia", { recursive: true });
  await guardar("copia/despensa.json.cifrado", JSON.stringify(productos, null, 2) + "\n", clave);
  await guardar("copia/tiendas.json.cifrado", JSON.stringify(tiendas, null, 2) + "\n", clave);
  console.log(`Copia cifrada: ${productos.length} productos y ${tiendas.length} tiendas.`);
}
