# Compra: lista de la compra compartida

App web instalable (PWA) para la lista de la compra de casa, compartida en tiempo real entre **Alfonso** y **Mariluz**. Se usa sobre todo en iPhone 17 Pro (Safari y añadida a la pantalla de inicio) y también en el ordenador.

**Referencia obligatoria: `prototipo.html`.** Es un prototipo funcional, ya validado, del diseño y el comportamiento. Ábrelo y úsalo como fuente de verdad visual: maquetación, colores, tipografía, tamaños, textos y flujos. Lo que este documento dice y el prototipo no hace, o hace distinto, manda este documento. No copies del prototipo sus apaños de demo, que están listados en «Lo que NO hay que copiar».

---

## 1. Stack y restricciones

- **Sin paso de compilación.** HTML, CSS y JavaScript nativos (módulos ES). Igual que el repo hermano `alfmarpin-13/cartera`. Nada de npm, bundlers ni frameworks.
- **Archivos:** `index.html`, `app.js` (o varios módulos en `js/`), `styles.css`, `manifest.webmanifest`, `sw.js`, `icons/`. Si cabe cómodamente en un único `index.html` como Cartera, también vale.
- **Única excepción a «sin dependencias»:** el dictado usa `vendor/transformers.min.js` (@huggingface/transformers 4.3.2, Apache-2.0) y `vendor/ort-wasm-simd-threaded.asyncify.*` (onnxruntime-web, MIT, la versión exacta que pide esa transformers), copiados tal cual del paquete npm oficial, sin compilar nada. Sus licencias están en `vendor/`.
- **Hosting:** GitHub Pages en `https://alfmarpin-13.github.io/compra/`. Todas las rutas son relativas, porque la app vive en un subdirectorio.
- **Backend:** Firebase, en el plan gratuito Spark.
  - **Firebase Auth**, solo con email y contraseña. Se inicializa con `initializeAuth` (persistencia IndexedDB/local/sesión) y **sin** `popupRedirectResolver`: `getAuth()` carga un iframe de authDomain antes de dar la sesión y en el iPhone tardaba 40-50 s.
  - **Cloud Firestore**, con caché persistente local (`persistentLocalCache`) para que funcione sin conexión y sincronice al volver. Se usa `persistentSingleTabManager({ forceOwnership: true })` y `experimentalForceLongPolling: true` porque en el iPhone con datos móviles el multipestaña y el streaming provocaban arranques de 40-50 s.
  - SDK modular 10.14.1 **dentro de la app** (`vendor/firebase/`, copiado del paquete npm oficial; solo se cambia la importación interna de gstatic por `./firebase-app.js`). Decisión de seguridad de Alfonso: la app no ejecuta código de servidores externos.
- **Repositorio público.** No se sube ningún dato al repo. La configuración web de Firebase (apiKey, projectId…) no es secreta y puede ir en el código. La seguridad la dan las reglas de Firestore (sección 9).
- **Idioma:** toda la interfaz en español de España.
- **Rendimiento:** debe abrir al instante desde la pantalla de inicio. El service worker cachea la carcasa de la app. Además se guarda en `localStorage` una copia de lo último mostrado (`compra.snap`) solo para pintar al abrir mientras Firebase arranca; la fuente de verdad sigue siendo Firestore y la copia se sustituye en cuanto llegan sus datos.

## 2. Usuarios y acceso

- Solo dos usuarios: `alfonso` y `mariluz`.
- En la pantalla de entrada se escribe el usuario a secas. Por dentro se traduce a un email ficticio: `alfonso@compra.app` y `mariluz@compra.app`.
- Las cuentas las crea Alfonso a mano en la consola de Firebase. No hay registro, ni pantalla de alta, ni «olvidé mi contraseña».
- Sesión persistente: «Recordarme en este iPhone» marcado por defecto, con `browserLocalPersistence`.
- **Sin sesión no se muestra ningún dato**, aunque alguien tenga la URL.
- Para saber quién soy: la parte del email antes de la `@`, con la primera letra en mayúscula.
- **En pantalla, Mariluz se llama «Ilu»** (decisión de Alfonso). Por dentro todo sigue igual: la cuenta `mariluz@compra.app`, el valor «Mariluz» guardado en `addedBy`/`checkedBy`/`createdBy` y las reglas. Solo cambia lo que se ve, con `nombre()` de `js/data.js` (`MOSTRAR`), y al entrar vale escribir «ilu» o «mariluz» (`ALIAS_LOGIN`).

## 3. Modelo de datos (Firestore)

Hay una única casa, así que las colecciones van en la raíz.

```
stores/{storeId}
  name: string            // "Mercadona"
  kind: "generic" | "unique"
  order: number           // posición en la barra de tiendas
  aliases: string[]       // para reconocerla al escribir o dictar: ["mercadona","merca"]

products/{productId}      // la DESPENSA: catálogo de lo que soléis comprar
  name: string            // "Leche entera"
  nameKey: string         // normalizado sin tildes ni mayúsculas, para buscar y evitar duplicados
  category: string        // id de categoría (sección 6)
  storeId: string | null  // tienda habitual; null = «Cualquier súper»
  icon: string | null     // clave de icono (sección 7); null = icono de su categoría
  createdAt, updatedAt
  createdBy: "Alfonso" | "Mariluz" | null   // quién lo creó (para el aviso a la otra persona; los antiguos no lo tienen)

items/{itemId}            // la LISTA: cada vez que se apunta algo
  productId: string
  name, category, storeId // copia del producto en el momento de apuntarlo (storeId puede ser distinto «esta vez»)
  addedBy: "Alfonso" | "Mariluz"
  addedAt: timestamp
  checked: boolean
  checkedAt: timestamp | null
  checkedBy: string | null
```

- **Lista pendiente:** `items` con `checked == false`.
- **«Comprado hoy»:** `checked == true` y `checkedAt` dentro del día local de hoy (zona `Europe/Madrid`).
- **Historial:** `checked == true` y `checkedAt` anterior a hoy, agrupado por día. No hay que mover documentos: el paso al historial es solo una consulta. Mantén 12 meses y borra lo más antiguo de forma perezosa al abrir el historial.
- **«Os toca reponer»** se calcula en el cliente a partir del historial (sección 5.8).
- Todo con `onSnapshot`, en tiempo real.

## 4. Pantallas

Mismo diseño que el prototipo. Resumen:

1. **Entrada:** logo, «Compra.», frase, usuario, contraseña, «Recordarme en este iPhone» y «Entrar». Solo un error genérico: «No se ha podido verificar el usuario o la contraseña».
2. **Lista (principal).**
   - **Cabecera compacta:** las pestañas «Lista» / «Despensa» (con el logo como icono de la Lista) y dos botones: cambiar vista (casillas/lista) y menú ⋮. El Historial está solo dentro del menú. Solo iconos, sin fondo (decisión de Alfonso).
   - **Barra de tiendas** con desplazamiento horizontal. Primero «Todas N». Después solo las tiendas con algún artículo pendiente asignado a ellas mismas, más la tienda abierta en ese momento, cada una con su contador. Sin botón de editar tiendas en esta barra: Tiendas se abre desde el menú ⋮. Cambiar de filtro es instantáneo, sin animación. Si la tienda abierta se queda sin artículos suyos (se tachan, se borran o se quitan desde la despensa), su filtro desaparece y se vuelve a «Todas» sola; si se abrió ya vacía desde Tiendas, se respeta. En el ordenador, la rueda del ratón desplaza esta barra en horizontal y el borde derecho se difumina.
   - **Contenido:** artículos pendientes agrupados por categoría. **Categorías por orden alfabético** (Otros al final) y, dentro de cada una, **artículos por orden alfabético** (decisión de Alfonso; igual en la Despensa). Cada grupo lleva su icono, su nombre y un contador. Dos vistas, recordadas por dispositivo:
     - **Casillas** (por defecto): rejilla de 3 columnas. Cada casilla lleva el icono del producto en el color de su categoría y el nombre. La tienda va como logo o icono pequeño en la esquina superior derecha, sin texto (nada si es «Cualquier súper»). Si lo apuntó la otra persona, su inicial en un círculo arriba a la izquierda.
     - **Lista:** filas con círculo, nombre, tienda (o «Cualquier súper») y «· Mariluz» si lo apuntó la otra persona.
   - **«Comprado hoy · N»:** separador plegable al final. Desplegado, muestra lo tachado hoy, tachado y atenuado, con la nota «Toca uno para devolverlo a la lista. Mañana pasa solo al historial».
   - **Pestañas «Lista» y «Despensa» en la cabecera, con icono:** la cesta (logo) es la Lista y la estantería, la Despensa. La activa se abre y muestra su nombre, con una pastilla lima que se desliza de una a otra. Nada de títulos grandes ni subrayados. No son pantallas aparte. Lista y Despensa son dos páginas una al lado de la otra: al arrastrar a izquierda o derecha se ve llegar la otra y al soltar se coloca con muelle. Sin zoom (ni doble toque ni dos dedos).
   - **Barra inferior fija:** «Añadir» (sin «+»: el texto escrito empieza justo donde pone «Añadir»; al escribir la pastilla no cambia de color, decisiones de Alfonso) y, a la derecha, el botón redondo del micrófono (solo el icono), que se queda siempre. Al tocar «Añadir», esa misma pastilla se convierte en el campo de escribir (no se cambia por otra barra) y sube con el teclado, pegada a él (2 px; encima del teclado el iPhone pone su barra de flechas ⌃ ⌄ ✓, que una web no puede quitar); dentro solo hay una flecha para añadir. Se cierra tocando fuera o bajando el teclado. El micro, al tocarlo, se ensancha con fluidez hasta ocupar la barra («Escuchando… toca para terminar») y a la izquierda queda solo un botón redondo para cancelar; la barra no cambia de tamaño ni de sitio.
3. **Despensa** (pestaña junto a «Lista», misma cabecera).
   - **Buscador.** «+ Añadir» de la barra abre el mismo campo de escribir que la lista (y el micro igual): mismo intérprete y misma hoja «Esto es lo que he entendido», pero guarda solo en la despensa, sin apuntar en la lista, y marca lo que ya estaba. La ficha completa de un producto se abre manteniéndolo pulsado.
   - **Buscador** en forma de pastilla: «Buscar entre N productos».
   - **«Os toca reponer»**, con «Repasar» a la derecha.
   - **Todo el catálogo por categorías,** en casillas o lista según la vista elegida. Lo que ya está en la lista va resaltado con un check.
   - Si la búsqueda no encuentra nada: «No está en la despensa» y un botón «Añadir «X»», que abre la ficha con el nombre ya escrito.
4. **Historial:** ←, «Historial», buscador y tarjetas por día (cada artículo se borra también **deslizándolo hacia la izquierda**, que deja ver «Borrar» en rojo, con Deshacer) («Hoy», «Ayer», «Martes, 17 de noviembre»…) con «N artículos tachados», «Seleccionar todo el día» y casillas por artículo. Abajo, «Volver a añadir (N)», que se salta lo que ya está pendiente, y un botón con papelera para borrar lo seleccionado del historial (con Deshacer).
5. **Tiendas** (hoja inferior): lista de todas las tiendas con su tipo, lo pendiente y un lápiz. Tocar una abre la lista filtrada por esa tienda. Abajo, «Añadir tienda».
6. **Opciones** (botón ⋮): pantalla completa, no ventana emergente. En Opciones e Historial funciona el **gesto de volver del iPhone** (decisión de Alfonso): deslizar a la derecha, desde el borde o desde cualquier sitio, hace que la pantalla siga al dedo con la anterior asomando debajo; al soltar pasado ~1/3 o con un golpe rápido vuelve, si no se recoloca. Tiendas, Repasar la despensa, Historial; modo Como el iPhone / Claro / Oscuro directamente ahí; cuenta, Compartida con… y Cerrar sesión; versión y créditos.
7. **Barra inferior flotante y translúcida:** el contenido se desplaza por detrás de ella.

### Animaciones
- Las hojas no oscurecen el fondo (decisión de Alfonso: iOS no deja oscurecer la franja de la hora en la app instalada); se separan con sombra.
- Fluidas al estilo iOS, con curvas de muelle: hojas que suben y bajan, menú que se despliega desde su botón, pantallas que entran y salen por la derecha, cambio de pestaña deslizado y elementos de la lista que se recolocan. Sin animaciones si el iPhone tiene activado «Reducir movimiento».
- Avisos: pastilla compacta de una línea con «Deshacer» al lado.
- **Hojas:** se cierran también deslizándolas hacia abajo (desde el asa o la cabecera, o desde el contenido si está arriba del todo): siguen al dedo y, pasado ~1/4 o con un golpe rápido, se van; si no, vuelven con muelle.
- **Fluidez (v54; no lo rompas):**
  - Las pantallas se apilan: con Opciones o el Historial abiertos, la Lista (y Opciones bajo el Historial) siguen montadas debajo (`.scr.behind`, quietas a −28 % y sin desenfoque). El gesto de volver mueve esa pantalla real; no se construye nada al empezar a arrastrar.
  - En los gestos solo se cambian `transform` y `opacity`, una vez por fotograma (`requestAnimationFrame`). Nada de animar `filter`, `width` grandes ni sombras que cambian; el oscurecido es una capa (`.scr-dim`) con opacidad.
  - Repintado: `keep()`/`keepPane()` dejan un marcador para las partes cuyo HTML no ha cambiado (pantallas y las dos páginas), y solo se actualiza su clase o su `aria-hidden` cuando es lo único que cambia. Los avisos de Firestore se pintan con `renderSoon()` (uno por fotograma). El FLIP solo mide lo que se ve. Los anchos de las pestañas se miden una vez.
  - Se mide con la CPU frenada 4× (fotogramas de más de 20 ms durante cada gesto) antes de dar por buena una animación.

## 5. Reglas de funcionamiento

### 5.1 Tiendas genéricas, de especialidad y únicas
- **Genérica** (Mercadona, Hipercor, Lidl): su vista muestra los artículos asignados a ella, todos los de «Cualquier súper» (`storeId == null`) y también lo asignado a las tiendas de especialidad (lo de la Frutería sale en el Mercadona; decisión de Alfonso, v56).
- **De especialidad** (tienda única cuyo nombre indica qué vende; `ESPECIALIDAD` y `especialidad()` en `js/parser.js`): Frutería/Verdulería → Fruta y Verdura; Carnicería/Pollería → Carne y Charcutería; Pescadería/Marisquería → Pescado; Panadería/Horno → Pan y Bollería; Pastelería → Bollería; Charcutería; Quesería. Su vista muestra lo asignado a ella y lo de «Cualquier súper» de sus categorías. No es excluyente.
- **Única sin especialidad** (Farmacia): su vista muestra solo lo asignado a ella, y eso no sale en ninguna otra.
- En la barra, una tienda sale si tiene algo pendiente «suyo»: asignado a ella o, si es de especialidad, de «Cualquier súper» en sus categorías (`propios()`).
- La tienda dominante de una categoría (5.3) no cuenta si es de especialidad: lo nuevo de fruta se queda en «Cualquier súper», que ya sale en la Frutería.
- «Todas» lo muestra todo.
- El contador de cada tienda en la barra es lo que verías al abrirla.

### 5.2 Tachar
- Tocar un artículo pendiente lo tacha: `checked = true`, `checkedAt = ahora`, `checkedBy = yo`.
- **Se tacha en el sitio** (decisión de Alfonso): la casilla o fila se queda donde está, tachada, con una marca, **«Deshacer» dentro** y una barrita de tiempo; a los ~4,5 s se recoge hacia «Comprado hoy». Tocarla otra vez también deshace. Sin aviso abajo.
- Mientras se ve el «Deshacer», el artículo cuenta como pendiente en filtros y contadores; al deshacer (o al devolverlo desde «Comprado hoy») se ve como pendiente hasta que Firestore lo confirma (`pendVista()`), para que nada salte.
- Tocar un artículo en «Comprado hoy» lo devuelve a pendiente, sin aviso.
- Mantener pulsado (500 ms) abre su edición. En el ordenador, también con clic derecho o con un lápiz que aparece al pasar el ratón (solo en dispositivos con `hover`).

### 5.3 Añadir escribiendo
- «+ Añadir» abre un campo sobre la barra inferior: «Escribe qué necesitas».
- Mientras escribes, sugiere productos de la despensa: primero lo que «Os toca reponer» y luego lo que coincide.
- Se pueden escribir varios a la vez: «leche, pan de la panadería y pañales para la niña».
- **Separadores:** comas, « y », « e », «también». Se ignoran muletillas como «me hace falta», «necesito», «apunta» o «hay que comprar».
- **Interpretación de cada trozo:**
  - Se busca en la despensa tolerando faltas: distancia de edición normalizada de 0,26 o menos, singular o plural y sin tildes.
  - «de/del/en + tienda» fija la tienda; se reconoce por el nombre o los alias de la tienda.
  - «para la niña / de Lucía / del bebé» asigna la categoría Lucía.
  - «de/en cualquier súper / da igual dónde» fija «Cualquier súper».
  - Los números y las cantidades se descartan («dos pimientos» → Pimientos). **La app no guarda cantidades.**
  - Un producto que no está en la despensa se crea en ella, con la categoría deducida por palabras clave y «Otros» si no hay coincidencia.
- **Si todo está claro,** se añade directamente: todos los productos están ya en la despensa, sin faltas corregidas ni duplicados. Aviso: «Añadido: Leche entera · Mercadona» con Deshacer. **Lo nuevo siempre pasa por la hoja** (decisión de Alfonso), para poder revisar su categoría y su tienda.
- **Si no,** se abre la hoja **«Esto es lo que he entendido»** (o «¿Dónde lo apunto?» si es uno solo). Por cada artículo, una casilla para incluirlo, su categoría y tienda, y una nota según el caso:
  - corrección: «Entiendo «Plátanos» (escribiste «platnos»)»;
  - duplicado: «Ya está en la lista. No lo duplico»;
  - tienda habitual: «Normalmente lo apuntáis en Mercadona. ¿Lo dejo ahí o en cualquier súper?», con botones [Mercadona] [Cualquier súper] [Otra…];
  - producto nuevo: «Es nuevo. Lo de fruta soléis comprarlo en Frutería», usando la tienda dominante de esa categoría si reúne al menos el 60 %;
  - nombre contenido en otro producto («vino blanco» y ya está «Vino blanco cocinar»): **no se da por el mismo**; «Ya tenéis «Vino blanco cocinar». ¿Es lo mismo o es otro producto?» con [Es «…»] [Es otro] (por defecto, otro);
  - **categoría sugerida con «Cambiar»** (decisión de Alfonso): abre todas las categorías y lo elegido se guarda también en el producto de la despensa.
  - Botones: Cancelar y «Añadir N».
- **Aprendizaje:** si al añadir se elige una tienda o una categoría distinta de la habitual, pasa a ser la del producto en la despensa.
- Los artículos recién añadidos se resaltan brevemente. Lo que añade la otra persona aparece en tiempo real con el mismo resalte y un mini aviso (5.10).

### 5.4 Toca y habla
- **Como una nota de voz** (decisión de Alfonso: el reconocimiento de voz de Safari, `SpeechRecognition`, se quedaba sordo en la app instalada tras cancelar o tras la primera vez, y perdía palabras). **Tocar** el micro graba el audio y, al terminar, se transcribe **en el propio dispositivo** con Whisper (`js/voz.js` y `js/voz-worker.js`). No se usa `SpeechRecognition` ni «mantener pulsado» (el iPhone solo deja abrir el micro con un toque completo).
  - **Grabación:** `getUserMedia` + AudioWorklet (`js/voz-rec.js`; ScriptProcessor si no hay). Cada toque abre y cierra todo (micro y AudioContext), para que no quede nada a medias para la siguiente vez.
  - **Detector de voz por energía:** termina solo tras ~2 s de silencio después de hablar, o al volver a tocar; si en 8 s no se ha hablado, se para con «No te he oído». Recorta los silencios de los extremos y, si no ha habido voz, **no transcribe** (Whisper se inventa frases con el silencio). Máximo 30 s.
  - **Transcripción:** Whisper «base» cuantizado (`Xenova/whisper-base`, q8) con transformers.js y onnxruntime-web en `vendor/` (motor wasm de un hilo: GitHub Pages no permite el aislamiento que piden los hilos). Va en un worker para no congelar la pantalla. Idioma español forzado.
  - **Pista de vocabulario:** antes del audio se le da a Whisper un texto con lo pendiente, los productos de la despensa (los más comprados primero, hasta ~200 tokens) y las tiendas, escrito como texto normal («Leche, pan de molde… Mercadona, Lidl, frutería. Para la niña.»). Sube mucho el acierto con esos nombres. Si la despensa no cabe entera, hay una **segunda pasada** con una pista corta que pone primero los productos que se parecen a lo entendido en la primera; el codificador del audio (lo caro) se calcula una sola vez y se reutiliza (hay que añadir `encoder_outputs` a `forward_params`, porque transformers.js lo descarta si no).
  - **Descarga:** el modelo (~77 MB) se baja de Hugging Face la primera vez que se usa el micro y el motor (~27 MB) de `vendor/`; quedan guardados en el dispositivo (cachés `transformers-cache` y `compra-voz-1`, que el service worker no borra al cambiar de versión). Mientras, se ve «Preparando el dictado… N %». Después funciona sin conexión.
  - **En pantalla:** mientras graba, el micro ensanchado dice «Escuchando… toca para terminar» y sale el cartel «Te escucho…» con unas barritas que siguen el volumen de la voz. **El cartel flota encima del contenido, justo sobre la barra, sin desplazar ni mover la lista** (decisión de Alfonso). Al terminar, «Entendiendo…» hasta que se abre la hoja. La X (o tocar fuera) cancela en cualquier momento, también mientras entiende.
  - Lo dictado no trae comas fiables: el intérprete, solo para la voz, separa reconociendo productos de la despensa («leche pan de la panadería» → Leche, Pan en Panadería), perdona nombres de tienda mal oídos («lipercor», «frutiría») y muletillas deformadas al principio («abunta», «desecito»).
- El texto dictado pasa por el mismo intérprete de 5.3 y siempre termina en la hoja de confirmación.
- **Orden de tachado por voz:** «He comprado todo lo de Mercadona menos los huevos», y variantes como «ya tengo», «hemos cogido» o «excepto», abre la hoja **«Marcar como comprado»**. Lista los artículos que verías en esa tienda con casillas; las excepciones salen desmarcadas con «lo dejo pendiente». Al confirmar: «Se han tachado N artículos» con Deshacer, que los devuelve todos.
- **Comprobación de disponibilidad:** el botón es siempre el del micrófono; **no hay botón «Dictar»** y **nunca se abre el campo de escribir por su cuenta** (decisiones de Alfonso). Si no hay permiso, no hay soporte o no llega nada, solo sale un aviso corto.

### 5.5 Editar un artículo de la lista
- Hoja «Editar artículo» con: nombre, dónde se compra (chips: Cualquier súper y cada tienda), «Mover a…» (categorías) y Eliminar (con Deshacer).
- La nota «Se recordará para la próxima vez que lo apuntéis» indica que cambiar tienda o categoría también actualiza el producto en la despensa.

### 5.6 Editar la despensa
- Se abre manteniendo pulsado (o con el lápiz o el clic derecho en el ordenador) un producto de la Despensa, o con el «+» para uno nuevo.
- Hoja «Editar producto» / «Nuevo producto» con: nombre, dónde se compra, categoría y «Borrar de la despensa» (con Deshacer).
- Si el producto está pendiente en la lista, los cambios se aplican también allí.
- No se permiten dos productos con el mismo `nameKey`.
- En la Despensa, tocar un producto lo apunta en la lista o lo quita de ella.

### 5.7 Tiendas editables
- **Añadir:** nombre y tipo (Genérica: «Le caen también las cosas de «Cualquier súper», como los huevos»; Única: «Solo lo que se compra allí, como en la farmacia»).
- **Editar:** nombre, tipo, «Mover antes» y «Mover después» (cambian `order`).
- **Borrar:** pide confirmación. Lo asignado a esa tienda (artículos pendientes y productos de la despensa) pasa a «Cualquier súper».
- El nombre nuevo se añade a `aliases`.

### 5.8 Os toca reponer
- Para cada producto con dos o más compras en el historial: el intervalo es la mediana de días entre compras.
- Toca reponer si los días desde la última compra son al menos el 90 % del intervalo y no está ya pendiente.
- Se ordena por «retraso relativo».
- **«Repasar la despensa»** muestra esos productos uno a uno: «Comprado hace X días. Soléis comprarlo cada Y», con los botones Saltar y Añadir.

### 5.9 Lo que NO hay en la app
- Cantidades: ni gramos, ni kilos, ni unidades.
- «Empezar compra» / «Terminar compra», y el modo compra.
- Varias listas.
- Avisos de lo que tacha o borra la otra persona. Solo se avisa de lo que **añade** (5.10).
- Logos de marcas de supermercado. Cada tienda genérica lleva un hueco neutro (icono de tienda con borde discontinuo) donde más adelante podrá ir su logo monocromo.

### 5.10 Avisos de lo que añade la otra persona
Decisión de Alfonso (antes no había ninguno). Solo de lo que **añade la otra persona**, a la lista o a la despensa; nunca de lo que añades tú desde otro aparato, ni de lo que se tacha o se borra.
- **Con la app abierta:** mini aviso en la pastilla de siempre, sin «Deshacer»: «Ilu ha añadido Leche a la lista», «Ilu ha añadido Levadura a la despensa», «Ilu ha añadido 3 cosas a la lista y 2 a la despensa». Lo que llega en poco más de 1 s se junta en un aviso. Un producto creado al apuntar un artículo cuenta solo en la lista. Si tienes delante un aviso tuyo con «Deshacer», se espera a que se vaya.
- **Al volver a la app** (abrirla o traerla del segundo plano): cartel de dos líneas, «Mientras no estabas» y «Ilu ha añadido 7 cosas a la lista y 2 a la despensa», unos 9 s (se quita tocándolo). Cuenta lo añadido desde la última vez que la tuviste delante (`compra.visto.<usuario>` en `localStorage`, que se guarda al irse a segundo plano y cada 30 s). Mientras está en segundo plano no salen mini avisos, y al volver no se repite lo que ya cuenta el cartel.
- La despensa sabe quién creó cada producto por `createdBy`. Si las reglas pegadas en Firebase aún no lo admiten, la escritura se repite sin ese campo (no se pierde nada; solo no avisa de ese producto).

## 6. Datos iniciales

Al primer arranque, si `stores` está vacía, crea:

| order | id | name | kind | aliases |
|---|---|---|---|---|
| 0 | mercadona | Mercadona | generic | mercadona, merca |
| 1 | hipercor | Hipercor | generic | hipercor, corte ingles, el corte ingles |
| 2 | lidl | Lidl | generic | lidl, lidel |
| 3 | fruteria | Frutería | unique | fruteria, frutero |
| 4 | carniceria | Carnicería | unique | carniceria, carnicero |
| 5 | panaderia | Panadería | unique | panaderia, panadero, horno |
| 6 | farmacia | Farmacia | unique | farmacia |

**Categorías:** lista fija en el código (en pantalla se muestran por orden alfabético, con Otros al final). Cada una tiene un color para claro y otro para oscuro, en tonos tierra como los del prototipo.

1. Fruta
2. Verdura
3. Carne
4. Pescado y marisco
5. Charcutería
6. Quesos
7. Lácteos y huevos
8. Pan
9. Bollería y dulces (galletas incluidas)
10. Café e infusiones
11. Pasta y arroz
12. Legumbres
13. Conservas y salsas
14. Aceite y especias
15. Repostería (harina, azúcar…)
16. Aperitivos
17. Congelados
18. Bebidas
19. Lucía (cosas de la niña; color = el primario de la app)
20. Higiene
21. Limpieza
22. Hogar
23. Otros

**Despensa:** empieza vacía y se va llenando sola con lo que se apunta.

Las palabras clave para deducir la categoría de un producto nuevo están en `KW` dentro del prototipo; adáptalas a estas categorías.

## 7. Identidad visual «Lima»

Copia exacta del prototipo. Tokens:

```
Claro:  ground #F3F4EE · paper #FFFFFF · ink #132019 · muted #5D6A61
        primary #1C3A2D · on-primary #D9F56E · accent (lima) #D9F56E · on-accent #1C3A2D
        tint #E2EADD · line #E1E5DC · outline #A9B3AA · pressed #EBEEE5
Oscuro: ground #0E1511 · paper #18211B · ink #EDF3EA · muted #9AA79E
        primary #D9F56E · on-primary #0E1511 · accent #D9F56E · on-accent #0E1511
        tint #233029 · line #26312A · outline #4C5A51 · pressed #1E2922
```

- **Tipografía:** títulos en **Bricolage Grotesque** 800 con espaciado de letras de −1,2 px; texto en **Figtree** 400–700. Ambas incluidas en la app, en `fonts/` (licencia OFL), sin depender de Google Fonts.
- **Acento lima:** botón «Toca y habla» (fondo verde bosque y texto lima en claro), chip de tienda seleccionada, botón de despensa, insignias «Toca» e inicial de quién apuntó algo.
- **Logo:** `logo.svg` (cesta de mimbre verde bosque sobre lima). Se usa en:
  - la cabecera, a 32 px con esquinas de 9 px;
  - la pantalla de entrada;
  - el favicon;
  - los iconos PWA. Genera PNG de 180 (apple-touch-icon), 192 y 512, más una versión *maskable* con margen de seguridad. No pongas texto en el icono.
- **Iconos de producto: dibujos propios** (`js/productos.js`, decisión de Alfonso: nada de iconos de otros). Línea monocroma en cuadrícula de 48, trazo 2,2 con extremos redondeados (a 38 px en la casilla se ven con el mismo peso que los iconos de interfaz), coloreados con `currentColor` en el color de la categoría; solo puntos pequeños rellenos y detalles secundarios con opacidad. Las claves son códigos de emoji, solo como nombre interno (las usan `ICON_KW` y el campo `icon` guardado).
  - Diccionario de palabras clave → icono (`ICON_KW` en `js/data.js`), para que un producto nuevo («leche semidesnatada») encuentre su icono («leche») automáticamente.
  - Sin coincidencia, se usa el icono de su categoría.
  - Un icono nuevo se dibuja a mano con ese estilo; no se copian trazados de otros sets. En Opciones no hay atribución de iconos (Lucide y las tipografías llevan su licencia en el código y en `fonts/`).
- **Iconos de interfaz y de categoría:** trazo de 1,8 px en caja de 24, extremos redondeados, al estilo **Lucide** (licencia ISC). No reutilices los trazados del prototipo que vienen de otros proyectos sin comprobar su licencia; usa Lucide o dibújalos.
- El icono de la farmacia (la cruz) va relleno, no hueco (`RELLENOS` en `js/app.js`).
- Toques de al menos 44 px, contraste AA y respeto a `prefers-reduced-motion`.

## 8. PWA

- `manifest.webmanifest`: `name` «Compra», `short_name` «Compra», `display: standalone`, `start_url` y `scope` `./`, `background_color` = ground y `theme_color` = ground. Si el manifiesto no permite variar por tema, usa los colores del modo claro.
- `<meta name="theme-color">` actualizado según el tema (se sustituye el elemento entero, porque Safari no siempre repinta la franja de la hora si solo cambia el atributo). El cambio de tema es de una vez, sin transiciones sueltas (`cambiarTema()`: View Transition si hay, y `sin-trans` mientras se aplica), con `apple-mobile-web-app-capable` y la barra de estado acorde.
- `viewport-fit=cover` y márgenes con `env(safe-area-inset-*)` para la isla dinámica y el indicador de inicio.
- **Service worker:** precache de la carcasa (HTML, CSS, JS, tipografías de `fonts/` e iconos) con versión en el nombre de la caché. Los datos los gestiona la caché de Firestore. Al haber versión nueva, se aplica en la siguiente apertura, sin avisos.

## 9. Seguridad

Alfonso pidió hermeticidad total (v48). Lo que hay y por qué; no lo relajes sin decírselo:

- **Reglas de Firestore** (`firestore.rules`, pegadas a mano en la consola con los dos UID; Alfonso las pega, el repo lleva `UID_ALFONSO`/`UID_MARILUZ`): solo los dos UID leen y escriben; solo `stores`, `products` e `items`; campos cerrados con tipo y tamaño máximo (nombres ≤ 80, ids `^[A-Za-z0-9_-]{1,70}$`, `addedBy`/`checkedBy`/`createdBy` solo «Alfonso»/«Mariluz», etc.); en una modificación, los campos que no cambian no se recomprueban (un dato antiguo no bloquea tachar). Se prueban en el emulador de Firestore con todas las escrituras de la app y una batería de ataques antes de cambiarlas.
- **Sin código de fuera:** Firebase y la librería de voz van en `vendor/`. El modelo de voz se descarga de Hugging Face, pero es solo datos que corren en el sandbox de WebAssembly del worker.
- **CSP en `<meta>`** (`index.html`): `script-src 'self' 'wasm-unsafe-eval'`, sin scripts en línea (el tema va en `js/tema.js`), `connect-src` solo a Firestore, Identity Toolkit, Secure Token y Hugging Face, `img-src` admite `www.google.com` (Firestore lo usa para comprobar la conexión), `object-src`/`frame-src`/`base-uri` cerrados. `style-src` necesita `'unsafe-inline'` por los `style=""` de las plantillas. Si se añade un servicio nuevo, hay que añadirlo aquí.
- **Sin marcos:** `js/tema.js` no deja abrir la app dentro de otra web (GitHub Pages no permite la cabecera `frame-ancestors`).
- **Todo texto que venga de los datos pasa por `esc()`** antes de ir al HTML, también los identificadores en atributos.
- **Cerrar sesión** borra la copia local de Firestore (IndexedDB) y `compra.snap`, y recarga.
- **Fuera del código (lo hace Alfonso en las consolas):** clave de API restringida al dominio y a las tres APIs, alta de cuentas desactivada, protección contra enumeración de correos, contraseñas largas, verificación en dos pasos en Google y GitHub. **No hay copia de seguridad** (decisión de Alfonso): nada de workflows ni cuentas de servicio.

## 10. Lo que NO hay que copiar del prototipo

- La barra de estado falsa del iPhone, el marco de teléfono y el indicador de inicio dibujado.
- `window.__demo`, los datos de ejemplo (LIST0, CATALOG0, HISTORY0) y el guardado en `localStorage` como base de datos.
- El inicio de sesión simulado, la voz simulada con frases fijas y la sincronización simulada («Mariluz ha añadido…»).
- Las referencias internas a «Usuals», «palette», «plum/grove/tide» y el estilo de fondo con ilustraciones.

## 11. Configuración que hace Alfonso (guíale paso a paso cuando llegue el momento)

1. Crear el proyecto en Firebase (plan Spark).
2. Authentication → método Correo/contraseña → crear los usuarios `alfonso@compra.app` y `mariluz@compra.app`. En Configuración → Acciones de usuario, desactivar la creación de cuentas.
3. Firestore → crear la base de datos en una región europea (`europe-southwest1`, Madrid, o `eur3`) en modo producción → pegar las reglas con los UID.
4. Configuración del proyecto → añadir app web → copiar el objeto `firebaseConfig` en el código.
5. Authentication → Dominios autorizados → añadir `alfmarpin-13.github.io`.
6. GitHub → repo `compra` → Settings → Pages → desplegar desde `main`, carpeta raíz.

## 12. Versiones y forma de trabajar

- **Por bloques, no de uno en uno:** si Alfonso pide varias cosas seguidas, se reúnen y se suben juntas en una sola versión y un solo PR. No se publica una versión por cada cambio pequeño.
- **Nada directo a `main`.** Cada cambio va en su propia rama y llega a `main` con un PR. Alfonso no quiere revisarlos: el PR se fusiona en cuanto está listo y probado.
- **Título del PR con la versión:** «vN: resumen corto». La descripción dice qué cambia y cómo se ha probado.
- **Cada cambio en la web lleva versión nueva:** sube el número en `js/version.js` (`APP_VERSION` y `APP_DATE`) y el mismo número en `VERSION` de `sw.js` (`compra-vN`), y añade la entrada en `CHANGELOG.md`.
- Los cambios que no tocan la web (documentación) no suben versión.
- La versión se ve en el menú ⋮ y en Preferencias, debajo de «Cerrar sesión», en gris claro, para que Alfonso sepa si el iPhone tiene la última.

## 13. Criterios de aceptación

- [ ] Sin sesión, nada visible. Con usuario o contraseña incorrectos, solo el error genérico.
- [ ] Alfonso apunta algo en el iPhone y aparece en menos de 2 s en el de Mariluz, y al revés.
- [ ] Sin conexión: se puede apuntar y tachar, y al recuperar la conexión se sincroniza sin perder nada.
- [ ] «huevos» sin tienda → aparece en Mercadona, Hipercor y Lidl, y NO en Farmacia ni en Frutería.
- [ ] «plátanos» sin tienda → aparece en Frutería y en los súper; algo apuntado en Frutería sale también en Mercadona; lo de Farmacia solo en Farmacia.
- [ ] Una tienda sin artículos propios pendientes no sale en la barra, pero sí en Tiendas.
- [ ] «platnos, pan de la panadería y pañales para la niña» → hoja con Plátanos (corregido), Pan en Panadería y Pañales en Lucía.
- [ ] «dos pimientos» → «Pimientos», sin cantidad en ningún sitio.
- [ ] Tachar → la casilla se tacha en su sitio con «Deshacer», y Deshacer lo devuelve.
- [ ] Lo tachado hoy está en «Comprado hoy». Mañana está en el Historial bajo «Ayer».
- [ ] «He comprado todo lo de Mercadona menos los huevos» → hoja con todo menos huevos marcado; al confirmar, aviso con Deshacer.
- [ ] Sin micro o sin permiso, al tocarlo sale un aviso; sin botón «Dictar» y sin abrir el campo de escribir.
- [ ] Cancelar el micro y volver a tocarlo vuelve a oír, todas las veces. En silencio o con ruido no se inventa nada («No te he oído»).
- [ ] Editar en la despensa cambia también el artículo pendiente. Borrar una tienda pasa sus cosas a «Cualquier súper».
- [ ] Modo claro y oscuro idénticos al prototipo; casillas y lista. En el ordenador: lápiz al pasar el ratón y rueda en la barra de tiendas.
- [ ] Se instala en el iPhone con el icono de la cesta y abre a pantalla completa.
