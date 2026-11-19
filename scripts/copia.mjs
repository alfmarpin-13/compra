// Copia de seguridad de la despensa y las tiendas (no la lista ni el historial de compras).
// La ejecuta GitHub Actions cada noche. Lee Firestore con una cuenta de servicio guardada en el
// secreto FIREBASE_CUENTA_SERVICIO y escribe copia/despensa.json y copia/tiendas.json.
// Sin dependencias: solo Node 20.
import { createSign } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

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
  if (!sa || !sa.client_email || !sa.private_key) {
    console.error("Falta el secreto FIREBASE_CUENTA_SERVICIO (el JSON de la cuenta de servicio).");
    process.exit(1);
  }
  project = sa.project_id;
  const tk = await token();
  const productos = (await list("products", tk)).map(({ createdAt, updatedAt, ...p }) => p); // sin fechas: la copia solo cambia si cambia algo de verdad
  const tiendas = await list("stores", tk);
  await mkdir("copia", { recursive: true });
  await writeFile("copia/despensa.json", JSON.stringify(productos, null, 2) + "\n");
  await writeFile("copia/tiendas.json", JSON.stringify(tiendas, null, 2) + "\n");
  console.log(`Copia hecha: ${productos.length} productos y ${tiendas.length} tiendas.`);
}
