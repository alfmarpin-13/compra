// Datos fijos de la app: categorías, palabras clave, iconos de producto y tiendas iniciales.

export const USERS = ["alfonso", "mariluz"];
// Cómo se llama cada uno en pantalla. Por dentro (cuenta, datos guardados y reglas) sigue siendo «Mariluz»,
// así no hay que tocar Firebase ni los datos: solo cambia lo que se ve (decisión de Alfonso: «Ilu»).
export const MOSTRAR = { Mariluz: "Ilu" };
export const nombre = (n) => MOSTRAR[n] || n;
// Al entrar se puede escribir el nombre que se ve o el de la cuenta.
export const ALIAS_LOGIN = { ilu: "mariluz" };
export const EMAIL_DOMAIN = "compra.app";
export const GENERIC = "Cualquier súper";

// [id, nombre, icono Lucide, color claro, color oscuro]
export const CATS = [
  ["fruta", "Fruta", "apple", "#9A5B3A", "#E8B89E"],
  ["verdura", "Verdura", "carrot", "#4C6E50", "#B7D5AE"],
  ["carne", "Carne", "beef", "#9B4E64", "#E7AFBF"],
  ["pescado", "Pescado y marisco", "fish", "#456F80", "#AFD0DC"],
  ["charcuteria", "Charcutería", "ham", "#8E4B3B", "#E6B3A6"],
  ["quesos", "Quesos", "cheese", "#7A5A1E", "#E5C88D"],
  ["lacteos", "Lácteos y huevos", "milk", "#705274", "#D9B8DD"],
  ["pan", "Pan", "wheat", "#8A6035", "#E1C198"],
  ["bolleria", "Bollería y dulces", "croissant", "#96603F", "#E8C2A4"],
  ["cafe", "Café e infusiones", "coffee", "#6B4A36", "#D6B9A3"],
  ["pasta", "Pasta y arroz", "cooking-pot", "#866344", "#DFC4A4"],
  ["legumbres", "Legumbres", "bean", "#6F6A2E", "#D3CF94"],
  ["conservas", "Conservas y salsas", "can", "#7E5340", "#DDBBA8"],
  ["aceite", "Aceite y especias", "amphora", "#66702F", "#CBD394"],
  ["reposteria", "Repostería", "cake-slice", "#8D5A6B", "#E2B9C6"],
  ["aperitivos", "Aperitivos", "popcorn", "#856A2C", "#E9D199"],
  ["congelados", "Congelados", "snowflake", "#467778", "#A8D7D3"],
  ["bebidas", "Bebidas", "cup-soda", "#8A4D70", "#E3B2D0"],
  ["lucia", "Lucía", "baby", "var(--primary)", "var(--primary)"],
  ["higiene", "Higiene", "bath", "#7B5C80", "#D8BEDC"],
  ["medicamentos", "Medicamentos", "pill", "#8A4B4B", "#E6B0AC"],
  ["parafarmacia", "Parafarmacia", "cross", "#3F7067", "#A9D6CB"],
  ["limpieza", "Limpieza", "spray-can", "#60678A", "#C5CBE4"],
  ["hogar", "Hogar", "house", "#4C5D7A", "#BCCAE6"],
  ["otros", "Otros", "shopping-basket", "#686570", "#C9C0D0"],
].map(([k, l, g, cl, cd]) => ({ k, l, g, cl, cd }));
export const CAT = Object.fromEntries(CATS.map((c) => [c.k, c]));

// Palabras clave (normalizadas, sin tildes) para deducir la categoría de un producto nuevo.
// Gana la coincidencia más larga.
export const KW = {
  fruta: ["fruta", "platano", "banana", "manzana", "pera", "naranja", "mandarina", "limon", "lima", "pomelo", "uva", "melon", "sandia", "pina", "mango", "papaya", "kiwi", "fresa", "freson", "cereza", "melocoton", "nectarina", "albaricoque", "ciruela", "higo", "granada", "arandano", "frambuesa", "mora", "aguacate", "coco", "chirimoya", "caqui", "membrillo"],
  verdura: ["verdura", "lechuga", "tomate", "cebolla", "cebolleta", "patata", "zanahoria", "ajo", "puerro", "pimiento", "pepino", "calabacin", "calabaza", "berenjena", "brocoli", "coliflor", "col", "repollo", "espinaca", "acelga", "judia verde", "alcachofa", "esparrago", "champinon", "seta", "rucula", "canonigo", "apio", "rabano", "remolacha", "maiz", "boniato", "jengibre", "perejil", "cilantro", "albahaca", "hierbabuena", "ensalada", "guisante"],
  carne: ["carne", "pollo", "pechuga", "muslo", "contramuslo", "alita", "ternera", "vacuno", "buey", "cerdo", "lomo", "secreto", "presa", "costilla", "chuleta", "filete", "solomillo", "entrecot", "cordero", "conejo", "pavo entero", "hamburguesa", "salchicha", "albondiga", "picada", "carrillada", "codillo", "panceta"],
  pescado: ["pescado", "marisco", "salmon", "merluza", "bacalao", "atun fresco", "bonito fresco", "dorada", "lubina", "sardina", "boqueron", "rape", "lenguado", "gallo", "emperador", "pez espada", "trucha", "caballa", "gamba", "langostino", "cigala", "mejillon", "almeja", "berberecho", "calamar", "chipiron", "sepia", "pulpo", "navaja", "surimi", "palito de cangrejo"],
  charcuteria: ["jamon", "chorizo", "salchichon", "fuet", "lomo embuchado", "mortadela", "fiambre", "pavo en lonchas", "pechuga de pavo", "fiambre de pavo", "bacon", "beicon", "sobrasada", "morcilla", "cecina", "lacon", "pate", "embutido"],
  quesos: ["queso", "mozzarella", "burrata", "parmesano", "manchego", "brie", "camembert", "roquefort", "requeson", "mascarpone"],
  lacteos: ["leche", "yogur", "yogurt", "kefir", "nata", "mantequilla", "margarina", "huevo", "batido", "natillas", "flan", "cuajada", "bebida de avena", "bebida de soja", "bebida de almendra"],
  pan: ["pan", "barra", "baguette", "chapata", "hogaza", "pan de molde", "pan rallado", "pico", "regana", "colin", "tostada", "biscote", "tortilla de trigo", "pan de pita"],
  bolleria: ["bolleria", "croissant", "cruasan", "magdalena", "donut", "napolitana", "ensaimada", "palmera", "bizcocho", "galleta", "cereal", "muesli", "chocolate", "cacao en polvo", "colacao", "nocilla", "nutella", "crema de cacao", "mermelada", "miel", "turron", "polvoron", "caramelo", "chuche", "gominola", "tarta", "pastel", "churro"],
  cafe: ["cafe", "capsula", "infusion", "te", "manzanilla", "poleo", "tila", "rooibos", "descafeinado"],
  pasta: ["pasta", "macarron", "espagueti", "spaghetti", "tallarin", "fideo", "lasana", "canelon", "ravioli", "tortellini", "gnocchi", "noodle", "arroz", "cuscus", "quinoa", "pure de patata"],
  legumbres: ["legumbre", "lenteja", "garbanzo", "alubia", "judia blanca", "judia pinta", "frijol", "soja", "edamame"],
  conservas: ["conserva", "lata", "atun", "bonito", "sardinilla", "anchoa", "berberecho en lata", "mejillon en escabeche", "tomate frito", "tomate triturado", "tomate natural", "salsa", "ketchup", "mayonesa", "mostaza", "pesto", "aceituna", "pepinillo", "alcaparra", "pimiento del piquillo", "esparrago en lata", "maiz dulce", "caldo", "caldo de pollo", "caldo de verduras", "caldo de pescado", "caldo de carne", "sopa", "gazpacho", "salmorejo", "pisto", "guacamole", "hummus", "humus", "tzatziki"],
  aceite: ["aceite", "vinagre", "sal", "pimienta", "especia", "oregano", "pimenton", "comino", "curry", "canela", "nuez moscada", "laurel", "tomillo", "romero", "azafran", "colorante", "ajo en polvo", "avecrem", "pastilla de caldo"],
  reposteria: ["harina", "azucar", "levadura", "maicena", "edulcorante", "sacarina", "gelatina", "esencia de vainilla", "cobertura", "fideos de colores", "almendra molida", "pan rallado"],
  aperitivos: ["aperitivo", "patatas fritas", "patatilla", "snack", "frutos secos", "almendra", "nuez", "pistacho", "cacahuete", "anacardo", "pipa", "palomita", "nacho", "cortezas", "gusanito", "aceitunas rellenas", "banderilla"],
  congelados: ["congelad", "congelado", "congelada", "congelados", "congeladas", "helado", "pizza", "croqueta", "empanadilla", "varitas", "san jacobo", "nugget", "hielo", "verdura congelada"],
  bebidas: ["agua", "cerveza", "vino", "cava", "champan", "sidra", "refresco", "cola", "coca cola", "fanta", "tonica", "gaseosa", "zumo", "nectar", "bebida isotonica", "aquarius", "ginebra", "ron", "whisky", "vermut", "tinto de verano", "horchata"],
  lucia: ["panal", "toallita", "potito", "biberon", "tetina", "chupete", "bebe", "papilla", "leche de continuacion", "leche de crecimiento", "leche infantil", "crema del culito", "crema de panal", "suero fisiologico"],
  higiene: ["gel", "champu", "acondicionador", "mascarilla", "desodorante", "cepillo de dientes", "pasta de dientes", "dentifrico", "enjuague", "colutorio", "hilo dental", "compresa", "tampon", "protege slip", "salvaslip", "crema", "colonia", "perfume", "maquinilla", "cuchilla", "espuma de afeitar", "jabon de manos", "jabon", "bastoncillo", "algodon", "pasta dental", "protector solar", "crema solar", "panuelo"],
  medicamentos: ["medicamento", "medicina", "pastilla", "comprimido", "ibuprofeno", "paracetamol", "aspirina", "gelocatil", "dalsy", "apiretal", "termalgin", "nolotil", "metamizol", "enantyum", "dexketoprofeno", "omeprazol", "almax", "antiacido", "antibiotico", "amoxicilina", "antihistaminico", "ebastina", "loratadina", "cetirizina", "frenadol", "jarabe", "mucosan", "fluimucil", "bisolvon", "antigripal", "colirio", "gotas para", "spray nasal", "receta", "inhalador", "ventolin", "vacuna", "laxante", "fortasec", "lorazepam", "orfidal", "anticonceptiva", "pildora"],
  parafarmacia: ["parafarmacia", "tirita", "aposito", "gasa", "venda", "esparadrapo", "betadine", "povidona", "clorhexidina", "cristalmina", "agua oxigenada", "alcohol de 96", "alcohol sanitario", "termometro", "test de embarazo", "test de antigenos", "mascarilla quirurgica", "mascarilla ffp2", "pomada", "lagrimas artificiales", "suero oral", "sueroral", "vitamina", "magnesio", "melatonina", "probiotico", "colageno", "preservativo", "lubricante", "crema hidratante facial", "protector labial", "repelente", "pastillas para la garganta", "caramelos para la garganta", "strepsils", "juanolas"],
  limpieza: ["lejia", "multiusos", "oxi", "oxicolor", "oxiblanco", "quitamanchas", "jabon marsella", "jabon de marsella", "lavadora", "detergente", "suavizante", "friegasuelos", "friega", "limpiador", "limpia", "limpiacristales", "quitagrasa", "desengrasante", "lavavajillas", "pastilla lavavajillas", "abrillantador", "fregona", "estropajo", "bayeta", "esponja", "guante", "basura", "bolsa de basura", "amoniaco", "papel higienico", "papel culo", "papel humedo", "servilleta", "papel de cocina", "rollo de cocina", "papel de aluminio", "papel film", "papel de horno", "ambientador", "insecticida", "quitamanchas", "escoba", "recogedor", "cubo"],
  hogar: ["bombilla", "pila", "vela", "enchufe", "alargador", "pegamento", "cinta", "celo", "tupper", "taper", "mechero", "cerilla", "planta", "flor", "maceta", "abono", "tornillo", "cargador", "cable", "sarten", "olla", "vaso", "plato", "cubierto", "toalla", "sabana", "percha"],
};

// Palabra clave → icono de producto (js/productos.js; las claves son códigos de emoji, solo como nombre). Gana la coincidencia más larga, como en las categorías.
export const ICON_KW = {
  platano: "1F34C", banana: "1F34C", manzana: "1F34E", pera: "1F350", naranja: "1F34A", mandarina: "1F34A",
  limon: "1F34B", uva: "1F347", melon: "1F348", sandia: "1F349", pina: "1F34D", mango: "1F96D",
  melocoton: "1F351", nectarina: "1F351", albaricoque: "1F351", cereza: "1F352", fresa: "1F353", freson: "1F353",
  arandano: "1FAD0", kiwi: "1F95D", coco: "1F965", granada: "E0C4", aguacate: "1F951",
  tomate: "1F345", "tomate frito": "1F96B", "tomate triturado": "1F96B", aceituna: "1FAD2",
  berenjena: "1F346", patata: "1F954", "patatas fritas": "1F35F", zanahoria: "1F955", maiz: "1F33D",
  guindilla: "1F336", pimiento: "1FAD1", pepino: "1F952", calabacin: "1F952", lechuga: "1F96C",
  espinaca: "1F96C", acelga: "1F96C", rucula: "1F96C", brocoli: "1F966", coliflor: "1F966", ajo: "1F9C4", cebolla: "1F9C5",
  cebolleta: "1F9C5", puerro: "1F9C5", cacahuete: "1F95C", "frutos secos": "1F95C", judia: "1FAD8", alubia: "1FAD8",
  garbanzo: "1FAD8", lenteja: "1FAD8", legumbre: "1FAD8", castana: "1F330", jengibre: "1FADA",
  guisante: "1FADB", champinon: "E0C9", seta: "1F344", ensalada: "1F957",
  pan: "1F35E", "pan de molde": "1F35E", barra: "1F956", baguette: "1F956", pico: "1F956", chapata: "1F956",
  hogaza: "E0CA", "masa madre": "E0CA", croissant: "1F950", cruasan: "1F950", tortita: "1F95E", gofre: "1F9C7",
  queso: "1F9C0", mozzarella: "1F9C0", jamon: "1F356", chorizo: "1F356", lacon: "1F356",
  pollo: "1F357", alita: "1F357", muslo: "1F357", contramuslo: "1F357", pechuga: "1F414",
  carne: "1F969", ternera: "1F969", filete: "1F969", entrecot: "1F969", solomillo: "1F969", picada: "E2CE",
  cerdo: "1F416", lomo: "1F416", costilla: "1F356", cordero: "1F411", bacon: "1F953", beicon: "1F953",
  panceta: "1F953", pavo: "1F953", "pavo entero": "1F983", hamburguesa: "1F354", pizza: "1F355",
  salchicha: "1F32D", sandwich: "1F96A", huevo: "1F95A", mantequilla: "1F9C8", margarina: "1F9C8", sal: "1F9C2",
  atun: "1F96B", lata: "1F96B", conserva: "1F96B", sardinilla: "1F96B", anchoa: "1F96B",
  arroz: "1F35A", pasta: "1F35D", espagueti: "1F35D", spaghetti: "1F35D", macarron: "MACARRON", penne: "MACARRON", plumas: "MACARRON", fusilli: "MACARRON", helices: "MACARRON", tallarin: "1F35D",
  fideo: "1F35C", sopa: "1F35C", caldo: "1F35C", "caldo de pollo": "1F35C", "caldo de verduras": "1F35C", "caldo de pescado": "1F35C", "caldo de carne": "1F35C", guacamole: "1F951", hummus: "1FAD8", humus: "1FAD8", multiusos: "E0B1", oxi: "1FAA3", oxicolor: "1FAA3", oxiblanco: "1FAA3", quitamanchas: "1FAA3", "jabon marsella": "1FAA3", "jabon de marsella": "1FAA3", gamba: "1F990", langostino: "1F990", cigala: "1F990",
  cangrejo: "1F980", bogavante: "1F99E", pulpo: "1F419", calamar: "1F991", chipiron: "1F991", sepia: "1F991",
  mejillon: "1F9AA", almeja: "1F9AA", berberecho: "1F9AA", ostra: "1F9AA",
  pescado: "1F41F", salmon: "1F41F", bacalao: "1F41F", sardina: "1F41F", boqueron: "1F41F", trucha: "1F41F",
  merluza: "1F420", dorada: "1F420", lubina: "1F420", lenguado: "1F420",
  helado: "1F368", donut: "1F369", galleta: "1F36A", tarta: "1F370", pastel: "1F370", bizcocho: "E0C7",
  magdalena: "1F9C1", chocolate: "1F36B", "crema de cacao": "1F36B", caramelo: "1F36C", chuche: "1F36C",
  gominola: "1F36C", piruleta: "1F36D", natilla: "1F36E", flan: "1F36E", miel: "1F36F",
  mermelada: "1FAD9", tarro: "1FAD9", potito: "1FAD9", palomita: "1F37F", cereal: "1F963", muesli: "1F963",
  biberon: "1F37C", "leche de continuacion": "1F37C", "leche infantil": "1F37C", "leche de crecimiento": "1F37C",
  leche: "E153", nata: "E153", batido: "E153", kefir: "1F95B", yogur: "1F95B", yogurt: "1F95B",
  cafe: "2615", "cafe en grano": "CAFEGRANO", "cafe grano": "CAFEGRANO", capsula: "2615", descafeinado: "2615", te: "1FAD6", infusion: "1F375", manzanilla: "1F375", poleo: "1F375",
  vino: "1F377", cava: "1F37E", champan: "1F37E", sidra: "1F37E", cerveza: "1F37A", refresco: "1F964",
  cola: "1F964", tonica: "1F964", gaseosa: "1F964", zumo: "1F9C3", nectar: "1F9C3", horchata: "1F964",
  agua: "E0CC", hielo: "1F9CA", aceite: "E0CB", vinagre: "E0CB", salsa: "E0CB", ketchup: "E0CB", mayonesa: "E0CB",
  harina: "1F33E", azucar: "1F36C", levadura: "1F33E",
  panal: "PANAL", toallita: "1FAE7", chupete: "1F37C",
  gel: "1F6BF", champu: "1F9FC", acondicionador: "1F9F4", jabon: "1F9FC", "pasta de dientes": "1F9B7",
  dentifrico: "1F9B7", "pasta dental": "1F9B7", "cepillo de dientes": "1FAA5", maquinilla: "1FA92", cuchilla: "1FA92",
  crema: "1F9F4", desodorante: "1F9F4", colonia: "1F9F4", protector: "1F9F4",
  "papel higienico": "1F9FB", "papel culo": "PAPELHUM", "papel humedo": "PAPELHUM", "papel higienico humedo": "PAPELHUM", "papel de cocina": "1F9FB", "rollo de cocina": "1F9FB", servilleta: "1F9FB",
  cubo: "1FAA3", detergente: "1FAA3", suavizante: "1FAA3", friegasuelos: "E0B1", lejia: "E0B1", limpia: "E0B1",
  limpiador: "E0B1", amoniaco: "E0B1", lavavajillas: "E0CB", estropajo: "1F9FD", esponja: "1F9FD", bayeta: "1F9FD",
  escoba: "1F9F9", fregona: "1F9F9", basura: "1F5D1", "bolsa de basura": "1F5D1", bombilla: "1F4A1", pila: "1F50B",
  medicina: "1F48A", pastilla: "1F48A", ibuprofeno: "1F48A", paracetamol: "1F48A", tirita: "1FA79", medicamento: "1F48A", comprimido: "1F48A", aspirina: "1F48A", gelocatil: "1F48A", dalsy: "1F48A", apiretal: "1F48A", nolotil: "1F48A", omeprazol: "1F48A", antibiotico: "1F48A", vitamina: "1F48A", magnesio: "1F48A", melatonina: "1F48A", aposito: "1FA79",
  suero: "E307", termometro: "E324", flor: "1F337", planta: "1FAB4", cesta: "1F9FA",
};

// Tiendas iniciales (sección 6).
export const STORES_SEED = [
  { id: "mercadona", name: "Mercadona", kind: "generic", order: 0, aliases: ["mercadona", "merca"] },
  { id: "hipercor", name: "Hipercor", kind: "generic", order: 1, aliases: ["hipercor", "corte ingles", "el corte ingles"] },
  { id: "lidl", name: "Lidl", kind: "generic", order: 2, aliases: ["lidl", "lidel"] },
  { id: "fruteria", name: "Frutería", kind: "unique", order: 3, aliases: ["fruteria", "frutero"] },
  { id: "carniceria", name: "Carnicería", kind: "unique", order: 4, aliases: ["carniceria", "carnicero"] },
  { id: "panaderia", name: "Panadería", kind: "unique", order: 5, aliases: ["panaderia", "panadero", "horno"] },
  { id: "farmacia", name: "Farmacia", kind: "unique", order: 6, aliases: ["farmacia"] },
];

// Icono para las tiendas únicas, deducido del nombre.
export const STORE_ICON_KW = {
  fruter: "apple", verdul: "carrot", carnic: "beef", polleri: "drumstick", pescader: "fish", panader: "croissant",
  horno: "croissant", pasteler: "cake-slice", farmac: "cross", drogue: "spray-can", charcut: "ham", queser: "cheese",
  bodega: "wine", vino: "wine", cafe: "coffee", ferreter: "house", herbolar: "leaf", mercado: "store",
};
