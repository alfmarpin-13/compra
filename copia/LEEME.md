# Copia de seguridad

GitHub guarda aquí cada noche, de forma automática, la **despensa** (`despensa.json.cifrado`) y las **tiendas** (`tiendas.json.cifrado`).
No se copian la lista de la compra ni el historial de compras.

El repositorio es público, así que las copias van **cifradas** (AES-256-GCM) con la clave del secreto `COPIA_CLAVE`. Sin esa clave no se pueden leer. Guarda la clave también fuera de GitHub (por ejemplo, en el llavero del iPhone): GitHub no deja volver a verla.

Para leer una copia: `COPIA_CLAVE='…' node scripts/descifrar-copia.mjs copia/despensa.json.cifrado`

Cada copia queda en el historial de cambios del repositorio, así que se puede volver a cualquier día.
Para restaurarlas en Firebase, pídeselo a Claude con estos archivos (y la clave a mano).
