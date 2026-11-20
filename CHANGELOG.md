# Historial de versiones

La versión de la app se ve en Preferencias, debajo de «Cerrar sesión». Cada versión llega a `main` mediante un PR con el número en el título.

## v48 · 19/11/2026
- Seguridad: Firebase va dentro de la app (ya no se carga de servidores de Google al abrir) y una política de seguridad (CSP) impide ejecutar código de fuera o conectar con sitios que no sean Firebase y el modelo de voz.
- La app no se deja abrir dentro de otra página web.
- Cerrar sesión borra también los datos que Firestore guarda en el iPhone.
- Reglas de Firestore más estrictas (tamaños, tipos, nombres de quién apunta, identificadores), probadas en el emulador. Hay que pegarlas en la consola.
- La copia de seguridad nocturna se guarda cifrada (el repositorio es público). Necesita el secreto COPIA_CLAVE.

## v47 · 19/11/2026
- Escribiendo, la barra queda pegada al teclado: 12 px más cerca de la barra de flechas que pone el iPhone (esa barra no se puede quitar desde una web).

## v46 · 19/11/2026
- Al tocar el micro ya no se mueve la lista: el cartel «Te escucho…» flota encima del contenido, justo sobre la barra, en la Lista y en la Despensa.

## v45 · 19/11/2026
- Barra de abajo: «Añadir» sin el «+», y el texto que escribes empieza justo donde ponía «Añadir». Al tocarla ya no cambia de color: es la misma pastilla, con el cursor y la flecha.

## v44 · 19/11/2026
- Gesto de volver del iPhone en Opciones e Historial: deslizando hacia la derecha (desde el borde o desde cualquier sitio) la pantalla sigue al dedo y debajo asoma la anterior; al soltar pasado un tercio, o con un golpe rápido, vuelve; si no, se recoloca con muelle.

## v43 · 19/11/2026
- Micro nuevo, como una nota de voz: graba lo que dices y luego lo transcribe en el propio iPhone con Whisper (ya no se usa el reconocimiento de voz de Safari, que tras cancelar o tras la primera vez se quedaba sordo y se comía palabras). Cada toque abre y cierra el micro de cero, así que funciona todas las veces.
- Termina solo tras ~2 s de silencio, o al volver a tocar. La X o tocar fuera cancelan, también mientras «Entendiendo…». Si no has dicho nada (o solo hay ruido), avisa en vez de inventarse algo.
- Mientras grabas, unas barritas siguen tu voz. La primera vez se descarga el modelo (unos 100 MB, con el porcentaje en pantalla) y queda guardado: después funciona sin conexión.
- A Whisper se le dan los productos de la despensa y las tiendas como pista: acierta mucho más con vuestros nombres. Con una despensa grande, una segunda pasada rápida con los productos que se parecen a lo entendido.
- Intérprete de voz más tolerante: separa productos aunque no se digan comas, entiende tiendas mal oídas («lipercor», «frutiría») y muletillas deformadas («abunta» por «apunta»). Lo escrito no cambia («tomate frito» sigue siendo un producto).

## v42 · 19/11/2026
- Micro: al tocarlo se ensancha de forma fluida hasta ocupar la barra; a la izquierda queda solo un botón para cancelar (sin el «+»). La barra no cambia de tamaño ni de sitio (arreglado un choque de estilos con la burbuja «Te escucho…» que la movía y la hacía saltar).
- Filtros de tienda instantáneos, sin animación de fundido entre casillas.

## v41 · 19/11/2026
- Micrófono más fiable: un solo reconocedor en modo continuo (antes se cortaba tras cada frase y se perdían palabras al rearrancar), sin las repeticiones que mete Safari, y fin automático tras ~2 s de silencio después de hablar o al tocar el micro (esperando las últimas palabras).

## v40 · 19/11/2026
- Barra de abajo única: al tocar «Añadir», la misma pastilla se convierte en el campo de escribir (sin cambiarse por otra barra) y sube pegada al teclado. El micro se queda a la derecha. Dentro del campo, solo una flecha para añadir; se cierra tocando fuera o bajando el teclado.

## v39 · 19/11/2026
- Lista y Despensa van una al lado de la otra, como páginas: al arrastrar se ve llegar la otra pestaña y al soltar se coloca con el muelle (o vuelve). Al tocar las pestañas se desliza igual. Cada una conserva dónde estabas.

## v38 · 19/11/2026
- Sesión al instante: Firebase ya no carga a escondidas la página de inicio de sesión con Google (que no usamos) antes de decir quién eres. Era lo que hacía tardar 40-50 s en «comprobando la sesión».

## v37 · 19/11/2026
- Conexión con Firebase pensada para datos móviles (long polling desde el principio): evita esperas de 30-60 s cuando la conexión en streaming se queda colgada.
- Caché de Firestore de una sola pestaña: no espera a coordinarse con otras pestañas.
- Opciones muestra cuánto tardó el último arranque (Firebase, sesión, datos y servidor).

## v36 · 19/11/2026
- Arranque instantáneo: la app enseña al abrir lo último que mostró (guardado en el iPhone) y lo cambia por los datos al día en cuanto Firebase está listo. Lo que se toque en ese momento se guarda al conectar.
- El programa de Firebase empieza a descargarse a la vez que la app.

## v35 · 19/11/2026
- Si la app no termina de arrancar en 8 s, dice en qué paso se ha quedado y ofrece «Reparar la app» (borra lo guardado en el iPhone y vuelve a cargar; hay que volver a entrar). También en Opciones.

## v34 · 19/11/2026
- Diagnóstico visible: si Firebase no deja leer los datos, si tarda demasiado o si la app falla al pintar, se ve un aviso con el motivo exacto en vez de una pantalla vacía.

## v33 · 19/11/2026
- Actualización segura: al instalar una versión nueva, cada archivo se descarga con su número de versión y se comprueba que todo es de la misma versión. Evita que el iPhone mezcle archivos viejos y nuevos (despensa vacía o iconos raros justo después de publicar).

## v32 · 19/11/2026
- Las hojas ya no oscurecen el fondo (así no queda la franja de la hora clara sobre fondo oscuro); se separan con una sombra suave. Tocar fuera sigue cerrándolas.
- «Repasar la despensa» sin nada que reponer: el botón dice «Cerrar».

## v31 · 19/11/2026
- Créditos en Opciones reducidos a una línea: «Iconos de productos: OpenMoji (CC BY-SA 4.0)».

## v30 · 19/11/2026
- Lista y Despensa: categorías por orden alfabético (Otros al final) y, dentro de cada una, artículos por orden alfabético.

## v29 · 19/11/2026
- Despensa: «+ Añadir» abre el mismo campo de escribir que la lista; se pueden escribir o dictar varios productos y sale la hoja «Esto es lo que he entendido» con categoría y tienda sugeridas. Se guardan solo en la despensa (sin apuntarlos en la lista) y avisa de lo que ya estaba.

## v28 · 19/11/2026
- Las tipografías (Bricolage Grotesque para títulos y Figtree para el texto) van dentro de la app: ya no se descargan de Google Fonts.

## v27 · 19/11/2026
- Avisos sin «Deshacer» centrados y con el mismo margen a los dos lados; todos con la misma altura.

## v26 · 19/11/2026
- Al abrir la app, las casillas salen ya con su recuadro blanco (antes aparecían en gris y con un fundido).
- Tachar en el sitio: la casilla se queda donde está, tachada, con una marca, «Deshacer» dentro y una barrita de tiempo; a los pocos segundos se recoge hacia «Comprado hoy». Sin aviso abajo.

## v25 · 19/11/2026
- Categorías en orden alfabético al añadir o editar (Otros al final).
- Icono de pañal de verdad para los pañales (antes salía un imperdible).
- Arreglado: en la hoja de confirmación, los botones de tienda salían uno debajo de otro a todo lo ancho.

## v24 · 19/11/2026
- El menú ⋮ abre una pantalla completa de Opciones (como los Ajustes del iPhone): Tiendas, Repasar la despensa, Historial, modo Como el iPhone / Claro / Oscuro, cuenta, Compartida con y Cerrar sesión.
- La barra de «Añadir» y el micro flotan, translúcidas, y la lista pasa por debajo hasta el borde.
- Campos de nombre de tipo búsqueda: el iPhone deja de ofrecer «Autorrellenar contacto».
- Navegación entre pantallas siempre en la dirección correcta (entrar por la derecha, volver por la izquierda).

## v23 · 19/11/2026
- Arrastrar a izquierda o derecha: el contenido sigue al dedo y, al soltar, termina de deslizarse a la otra pestaña (o vuelve a su sitio).
- Con el teclado abierto, las hojas (como «Nuevo producto») quedan justo encima del teclado, sin irse hacia arriba ni dejar hueco.
- El iPhone ya no ofrece «Autorrellenar contacto» en los campos de nombre (rótulos «Producto», «Artículo» y «Tienda»).
- Al abrir la app se ve entera desde el primer instante, sin el icono solo arriba.
- Al buscar en la Despensa (o escribir en una hoja), la barra de «Añadir» no sube con el teclado.
- Las primeras casillas de Lista y Despensa quedan a la misma altura.
- El Historial sale de la cabecera y queda solo en el menú ⋮.
- Animación del Historial arreglada: la pantalla entra limpia por la derecha, con sombra, sin mezclarse con la de debajo.

## v22 · 19/11/2026
- Pestañas con icono: la cesta es la Lista y la estantería, la Despensa. La activa se abre y enseña su nombre, y una pastilla lima se desliza de una a otra.
- Deslizar el dedo a la izquierda o a la derecha cambia entre Lista y Despensa.
- Al crear un producto o una tienda, el cursor va directo al nombre.
- Sin zoom al tocar dos veces ni con dos dedos.
- La app ya no se desplaza entera como una página (por ejemplo, al arrastrar una hoja con el teclado abierto); solo se mueven las listas y las hojas.
- Al cambiar entre casillas y lista, los recuadros aparecen al instante.
- Avisos en una pastilla compacta de una línea, con «Deshacer» al lado.
- Animaciones tipo iOS: hojas que suben y bajan con muelle, menú que se despliega desde su botón, Historial que entra y sale por la derecha, cambio de pestaña deslizado, casillas que se recolocan al tachar o añadir, y botones que se hunden al tocarlos.
- Casillas: la tienda va como logo pequeño en la esquina superior derecha, sin texto debajo; la inicial de quien lo apuntó pasa a la izquierda.
- Farmacia con el icono de la cruz.
- Con el campo de escribir abierto, la lista se puede desplazar sin tirones; tocar fuera lo cierra.

## v21 · 19/11/2026
- Historial: botón con papelera para borrar lo seleccionado (artículos o un día entero), con Deshacer.
- Los nombres se guardan sin espacios sobrantes (al principio, al final o dobles), y los que ya estaban guardados así se corrigen solos.

## v20 · 19/11/2026
- Voz más estable: si el iPhone corta por una pausa, sigue escuchando y junta lo dicho; termina tras un silencio largo o al tocar el micro.
- Aviso de cuándo hablar: «Un momento…» mientras se prepara y «Te escucho…» cuando ya oye.
- La línea con cursor se cambia por una burbuja con ondas que muestra lo que vas diciendo.
- Con el micro activo, tocar en cualquier otro sitio cancela la escucha sin apuntar nada.
- Las pestañas «Lista» y «Despensa» pasan a la cabecera, en el sitio del título «Compra» (sin la carpeta de la v19).
- En la Despensa, «+ Añadir» está abajo, en el mismo sitio que en la lista, y crea un producto nuevo.

## v19 · 19/11/2026
- «Lista» y «Despensa» pasan a ser pestañas de archivador bajo la cabecera, en vez de una pantalla aparte.
- La barra de abajo queda con «+ Añadir» y el micro; el + de producto nuevo va junto al buscador de la despensa.

## v18 · 19/11/2026
- Micrófono a la derecha: botón redondo solo con el icono; al tocarlo se ensancha con «Escuchando… toca para parar».

## v17 · 19/11/2026
- Más margen a la izquierda en el campo de escribir.
- Sin botón de micrófono mientras se escribe.

## v16 · 19/11/2026
- Botones de la cabecera: solo iconos, sin fondo.
- Micrófono: ya no se abre el campo de escribir por su cuenta; el aviso dice la causa exacta si falla, para poder arreglarlo.

## v15 · 19/11/2026
- Versión visible también en el menú ⋮, debajo de «Cerrar sesión».
- El campo de escribir tiene una X para cerrarlo, y al cerrarlo ya no aparece la barra de abajo flotando sobre el teclado.

## v14 · 19/11/2026
- La barra de estado del iPhone (hora y batería) también se oscurece al abrir una hoja.

## v13 · 19/11/2026
- Micrófono: ahora se toca para hablar (antes había que mantener pulsado, y el iPhone no lo permitía). Termina solo al callarse o al volver a tocar.
- Sin botón «Dictar»: siempre es el micrófono. Si la voz no va, abre el campo de escribir para usar el micro del teclado.

## v12 · 19/11/2026
- Sin selección de texto ni menú «Copiar / Consultar» al mantener pulsado (solo en los campos de escribir).

## v11 · 19/11/2026
- Iconos de tienda a una tinta, sin recuadro, igual que los logos.

## v10 · 19/11/2026
- Voz más robusta en iOS: una sola frase, sin cortes por el sistema; si no llega nada, pasa a «Dictar» (se puede volver a probar en Preferencias).
- Con el teclado abierto, la app se ajusta a la parte visible.
- Franja superior mínima en la app instalada.
- Sin botón de editar tiendas en la barra de filtros (sigue en el menú ⋮).
- Logos de Mercadona y Lidl sin círculo.

## v9 · 19/11/2026
- La franja superior se oscurece al abrir una hoja.
- El logo ya no salta al arrancar.

## v8 · 19/11/2026
- Versión visible en Preferencias.
- Mismo ancho para todos los iconos y logos de tienda.
- Actualización fiable en el iPhone (sin quedarse con archivos viejos).
- Logos de Mercadona, Hipercor, Lidl y Domi Vélez en una tinta.
- Elegir el icono de cada tienda.
- Cabecera apartada de la difuminación de iOS.

## v1–v2 · 19/11/2026
- Primera versión de la app y conexión con el proyecto Firebase `alfilu-compra`.
