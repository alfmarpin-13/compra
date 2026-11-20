// Descifra una copia de seguridad: COPIA_CLAVE='…' node scripts/descifrar-copia.mjs copia/despensa.json.cifrado
import { createDecipheriv, scryptSync } from "node:crypto";
import { readFile } from "node:fs/promises";

export function descifrar(o, clave) {
  const key = scryptSync(clave, Buffer.from(o.salt, "base64"), 32, { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const d = createDecipheriv("aes-256-gcm", key, Buffer.from(o.iv, "base64"));
  d.setAuthTag(Buffer.from(o.tag, "base64"));
  return Buffer.concat([d.update(Buffer.from(o.data, "base64")), d.final()]).toString("utf8");
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const clave = process.env.COPIA_CLAVE || "";
  if (!clave || !process.argv[2]) { console.error("Uso: COPIA_CLAVE='…' node scripts/descifrar-copia.mjs copia/despensa.json.cifrado"); process.exit(1); }
  try { process.stdout.write(descifrar(JSON.parse(await readFile(process.argv[2], "utf8")), clave)); }
  catch (e) { console.error("No se puede descifrar: clave incorrecta o archivo dañado."); process.exit(1); }
}
