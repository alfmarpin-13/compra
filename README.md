# Compra

Lista de la compra de casa, compartida en tiempo real entre Alfonso y Mariluz. PWA sin paso de compilación (HTML, CSS y módulos ES) con Firebase Auth y Cloud Firestore. Se publica en GitHub Pages: <https://alfmarpin-13.github.io/compra/>.

El diseño y el comportamiento siguen `prototipo.html`; las reglas están en `CLAUDE.md`.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html`, `styles.css` | Carcasa y estilos (identidad «Lima») |
| `js/app.js` | Interfaz, eventos y acciones |
| `js/db.js` | Firebase: sesión, lecturas en tiempo real, historial y escrituras |
| `js/parser.js` | Intérprete de lo que se escribe o se dicta |
| `js/data.js` | Categorías, palabras clave, iconos por producto y tiendas iniciales |
| `js/util.js` | Texto, distancia de edición y fechas en Europe/Madrid |
| `js/iconos.js` | Iconos Lucide (ISC) y OpenMoji (CC BY-SA 4.0), generados |
| `js/config.js` | **Configuración web de Firebase (hay que rellenarla)** |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA |
| `firestore.rules` | Reglas de seguridad para pegar en la consola |

## Puesta en marcha (una sola vez)

1. **Crear el proyecto.** En <https://console.firebase.google.com> → *Añadir proyecto* → nombre «compra». Analytics no hace falta. Se queda en el plan gratuito Spark.
2. **Usuarios.** *Authentication* → *Comenzar* → *Método de inicio de sesión* → *Correo electrónico/contraseña* → activar (sin «vínculo de correo»). En *Usuarios* → *Agregar usuario*: `alfonso@compra.app` y `mariluz@compra.app`, cada uno con su contraseña. Copia el **UID** de cada uno (columna «UID de usuario»).
   En *Authentication* → *Configuración* → *Acciones de usuario*, desmarca **Habilitar creación (registro)** para que nadie pueda darse de alta.
3. **Base de datos.** *Firestore Database* → *Crear base de datos* → ubicación europea (`europe-southwest1` Madrid, o `eur3`) → *modo de producción*. En la pestaña *Reglas*, pega el contenido de `firestore.rules`, sustituye `UID_ALFONSO` y `UID_MARILUZ` por los UID del paso 2 y pulsa *Publicar*.
4. **Configuración web.** *Configuración del proyecto* (rueda dentada) → *Tus apps* → icono `</>` → apodo «compra» (sin Hosting) → copia los valores del objeto `firebaseConfig` en `js/config.js`. No son secretos: la protección la dan las reglas.
5. **Dominio autorizado.** *Authentication* → *Configuración* → *Dominios autorizados* → *Agregar dominio* → `alfmarpin-13.github.io`.
6. **Publicar.** En GitHub → repo `compra` → *Settings* → *Pages* → *Deploy from a branch* → `main` y carpeta `/ (root)`.

Al entrar por primera vez se crean solas las tiendas iniciales. La despensa empieza vacía y se llena con lo que apuntéis.

## En el iPhone

Abre la dirección en Safari → botón *Compartir* → *Añadir a pantalla de inicio*. Se abre a pantalla completa con el icono de la cesta.

«Pulsa y habla» usa el reconocimiento de voz del navegador. Si no está disponible (pasa a veces en la app añadida a la pantalla de inicio), el botón pasa a «Dictar» y abre el campo de texto: usa el micro del teclado del iPhone y la app interpreta el texto igual.

## Publicar cambios

Sube `VERSION` en `sw.js` (por ejemplo `compra-v2`) en cada cambio para que los teléfonos descarguen la versión nueva; se aplica en la siguiente apertura.

## Lecturas de Firestore

Para no gastar el cupo gratuito, la app escucha en tiempo real solo lo pendiente, lo tachado hoy, la despensa y las tiendas. El historial se lee de la caché local y al servidor solo se le pide lo nuevo desde la última vez. Lo tachado hace más de 12 meses se borra al abrir el historial.

## Licencias

- Iconos de producto: [OpenMoji](https://openmoji.org), CC BY-SA 4.0.
- Iconos de interfaz y categoría: [Lucide](https://lucide.dev), ISC.
- Tipografías: Bricolage Grotesque y Figtree, OFL, incluidas en `fonts/` con su licencia.
- Logos de tiendas (`icons/tiendas/`): marcas de sus propietarios, en versión de una tinta solo para uso doméstico.
