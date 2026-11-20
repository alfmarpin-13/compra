// Iconos de productos: dibujos propios de Compra (cuadrícula 48, trazo 2,2 redondeado, color currentColor).
// Las claves son códigos de emoji, solo como nombre interno (las usan ICON_KW y el campo icon guardado).
export const PRODUCTOS = {
  // cafe, capsula, descafeinado
  "2615": "<path d=\"M11 20h23v9a10 10 0 0 1-10 10h-3a10 10 0 0 1-10-10z\"/><path d=\"M34 23h3a4 4 0 0 1 0 8h-3.5\"/><path d=\"M7 43h32\"/><path d=\"M18 7c-2 2 2 4 0 7M24 7c-2 2 2 4 0 7M30 7c-2 2 2 4 0 7\" opacity=\".55\"/>",
  // salchicha
  "1F32D": "<path d=\"M7.3 26.9A26 26 0 0 0 40.7 26.9 5 5 0 0 0 35.6 19 16 16 0 0 1 12.4 19 5 5 0 0 0 7.3 26.9z\"/><path d=\"M41.6 19.8 43.5 16.5M6.4 19.8 4.5 16.5\"/><path d=\"M14.7 28.6A21 21 0 0 0 33.3 28.6\" opacity=\".55\"/>",
  // castana
  "1F330": "<path d=\"M24 9c-4 4-16 9-16 21 0 7 6 12 16 12s16-5 16-12C40 18 28 13 24 9z\"/><path d=\"M24 9l.5-3.5\"/><path d=\"M9.5 32c4 2.5 9 3.5 14.5 3.5s10.5-1 14.5-3.5\" opacity=\".55\"/>",
  // guindilla
  "1F336": "<path d=\"M25 14c-3 1-4 4-5 8-1.5 6-5 12-13 19 10 0 19-6 22-13 2-5 3-9 2-12-1-2-4-3-6-2z\"/><path d=\"M24 15c2-2.5 6-3 8-.5\"/><path d=\"M28 13c1-4 4-6 8-7\"/>",
  // flor
  "1F337": "<path d=\"M15 9l5 5 4-7 4 7 5-5v11a9 9 0 0 1-18 0z\"/><path d=\"M24 29v15\"/><path d=\"M24 41c-2-5-7-8-12-8 1 5 6 8 12 8zM24 38c2-4 6-6 10-6-1 4-5 6-10 6z\"/>",
  // maiz
  "1F33D": "<path d=\"M24 5c5 0 8 6 8 15s-3 15-8 15-8-6-8-15 3-15 8-15z\"/><path d=\"M17.5 14h13M16.5 21h15M17.5 28h13M24 6v28\" opacity=\".45\"/><path d=\"M17 23c-5 5-6 13-1 20 5 0 8-4 8-9M31 23c5 5 6 13 1 20-5 0-8-4-8-9\"/>",
  // harina, levadura
  "1F33E": "<path d=\"M15 15c-2.5 7-5 15-5 21a6 6 0 0 0 6 6h16a6 6 0 0 0 6-6c0-6-2.5-14-5-21\"/><path d=\"M15 15h18\"/><path d=\"M16 15c-2-3-2-6 0-9 3 1 5 1 8 0 3 1 5 1 8 0 2 3 2 6 0 9\" opacity=\".55\"/><path d=\"M24 38V22\"/><path d=\"M24 28c-3 0-5-2-5-5 3 0 5 2 5 5zM24 28c3 0 5-2 5-5-3 0-5 2-5 5zM24 34c-3 0-5-2-5-5 3 0 5 2 5 5zM24 34c3 0 5-2 5-5-3 0-5 2-5 5z\"/>",
  // seta
  "1F344": "<path d=\"M6 25c0-9 8-17 18-17s18 8 18 17c0 2-1 3-3 3H9c-2 0-3-1-3-3z\"/><path d=\"M18 28c-1 5-2 9-1 13 1 2 3 3 7 3s6-1 7-3c1-4 0-8-1-13\"/><circle cx=\"16\" cy=\"18\" r=\"2.2\" opacity=\".55\"/><circle cx=\"29\" cy=\"15\" r=\"2.6\" opacity=\".55\"/><circle cx=\"33\" cy=\"22.5\" r=\"1.6\" opacity=\".55\"/>",
  // tomate
  "1F345": "<path d=\"M24 14c-10 0-17 6-17 14.5S14 43 24 43s17-6 17-14.5S34 14 24 14z\"/><path d=\"M24 16c-2-2-5-3-8-2 2 2 4 3 6 3-2 1-3 3-3 5 2 0 4-2 5-4 1 2 3 4 5 4 0-2-1-4-3-5 2 0 4-1 6-3-3-1-6 0-8 2z\"/><path d=\"M24 15V9c0-1 1-2 2-2\"/><path d=\"M12 27a11 11 0 0 1 4-6\" opacity=\".55\"/>",
  // berenjena
  "1F346": "<path d=\"M30 13c-5 1-7 6-10 10-3 4-10 6-11 13-.5 5 4 8 9 7 9-2 15-9 18-15 2-5 2-10-1-13-1.5-1.5-3-2-5-2z\"/><path d=\"M28 13.5c0 4 2.5 6.5 7 6.5M30 13c3-1.5 6.5-.5 8 2\"/><path d=\"M33 12l4-5\"/><path d=\"M14 36c3-1 6-3 8-6\" opacity=\".55\"/>",
  // uva
  "1F347": "<circle cx=\"19\" cy=\"19\" r=\"5\"/><circle cx=\"29\" cy=\"19\" r=\"5\"/><circle cx=\"24\" cy=\"27\" r=\"5\"/><circle cx=\"14\" cy=\"27\" r=\"5\"/><circle cx=\"34\" cy=\"27\" r=\"5\"/><circle cx=\"19\" cy=\"35\" r=\"5\"/><circle cx=\"29\" cy=\"35\" r=\"5\"/><circle cx=\"24\" cy=\"42\" r=\"3.6\" opacity=\"0\"/><path d=\"M24 14V8M24 10c3-3 7-3 10-1\"/>",
  // melon
  "1F348": "<ellipse cx=\"23.5\" cy=\"25\" rx=\"18\" ry=\"12.5\"/><path d=\"M8 20c10-3.5 21-3.5 31 0M8 30c10 3.5 21 3.5 31 0M6.5 25h34\" opacity=\".5\"/><path d=\"M41.5 25h2.5\"/>",
  // sandia
  "1F349": "<path d=\"M5 14h38a19 19 0 0 1-38 0z\"/><path d=\"M9.5 18a15 15 0 0 0 29 0\" opacity=\".55\"/><circle cx=\"17\" cy=\"19\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24\" cy=\"23\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"31\" cy=\"19\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24\" cy=\"17\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/>",
  // naranja, mandarina
  "1F34A": "<ellipse cx=\"24\" cy=\"28\" rx=\"16\" ry=\"14.5\"/><path d=\"M24 13.5c1-4.5 4.5-7 10-7-1 4.5-4.5 7-10 7z\"/><path d=\"M24 13.5 22 9\"/><circle cx=\"17\" cy=\"25\" r=\"1\" fill=\"currentColor\" stroke=\"none\" opacity=\".55\"/><circle cx=\"20\" cy=\"33\" r=\"1\" fill=\"currentColor\" stroke=\"none\" opacity=\".55\"/><circle cx=\"29\" cy=\"30\" r=\"1\" fill=\"currentColor\" stroke=\"none\" opacity=\".55\"/><circle cx=\"31\" cy=\"22\" r=\"1\" fill=\"currentColor\" stroke=\"none\" opacity=\".55\"/>",
  // limon
  "1F34B": "<path d=\"M10 37c-2-2-2-4 0-6 0-10 9-20 21-21 2-2 4-2 6 0s2 4 0 6c-1 12-11 21-21 21-2 2-4 2-6 0z\"/><path d=\"M15 30c1-6 5-11 11-13\" opacity=\".55\"/>",
  // platano, banana
  "1F34C": "<path d=\"M36 8c4 10 2 22-7 29-6 4.5-14 5.5-20 2.5 7-1 13-4 17-9 5-6 7-14 6-21z\"/><path d=\"M36 8l2-3\"/><path d=\"M32 13c1 8-2 16-8 21\" opacity=\".55\"/>",
  // pina
  "1F34D": "<ellipse cx=\"24\" cy=\"31\" rx=\"10.5\" ry=\"12.5\"/><path d=\"M18 20 13 9l7 5 4-10 4 10 7-5-5 11\"/><path d=\"M17 24l14 14M15 32l8 8M23 20l10 10M31 24 17 38M33 32l-8 8M25 20 15 30\" opacity=\".45\"/>",
  // manzana
  "1F34E": "<path d=\"M24 15c-3-3-12-3.5-14 4.5-2.3 9 3.5 21 9 21.5 2 .2 3.5-1 5-1s3 1.2 5 1c5.5-.5 11.3-12.5 9-21.5-2-8-11-7.5-14-4.5z\"/><path d=\"M24 15c0-4 1-7 3.5-9\"/><path d=\"M27 11c3-3.5 7-3.5 8-3-1 3.5-4 5.5-8 3z\"/>",
  // pera
  "1F350": "<path d=\"M24 10c-3 0-4 3-4 7 0 4-9 8-9 16 0 7 6 11 13 11s13-4 13-11c0-8-9-12-9-16 0-4-1-7-4-7z\"/><path d=\"M24 10c0-2 .5-4 2-6\"/><path d=\"M26 8c2-3 6-4 9-3-1 3-5 4-9 3z\"/><path d=\"M16 34c0 3 2 5 5 6\" opacity=\".55\"/>",
  // melocoton, nectarina, albaricoque
  "1F351": "<path d=\"M24 15c-5-3-16-3-16 12 0 9 7 16 16 16s16-7 16-16c0-15-11-15-16-12z\"/><path d=\"M24 15c4 6 3 15-2 22\" opacity=\".55\"/><path d=\"M24 15c1-5 5-8 11-8-1 5-5 8-11 8z\"/><path d=\"M24 15l-2-5\"/>",
  // cereza
  "1F352": "<circle cx=\"15\" cy=\"35\" r=\"7\"/><circle cx=\"33\" cy=\"33\" r=\"7\"/><path d=\"M15 28c1-8 5-15 11-20M33 26c-1-7-3-13-7-18\"/><path d=\"M26 8c4-3 9-3 12 0-3 3-8 3-12 0z\"/><path d=\"M11 33a4 4 0 0 1 2.5-3M29 31a4 4 0 0 1 2.5-3\" opacity=\".55\"/>",
  // fresa, freson
  "1F353": "<path d=\"M24 43c-8-4-15-13-15-22 0-4 3-7 7-7 3 0 5 1 8 1s5-1 8-1c4 0 7 3 7 7 0 9-7 18-15 22z\"/><path d=\"M14 14l5 1 2-4 3 3 3-3 2 4 5-1\"/><path d=\"M24 14V7\"/><circle cx=\"18\" cy=\"22\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24\" cy=\"25\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"30\" cy=\"22\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"20\" cy=\"31\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"28\" cy=\"31\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24\" cy=\"37\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/>",
  // hamburguesa
  "1F354": "<path d=\"M8 21c0-8 7-13 16-13s16 5 16 13z\"/><path d=\"M7 25.5c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0 4-2 6 0 4 2 6 0\" opacity=\".55\"/><rect x=\"8\" y=\"28.5\" width=\"32\" height=\"5\" rx=\"2.5\"/><path d=\"M8 36.5h32v1.5a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z\"/><path d=\"M18 14l2-1M26 12.5l2 1M31 16.5l2-1\" opacity=\".55\"/>",
  // pizza
  "1F355": "<path d=\"M6 11c5-3 11-5 18-5s13 2 18 5l-3 5c-4-2-9-3.5-15-3.5S13 14 9 16z\"/><path d=\"M9 16 24 43 39 16\"/><circle cx=\"19\" cy=\"22\" r=\"2.5\"/><circle cx=\"29\" cy=\"24\" r=\"2.5\"/><circle cx=\"24\" cy=\"33\" r=\"2\"/>",
  // jamon, chorizo, lacon
  "1F356": "<ellipse cx=\"13\" cy=\"33\" rx=\"8\" ry=\"4\" transform=\"rotate(45 13 33)\"/><circle cx=\"13\" cy=\"33\" r=\"1.4\" fill=\"currentColor\" stroke=\"none\" opacity=\".55\"/><path d=\"M7.3 27.3C9 18 22 13 33 7M18.7 38.7C28 37 33 24 38 12\"/><path d=\"M33 7l3-3c2 0 5 3 5 5l-3 3\"/><path d=\"M30.5 11.5l4 4\" opacity=\".55\"/>",
  // pollo, alita, muslo
  "1F357": "<path d=\"M23 31C14 33 7 27 7 19S13 6 21 6s14 7 13 15c0 3-1 6-3 8z\"/><path d=\"M25 30.5l7 7M31.5 28l7 7\"/><path d=\"M32 37.5a3 3 0 1 0 2.5 4.5 3 3 0 1 0 4.5-2.5 3 3 0 1 0-.5-5\" /><path d=\"M14 18c1-4 4-7 8-7\" opacity=\".55\"/>",
  // arroz
  "1F35A": "<path d=\"M7 25h34c0 9.5-7.6 16-17 16S7 34.5 7 25z\"/><path d=\"M11 25c0-6.5 6-11 13-11s13 4.5 13 11\"/><path d=\"M19 41l-1 3h12l-1-3\"/><path d=\"M18 20l1.5 1M26 18.5l1.5-.5M29 22l1 1.2M22 22.5l1.2-.8\" opacity=\".55\"/>",
  // fideo, sopa, caldo
  "1F35C": "<path d=\"M6 25h36c0 9.5-8 16-18 16S6 34.5 6 25z\"/><path d=\"M19 41l-1 3h12l-1-3\"/><path d=\"M17 19c-2-2 2-4 0-6.5s2-4 0-6.5M24 19c-2-2 2-4 0-6.5s2-4 0-6.5M31 19c-2-2 2-4 0-6.5s2-4 0-6.5\" opacity=\".55\"/>",
  // pasta, espagueti, spaghetti
  "1F35D": "<path d=\"M6 27h36c0 9-8 15-18 15S6 36 6 27z\"/><path d=\"M11 27c1-5 6-8 13-8s12 3 13 8\"/><path d=\"M15 27c1-3 4-5 9-5s8 2 9 5M19 27c1-1.5 3-2.5 5-2.5s4 1 5 2.5\" opacity=\".55\"/><path d=\"M33 22 39 6M36.5 6.8l-2 5.4M40 8.2l-2 5.4\" />",
  // pan, pan de molde
  "1F35E": "<path d=\"M14 42V22c-4-1-6-4-6-7 0-5 7-8 16-8s16 3 16 8c0 3-2 6-6 7v20a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z\"/><path d=\"M19 22v16M24 22v16M29 22v16\" opacity=\".35\"/>",
  // patatas fritas
  "1F35F": "<path d=\"M11 20c5 4 21 4 26 0l-3 22a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z\"/><path d=\"M15 21.5 13 9l4-.8 1.4 14.2M21 23V6h4v17M30 22.5 31 9l4 .5-1.5 12.5\"/>",
  // helado
  "1F368": "<path d=\"M15 25l9 19 9-19\"/><path d=\"M13 25c-2-1-3-3.5-3-6.5 0-7 6-12.5 14-12.5s14 5.5 14 12.5c0 3-1 5.5-3 6.5-2 1-3.5-1-5.5 0s-3 2-5.5 2-3.5-1-5.5-2-3.5 1-5.5 0z\"/><path d=\"M20 27.5l7 9M28 27.5l-7 9\" opacity=\".55\"/>",
  // donut
  "1F369": "<circle cx=\"24\" cy=\"24\" r=\"17\"/><circle cx=\"24\" cy=\"24\" r=\"5\"/><path d=\"M24 11c3 0 4 2 6.5 1.5S35 14 36 17s-.5 4.5.5 7-.5 5-2 7-2 3.5-5 4.5-4-.5-5.5.5-4 1-6 0-3.5-2.5-5.5-4-1.5-4-2.5-6.5S11 16 13 14.5s3-1.5 5.5-2.5S21 11 24 11z\" opacity=\".55\"/><path d=\"M19.5 15.5l2.5-1M30.5 18.5l1 2.5M31 30l-2.5 1M16.5 28l-.8-2.5\"/>",
  // galleta
  "1F36A": "<path d=\"M32 11.1A16 16 0 1 0 39.5 20.9a4.5 4.5 0 0 1-4.3-5.2 4.5 4.5 0 0 1-3.2-4.6z\"/><circle cx=\"17\" cy=\"20\" r=\"1.8\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"25\" cy=\"17\" r=\"1.8\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"31\" cy=\"27\" r=\"1.8\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"20\" cy=\"31\" r=\"1.8\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"27\" cy=\"35\" r=\"1.8\" fill=\"currentColor\" stroke=\"none\"/>",
  // chocolate, crema de cacao
  "1F36B": "<path d=\"M13 28V8a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v20\"/><path d=\"M13 15h22M13 22h22M24 6v22\" opacity=\".55\"/><path d=\"M10 29l3.5 2 3.5-2 3.5 2 3.5-2 3.5 2 3.5-2 3.5 2 3.5-2V42a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z\"/>",
  // caramelo, chuche, gominola
  "1F36C": "<g transform=\"rotate(-25 24 24)\"><ellipse cx=\"24\" cy=\"24\" rx=\"9\" ry=\"7\"/><path d=\"M15 24 6 17v14zM33 24l9-7v14z\"/><path d=\"M21 17.5c-2 4-2 9 0 13M27 17.5c2 4 2 9 0 13\" opacity=\".55\"/></g>",
  // piruleta
  "1F36D": "<circle cx=\"24\" cy=\"17\" r=\"12\"/><path d=\"M24 29v15\"/><path d=\"M24 17a2 2 0 0 1 4 0 4 4 0 0 1-8 0 6 6 0 0 1 12 0 8 8 0 0 1-16 0\" opacity=\".55\"/>",
  // natilla, flan
  "1F36E": "<path d=\"M17 13h14a2 2 0 0 1 2 1.7L36 37H12l3-22.3A2 2 0 0 1 17 13z\"/><path d=\"M14.4 18.5c1.5 0 2 3 3.5 3s1.5-2.5 3-2.5 2 4 3.5 4 1.8-3 3.3-3 2 2.5 3.5 2.5 1.6-2 3.4-3.8\"/><path d=\"M7 37h34M10 37c1.5 3 6.5 5 14 5s12.5-2 14-5\" opacity=\".55\"/>",
  // miel
  "1F36F": "<path d=\"M14 7h20v6H14z\"/><path d=\"M16 13c-5 3-7 8-7 14v12a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4V27c0-6-2-11-7-14\"/><path d=\"M19 13v5a2 2 0 0 0 4 0v-2\"/><path d=\"M24 25l5 3v6l-5 3-5-3v-6z\" opacity=\".55\"/>",
  // tarta, pastel
  "1F370": "<path d=\"M6 28 36 15l6 4v19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z\"/><path d=\"M6 28h36\"/><path d=\"M6 34h36\" opacity=\".55\"/><circle cx=\"35\" cy=\"10\" r=\"3\"/><path d=\"M37 8c1-2 2.5-3 4-3.5\" opacity=\".55\"/>",
  // infusion, manzanilla, poleo
  "1F375": "<path d=\"M8 16h28v12a12 12 0 0 1-12 12h-4A12 12 0 0 1 8 28z\"/><path d=\"M36 19h2a5.5 5.5 0 0 1 0 11h-3\"/><path d=\"M6 44h32\"/><path d=\"M19 16c0-4.5 6-4.5 6 0v7\"/><path d=\"M22 23h6v8h-6z\"/><path d=\"M16 10c-1.5-2 1.5-3 0-5.5M29 10c-1.5-2 1.5-3 0-5.5\" opacity=\".55\"/>",
  // vino
  "1F377": "<path d=\"M14 5h20c1 3 1.5 6 1.5 9a11.5 11.5 0 0 1-23 0c0-3 .5-6 1.5-9z\"/><path d=\"M24 25.5V42M16 43h16\"/><path d=\"M12.8 15h22.4\" opacity=\".55\"/>",
  // cerveza
  "1F37A": "<path d=\"M10 17v23a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V17\"/><path d=\"M32 21h3a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-3\"/><path d=\"M8 17c-1.5-4.5 2-8 6-7 1-3.5 5-4.5 8-2.5 2.5-2.5 7-2 8 1.5 4-.5 6 3 4 8z\"/><path d=\"M17 23v14M25 23v14\" opacity=\".55\"/>",
  // biberon, leche de continuacion, leche infantil
  "1F37C": "<path d=\"M21 11c0-3.5 1.5-6 3-6s3 2.5 3 6\"/><path d=\"M17 11h14v5H17z\"/><path d=\"M17 16h14l1 4v20a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V20z\"/><path d=\"M16 25h6M16 31h6M16 37h6\" opacity=\".55\"/>",
  // cava, champan, sidra
  "1F37E": "<path d=\"M20.5 14h7v4c0 2 5.5 3.5 5.5 9v14a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V27c0-5.5 5.5-7 5.5-9z\"/><path d=\"M15 31h18\" opacity=\".55\"/><path d=\"M28 4.5l5 2.2-1.8 4-5-2.2z\"/><path d=\"M16 9l-3-3M24 9V5M36 13l3-1M38 18l3 1\" opacity=\".55\"/>",
  // palomita
  "1F37F": "<path d=\"M12 21h24l-3 21a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2z\"/><path d=\"M20 21l1 23M28 21l-1 23\" opacity=\".55\"/><path d=\"M11 21c-2.5-4 0-8.5 4.5-7.5.5-4.5 6-6.5 9-3 2.5-3.5 8.5-2.5 9 2 4.5-.5 6.5 4.5 3.5 8.5\"/>",
  // cordero
  "1F411": "<path d=\"M16 20c0-4 4-6 7-4 1.5-3 6.5-3 8 0 2.5-2 7-1 7.5 2.5 3.5 1 4 6 1.5 8 1.5 3-1 6.5-4.5 6-1.5 2.5-6 2.5-7.5.5-2 2-6 1.5-7.5-1.5-3.5 0-5.5-4-3.5-7-2-1.5-2-4 .5-5z\"/><ellipse cx=\"10.5\" cy=\"21.5\" rx=\"5\" ry=\"6.5\"/><path d=\"M6 17l-3-1.5M15 17l2.5-2\" /><circle cx=\"9\" cy=\"21\" r=\"1.4\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M20 34v8M26 35v7M32 35v7M37 33v9\"/>",
  // pechuga
  "1F414": "<path d=\"M14 12a5.5 5.5 0 0 1 10.5-1c.5 3 0 6-1 9 3 1 6 0 9-3l2-8 2.5 5 2.5-3 1 8c2 10-4 21-15 21-8 0-13-5-13-11 0-6 3-9 1.5-12z\"/><path d=\"M15.5 8c0-2 2-3 3.5-1.5.5-2 3-2 3.5 0 1.5-.5 2.5 1 2 2.5\"/><path d=\"M14 13l-4.5 2 4.5 1.5\"/><path d=\"M13.5 17.5c-1.8 1-1.8 4 0 4.5\" opacity=\".55\"/><circle cx=\"18.5\" cy=\"13\" r=\"1.4\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M19 28c3 4.5 9.5 5.5 14 1\" opacity=\".55\"/><path d=\"M21 40v4M28 39.5v4.5\"/>",
  // cerdo, lomo
  "1F416": "<circle cx=\"24\" cy=\"26\" r=\"15\"/><path d=\"M12.5 16.5 10 6l9.5 5M35.5 16.5 38 6l-9.5 5\"/><ellipse cx=\"24\" cy=\"31\" rx=\"6.5\" ry=\"4.5\"/><circle cx=\"21.5\" cy=\"31\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"26.5\" cy=\"31\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"18\" cy=\"23\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"30\" cy=\"23\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/>",
  // pulpo
  "1F419": "<path d=\"M13 27c-1.5-12 4-20 11-20s12.5 8 11 20\"/><path d=\"M13 27c-1 6-4 9-7 9.5M19 28c0 7-2 11-5 12.5a2 2 0 0 1-1-3.5M29 28c0 7 2 11 5 12.5a2 2 0 0 0 1-3.5M35 27c1 6 4 9 7 9.5M24 28.5v12a2 2 0 0 0 3 1\"/><path d=\"M13 27c3.5 1.5 18.5 1.5 22 0\" opacity=\".55\"/><circle cx=\"20\" cy=\"19\" r=\"1.6\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"28\" cy=\"19\" r=\"1.6\" fill=\"currentColor\" stroke=\"none\"/>",
  // pescado, salmon, bacalao
  "1F41F": "<path d=\"M6 24c5-8 13-12 20-12 7.5 0 12 5 14 12-2 7-6.5 12-14 12-7 0-15-4-20-12z\"/><path d=\"M40 24l4-7v14z\" transform=\"translate(-1 0)\"/><circle cx=\"15.5\" cy=\"22\" r=\"1.6\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M22 19c2 3 2 7 0 10\" opacity=\".55\"/>",
  // merluza, dorada, lubina
  "1F420": "<path d=\"M5 26c6-6 13-9 21-9 6 0 10 3 13 6l5-5v15l-5-5c-3 3-7 6-13 6-8 0-15-3-21-8z\"/><path d=\"M17 18l3-6h8l4 6\"/><circle cx=\"12\" cy=\"24.5\" r=\"1.6\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M18 21c1.5 2.5 1.5 5.5 0 8\" opacity=\".55\"/><path d=\"M23 27c2 2.5 5 3.5 8 2.5\" opacity=\".55\"/>",
  // medicina, pastilla, ibuprofeno
  "1F48A": "<rect x=\"5\" y=\"16\" width=\"30\" height=\"13\" rx=\"6.5\" transform=\"rotate(-40 20 22.5)\"/><path d=\"M15.5 17.5l9 10\" opacity=\".55\"/><circle cx=\"34\" cy=\"34\" r=\"8\"/><path d=\"M28.5 39.5l11-11\" opacity=\".55\"/>",
  // bombilla
  "1F4A1": "<path d=\"M18 33c0-4.5-7-7.5-7-16a13 13 0 0 1 26 0c0 8.5-7 11.5-7 16z\"/><path d=\"M18 37.5h12M20 42h8\"/><path d=\"M21 33v-8l3 2 3-2v8\" opacity=\".55\"/>",
  // pila
  "1F50B": "<rect x=\"5\" y=\"14\" width=\"33\" height=\"20\" rx=\"3\"/><path d=\"M38 19.5h3a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-3\"/><path d=\"M23 17.5l-6 7.5h6l-2 6 7-8h-6z\"/>",
  // basura, bolsa de basura
  "1F5D1": "<path d=\"M18 17c-6 5-11 12-11 19 0 5 6 8 17 8s17-3 17-8c0-7-5-14-11-19z\"/><path d=\"M18 17h12\"/><path d=\"M21 17c-3-3-6-6-6-10 4 0 7 3 9 7 2-4 5-7 9-7 0 4-3 7-6 10\"/><path d=\"M15 30c-1 3-1 6 0 8M24 27v12\" opacity=\".5\"/>",
  // gel
  "1F6BF": "<path d=\"M19 5h10a2 2 0 0 1 2 2v5H17V7a2 2 0 0 1 2-2z\"/><path d=\"M17 12h14l3 6v22a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V18z\"/><path d=\"M17 8.5h14\" opacity=\".55\"/><path d=\"M24 23c-3 4-4.5 6.5-4.5 8.5a4.5 4.5 0 0 0 9 0c0-2-1.5-4.5-4.5-8.5z\"/>",
  // croissant, cruasan
  "1F950": "<path transform=\"translate(0 3)\" d=\"M5 35A7 7 0 0 1 11 24 7.5 7.5 0 0 1 18 14 7 7 0 0 1 30 14 7.5 7.5 0 0 1 37 24 7 7 0 0 1 43 35C37 30 31 28 24 28S11 30 5 35z\"/><path transform=\"translate(0 3)\" d=\"M11 24c1 2 2 5 2 7.5M18 14c-.5 4 0 9 1 14M30 14c.5 4 0 9-1 14M37 24c-1 2-2 5-2 7.5\" opacity=\".6\"/>",
  // aguacate
  "1F951": "<path d=\"M24 5c-6 0-8 6-9 12-.5 3-6 7-6 14 0 7 7 13 15 13s15-6 15-13c0-7-5.5-11-6-14-1-6-3-12-9-12z\"/><path d=\"M24 9.5c-3.5 0-5 4-6 9-.5 3-5 6.5-5 12.5 0 5 5 9 11 9s11-4 11-9c0-6-4.5-9.5-5-12.5-1-5-2.5-9-6-9z\" opacity=\".5\"/><circle cx=\"24\" cy=\"30\" r=\"6\"/>",
  // pepino, calabacin
  "1F952": "<path d=\"M8 39c-3-3 0-9 6-15S29 10 34 9c3.5-.7 5.5 1.5 5 5-.7 5-6 10-11 15S12 42 8 39z\"/><path d=\"M38.5 9.5l3.5-3.5\"/><path d=\"M14 31l1.5 1.5M20 25l1.5 1.5M26 19l1.5 1.5M19 33l1.5 1.5M25 27l1.5 1.5M31 21l1.5 1.5\" opacity=\".6\"/>",
  // bacon, beicon, panceta
  "1F953": "<path d=\"M5 12c4-4 8-4 12 0s8 4 12 0 8-4 12 0v8c-4-4-8-4-12 0s-8 4-12 0-8-4-12 0z\"/><path d=\"M8 18.5c3-2 6-2 9 .5s7 3 12 0\" opacity=\".5\"/><path d=\"M7 30c4-4 8-4 12 0s8 4 12 0 8-4 12 0v8c-4-4-8-4-12 0s-8 4-12 0-8-4-12 0z\"/><path d=\"M19 36c3 2 7 3 12 0s7-2 9 .5\" opacity=\".5\"/>",
  // patata
  "1F954": "<path d=\"M8 23c0-8 7-13 16-13 9 0 16 4 16 12 0 3-1 5 0 9 1 6-6 10-15 10-10 0-17-4-17-10 0-3 0-5 0-8z\"/><path d=\"M15 20c1 0 2 1 2 2M28 18c1 0 2 1 2 2M22 31c1 0 2 1 2 2M33 30c1 0 2 1 2 2\" opacity=\".6\"/>",
  // zanahoria
  "1F955": "<path d=\"M30 18c-6-6-13 2-18 13-3 6-5 11-4 12s6-1 12-4c11-5 19-12 13-18z\"/><path d=\"M30 18c1-5 4-9 8-11M31 20c4-2 9-2 12 0M30 19c-1-4-3-8-6-10\"/><path d=\"M18 27l4 2M14 34l3 1.5M22 33l3 1.5\" opacity=\".55\"/>",
  // barra, baguette, pico
  "1F956": "<rect x=\"1\" y=\"19\" width=\"46\" height=\"12\" rx=\"6\" transform=\"rotate(-40 24 25)\"/><path d=\"M10 28l5-6M19 28l5-6M28 28l5-6\" transform=\"rotate(-40 24 25)\" opacity=\".55\"/>",
  // ensalada
  "1F957": "<path d=\"M5 25h38c0 10-8 17-19 17S5 35 5 25z\"/><path d=\"M11 25c0-6 4-10 10-11 0 5-3 9-7 11\"/><circle cx=\"27\" cy=\"20\" r=\"4\"/><path d=\"M31 25c1-6 5-9 10-9-1 5-4 8-8 9\"/><path d=\"M18 42h12\" opacity=\".55\"/>",
  // huevo
  "1F95A": "<path d=\"M24 6c-7.5 0-13 11-13 20a13 13 0 0 0 26 0C37 17 31.5 6 24 6z\"/><path d=\"M18 26a6 6 0 0 0 3 6\" opacity=\".55\"/>",
  // kefir, yogur, yogurt
  "1F95B": "<path d=\"M38 5l-8 10\"/><rect x=\"9\" y=\"15\" width=\"30\" height=\"5\" rx=\"2\"/><path d=\"M12 20l2.5 20a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2L36 20\"/><path d=\"M13.5 28h21\" opacity=\".55\"/>",
  // cacahuete, frutos secos
  "1F95C": "<path d=\"M24 5c5 0 9 4 9 9 0 4-3 6-3 9 0 3 4 5 4 10 0 6-5 10-10 10s-10-4-10-10c0-5 4-7 4-10 0-3-3-5-3-9 0-5 4-9 9-9z\" transform=\"rotate(-35 24 24)\"/><circle cx=\"20\" cy=\"15\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24\" cy=\"19\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"26\" cy=\"29\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"30\" cy=\"33\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"25\" cy=\"35\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"17\" cy=\"20\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/>",
  // kiwi
  "1F95D": "<circle cx=\"24\" cy=\"24\" r=\"18\"/><circle cx=\"24\" cy=\"24\" r=\"14.5\" opacity=\".5\"/><ellipse cx=\"24\" cy=\"24\" rx=\"4\" ry=\"3\"/><circle cx=\"33.0\" cy=\"24.0\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"30.4\" cy=\"29.7\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24.0\" cy=\"32.0\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"17.6\" cy=\"29.7\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"15.0\" cy=\"24.0\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"17.6\" cy=\"18.3\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24.0\" cy=\"16.0\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"30.4\" cy=\"18.3\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>",
  // tortita
  "1F95E": "<rect x=\"20\" y=\"9\" width=\"8\" height=\"5\" rx=\"1.5\"/><path d=\"M12 14h24a4 4 0 0 1 0 8H12a4 4 0 0 1 0-8z\"/><rect x=\"7\" y=\"22\" width=\"34\" height=\"8\" rx=\"4\"/><rect x=\"8\" y=\"30\" width=\"32\" height=\"8\" rx=\"4\"/><path d=\"M4 42h40\"/><path d=\"M30 22v4a2 2 0 0 0 4 0v-4M15 22v2a2 2 0 0 0 4 0\" opacity=\".55\"/>",
  // cereal, muesli
  "1F963": "<path d=\"M5 25h38c0 10-8 17-19 17S5 35 5 25z\"/><path d=\"M33 25l9-17\"/><circle cx=\"13\" cy=\"21\" r=\"3\"/><circle cx=\"21\" cy=\"19\" r=\"3\"/><circle cx=\"17\" cy=\"13\" r=\"3\"/><circle cx=\"27\" cy=\"21\" r=\"3\"/><path d=\"M18 42h12\" opacity=\".55\"/>",
  // refresco, cola, tonica
  "1F964": "<path d=\"M15 12l2-3h14l2 3v26l-2 3H17l-2-3z\"/><path d=\"M15 12h18M15 38h18\" opacity=\".55\"/><path d=\"M15 22c3 3 6 3 9 0s6-3 9 0\" opacity=\".55\"/><path d=\"M27 9l4-6h5\"/>",
  // coco
  "1F965": "<ellipse cx=\"24\" cy=\"20\" rx=\"19\" ry=\"6\"/><ellipse cx=\"24\" cy=\"20\" rx=\"13\" ry=\"3.5\" opacity=\".55\"/><path d=\"M5 20c0 11 8.5 20 19 20s19-9 19-20\"/><path d=\"M12 31l2-2M20 35l1-2.5M30 34.5l-1-2.5M37 30l-2-2\" opacity=\".55\"/>",
  // brocoli, coliflor
  "1F966": "<path d=\"M13 29a5 5 0 0 1-3-9 6 6 0 0 1 7-9 7 7 0 0 1 14 0 6 6 0 0 1 7 9 5 5 0 0 1-3 9z\"/><path d=\"M17 29l4 5v8h6v-8l4-5\"/><path d=\"M24 34v-5M18 21a3 3 0 0 1 4-3M27 16a3 3 0 0 1 4 2M24 24a3 3 0 0 1 4 0\" opacity=\".5\"/>",
  // carne, ternera, filete
  "1F969": "<path d=\"M10 13c6-5 13-3 17 1 3 3 7 2 10 2 5 1 7 6 6 12-1 9-9 14-19 14-9 0-17-5-17-14 0-6 0-11 3-15z\"/><path d=\"M10 13c6-5 13-3 17 1 3 3 7 2 10 2 5 1 7 6 6 12-1 9-9 14-19 14-9 0-17-5-17-14 0-6 0-11 3-15z\" transform=\"translate(24 26) scale(.74) translate(-24 -26)\" opacity=\".45\"/><circle cx=\"18\" cy=\"23\" r=\"4\"/><circle cx=\"18\" cy=\"23\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M25 31c3-1.5 6 .5 9-1\" opacity=\".55\"/>",
  // sandwich
  "1F96A": "<path d=\"M7 32L24 8l17 24z\"/><path d=\"M7 32c3-3 5 2 8 0s5-3 9 0 5 2 9 0 5-2 8 0\"/><path d=\"M7 32v5a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2v-5\"/><path d=\"M13 28l11-15.5L35 28\" opacity=\".45\"/>",
  // tomate frito, tomate triturado, atun
  "1F96B": "<ellipse cx=\"24\" cy=\"15\" rx=\"13\" ry=\"4.5\"/><path d=\"M11 15v22c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5V15\"/><path d=\"M11 23c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5M11 31c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5\" opacity=\".55\"/><ellipse cx=\"27.5\" cy=\"14.5\" rx=\"3.5\" ry=\"1.4\"/><path d=\"M24 14.8h-4\" />",
  // lechuga, espinaca, acelga
  "1F96C": "<path d=\"M9 27a6 6 0 0 1 5-9 7 7 0 0 1 10-8 7 7 0 0 1 10 8 6 6 0 0 1 5 9c0 9-7 15-15 15S9 36 9 27z\"/><path d=\"M24 41V22M18 21c-3 5-2.5 13 2 19M30 21c3 5 2.5 13-2 19\" opacity=\".55\"/>",
  // mango
  "1F96D": "<path d=\"M31 11c6.5 1.5 10 7 9 14-1.5 9-10 16.5-20 17.5-7 .7-12.5-2.5-12.5-8 0-5 4.5-7.5 9-9.5 5.5-2.5 6.5-7 7.5-10.5 1-3 4-4.5 7-3.5z\"/><path d=\"M31 11c.5-2.5 1.5-4.5 3-6\"/><path d=\"M33 7.5c3-3 8-3 10-2-1 4-6 5-10 2z\"/><path d=\"M13 36c2.5 1 6 1 9 0\" opacity=\".55\"/>",
  // cangrejo
  "1F980": "<ellipse cx=\"24\" cy=\"30\" rx=\"12\" ry=\"7.5\"/><path d=\"M14 25 11 18M34 25l3-7\"/><path d=\"M11 18c-4 0-6-4-5-8 2 2 4 3 6 2M11 18c3-1 4-5 3-8\"/><path d=\"M37 18c4 0 6-4 5-8-2 2-4 3-6 2M37 18c-3-1-4-5-3-8\"/><path d=\"M12.5 31 6 33M13 34.5 7 39M15 36.5l-4 5M35.5 31l6.5 2M35 34.5l6 4.5M33 36.5l4 5\"/><path d=\"M21 23v-4M27 23v-4\"/><circle cx=\"21\" cy=\"18.5\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"27\" cy=\"18.5\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/>",
  // pavo entero
  "1F983": "<path d=\"M8 31c0-8 7-14 16-14s16 6 16 14c0 3.5-2.5 6-6 6H14c-3.5 0-6-2.5-6-6z\"/><path d=\"M14 21 10 14M34 21l4-7\"/><circle cx=\"9\" cy=\"12\" r=\"2.5\"/><circle cx=\"39\" cy=\"12\" r=\"2.5\"/><path d=\"M5 41h38\"/><path d=\"M16 27c2-3 5-4.5 8-4.5\" opacity=\".55\"/>",
  // gamba, langostino, cigala
  "1F990": "<path d=\"M28 9c8 1 13 9 12 17-1 10-10 16-20 15l-1.5-7.5c6 1 12-3 13-8 .8-5-2-8.5-6-8.5z\"/><path d=\"M19.5 37.5 11 35l2 4.5-3 4.5 10-3\"/><path d=\"M32.5 23.5l6.5 2M30 29l5.5 5M24.5 32.5l2.5 7\" opacity=\".55\"/><path d=\"M27 9c-6-2-14 0-20 5M28 11c-6 1-11 4-14 8\"/><circle cx=\"31\" cy=\"13.5\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/>",
  // calamar, chipiron, sepia
  "1F991": "<path d=\"M24 5c-5 5-8 11-8 18v6h16v-6c0-7-3-13-8-18z\"/><path d=\"M17.5 13 11 20l6 1.5M30.5 13l6.5 7-6 1.5\"/><path d=\"M17 29c-1 5-4 9-7 13M20.5 29c0 5-1 9-3 13M24 29v13M27.5 29c0 5 1 9 3 13M31 29c1 5 4 9 7 13\"/><circle cx=\"20.5\" cy=\"24.5\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"27.5\" cy=\"24.5\" r=\"1.5\" fill=\"currentColor\" stroke=\"none\"/>",
  // bogavante
  "1F99E": "<path d=\"M24 12c-3.5 0-5.5 3-5.5 7v6c0 3 1.5 5 2.5 8h6c1-3 2.5-5 2.5-8v-6c0-4-2-7-5.5-7z\"/><path d=\"M21 33l-.5 4h7l-.5-4M20.5 37 16 43h16l-4.5-6\"/><path d=\"M19 18l-6-4M29 18l6-4\"/><path d=\"M13 14c-4 1-7-2-7-6 2 1.5 4 2 6 1M13 14c2-2 2-5 0-8\"/><path d=\"M35 14c4 1 7-2 7-6-2 1.5-4 2-6 1M35 14c-2-2-2-5 0-8\"/><path d=\"M22 12c-2-3-5-5-8-6M26 12c2-3 5-5 8-6M19 26h10M20 30h8\" opacity=\".55\"/>",
  // mejillon, almeja, berberecho
  "1F9AA": "<path d=\"M24 38 10 25c-3-3-3-8 0-11 4-5 9-8 14-8s10 3 14 8c3 3 3 8 0 11z\"/><path d=\"M19 38h10l-1.5 4h-7z\"/><path d=\"M24 36V8.5M24 36 15.5 11.5M24 36l8.5-24.5M24 36 9.5 19.5M24 36l14.5-16.5\" opacity=\".55\"/>",
  // pasta de dientes, dentifrico, pasta dental
  "1F9B7": "<path d=\"M5 18h4l21 4h4v10h-4L9 36H5z\"/><path d=\"M34 23h5a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 39 31h-5\"/><path d=\"M8.5 18.5v17\" opacity=\".55\"/><path d=\"M14 27h10\" opacity=\".55\"/><path d=\"M37.5 23c-1-4 1-7.5 4.5-7.5 2.5 0 3.5 3 1.5 4.5\"/>",
  // queso, mozzarella
  "1F9C0": "<path d=\"M6 30 34 14l8 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z\"/><path d=\"M6 30h36\" /><circle cx=\"15\" cy=\"35\" r=\"2\"/><circle cx=\"31\" cy=\"34\" r=\"2.5\"/><circle cx=\"26\" cy=\"23.5\" r=\"1.6\"/>",
  // magdalena
  "1F9C1": "<path d=\"M12 26h24l-3 16H15z\"/><path d=\"M18 26l1 16M24 26v16M30 26l-1 16\" opacity=\".55\"/><path d=\"M10 26c-2-6 2.5-10 7-10 1-5 4.5-8 7-8s6 3 7 8c4.5 0 9 4 7 10z\"/><circle cx=\"19\" cy=\"21\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"27\" cy=\"15\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"30\" cy=\"21.5\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>",
  // sal
  "1F9C2": "<path d=\"M16 16c0-5 4-9 8-9s8 4 8 9z\"/><path d=\"M15 16h18v4H15z\"/><path d=\"M16 20l-2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2l-2-20\"/><path d=\"M15.2 30h17.6\" opacity=\".55\"/><circle cx=\"20.5\" cy=\"12.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24\" cy=\"10.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"27.5\" cy=\"12.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/>",
  // zumo, nectar
  "1F9C3": "<path d=\"M14 17h22l-3 25H17z\"/><path d=\"M15 25h20\" opacity=\".55\"/><path d=\"M27 17l3-12h6\"/><path d=\"M8 17a7 7 0 0 1 14 0z\"/><path d=\"M15 17l-4-4M15 17v-5.5M15 17l4-4\" opacity=\".55\"/>",
  // ajo
  "1F9C4": "<path d=\"M24 5c0 5-2 7.5-5 9.5C13 18 8 23 8 30c0 6 4 11 9 11 3 0 5-1.5 7-1.5s4 1.5 7 1.5c5 0 9-5 9-11 0-7-5-12-11-15.5-3-2-5-4.5-5-9.5z\"/><path d=\"M23 16c-5 5-7 13-4 23M25 16c5 5 7 13 4 23\" opacity=\".55\"/><path d=\"M21 41.5 20 44M24 40v4M27 41.5l1 2.5\"/>",
  // cebolla, cebolleta, puerro
  "1F9C5": "<path d=\"M24 10c-1 5-6 7-10 10-4 3-6 7-6 11 0 7 7 11 16 11s16-4 16-11c0-4-2-8-6-11-4-3-9-5-10-10z\"/><path d=\"M24 10V5M24 7.5c2-2.5 4.5-3 6-2.5\"/><path d=\"M21 16c-6 6-7 17-2 25.5M27 16c6 6 7 17 2 25.5M24 15v27\" opacity=\".55\"/>",
  // gofre
  "1F9C7": "<rect x=\"8\" y=\"8\" width=\"32\" height=\"32\" rx=\"7\"/><path d=\"M18.7 9v30M29.3 9v30M9 18.7h30M9 29.3h30\" opacity=\".55\"/>",
  // mantequilla, margarina
  "1F9C8": "<path d=\"M12 22h18v12H12z\"/><path d=\"M12 22l6-5h18l-6 5M30 34l6-5V17\"/><path d=\"M5 34h38\"/><path d=\"M8 34c0 4 3 6 7 6h18c4 0 7-2 7-6\"/><path d=\"M16 26v4\" opacity=\".55\"/>",
  // hielo
  "1F9CA": "<rect x=\"7\" y=\"21\" width=\"19\" height=\"19\" rx=\"4.5\" transform=\"rotate(-10 16.5 30.5)\"/><rect x=\"24\" y=\"12\" width=\"17\" height=\"17\" rx=\"4\" transform=\"rotate(14 32.5 20.5)\"/><path d=\"M12 28c0-2 1-3.5 3-4M29 18c.3-1.8 1.5-2.8 3-3\" opacity=\".55\"/><path d=\"M38 33c-2 3-3 4.5-3 6a3 3 0 0 0 6 0c0-1.5-1-3-3-6z\"/>",
  // acondicionador, crema, desodorante
  "1F9F4": "<rect x=\"14\" y=\"20\" width=\"20\" height=\"23\" rx=\"4\"/><path d=\"M19 16h10v4H19z\"/><path d=\"M24 16v-5\"/><path d=\"M17 7h12v4H17z\"/><path d=\"M17 9h-5\"/><path d=\"M14 27h20M14 36h20\" opacity=\".55\"/>",
  // escoba, fregona
  "1F9F9": "<g transform=\"rotate(-18 24 24)\"><path d=\"M24 3v19\"/><path d=\"M18.5 22h11v4h-11z\"/><path d=\"M18.5 26 12 43h24l-6.5-17\"/><path d=\"M19.5 33 17.5 43M24 31v12M28.5 33l2 10\" opacity=\".55\"/></g>",
  // cesta
  "1F9FA": "<path d=\"M8 22h32l-4 18a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z\"/><path d=\"M5 22h38\"/><path d=\"M13 22c0-8 5-14 11-14s11 6 11 14\"/><path d=\"M9.5 29h29M11 35.5h26\" opacity=\".55\"/><path d=\"M18 22.5l1 19M24 22.5v19M30 22.5l-1 19\" opacity=\".35\"/>",
  // papel higienico, papel de cocina, rollo de cocina
  "1F9FB": "<path d=\"M12 12c0-3 2.5-5 6-5h16c3.5 0 6 2 6 5v26c0 3-2.5 5-6 5H18c-3.5 0-6-2-6-5z\"/><ellipse cx=\"26\" cy=\"12\" rx=\"14\" ry=\"5\" opacity=\"0\"/><path d=\"M12 12c0 3 2.5 5 6 5h16c3.5 0 6-2 6-5\"/><ellipse cx=\"26\" cy=\"11.8\" rx=\"4\" ry=\"1.6\"/><path d=\"M40 20v10l-3 2.5 3 2.5v3\" opacity=\".55\"/>",
  // champu, jabon
  "1F9FC": "<rect x=\"6\" y=\"25\" width=\"30\" height=\"16\" rx=\"6\"/><path d=\"M12 31c2-1.5 5-2 8-2\" opacity=\".55\"/><circle cx=\"33\" cy=\"14\" r=\"5.5\"/><circle cx=\"22\" cy=\"12\" r=\"3.2\"/><circle cx=\"41\" cy=\"23\" r=\"2.5\"/><path d=\"M31 11.5c.6-.8 1.4-1.2 2.4-1.3\" opacity=\".55\"/>",
  // estropajo, esponja, bayeta
  "1F9FD": "<rect x=\"6\" y=\"15\" width=\"36\" height=\"20\" rx=\"4\"/><path d=\"M6 28h36\"/><circle cx=\"13\" cy=\"20.5\" r=\"1.4\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"20\" cy=\"23\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"27\" cy=\"20\" r=\"1.4\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"34\" cy=\"23\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"36.5\" cy=\"19\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"16\" cy=\"24.5\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/>",
  // tirita
  "1FA79": "<rect x=\"5\" y=\"17\" width=\"38\" height=\"14\" rx=\"7\" transform=\"rotate(-45 24 24)\"/><rect x=\"18\" y=\"17\" width=\"12\" height=\"14\" rx=\"1.5\" transform=\"rotate(-45 24 24)\" opacity=\".55\"/><circle cx=\"22\" cy=\"22\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"26\" cy=\"26\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/>",
  // maquinilla, cuchilla
  "1FA92": "<rect x=\"11\" y=\"6\" width=\"26\" height=\"9\" rx=\"2.5\"/><path d=\"M14 10.5h20\" opacity=\".55\"/><path d=\"M22 15v4h4v-4\"/><rect x=\"20.5\" y=\"19\" width=\"7\" height=\"24\" rx=\"3.5\"/><path d=\"M24 25v12\" opacity=\".35\"/>",
  // cubo, detergente, suavizante
  "1FAA3": "<path d=\"M13 8h7v6h-7z\"/><path d=\"M11 14h17l3-4h4a4 4 0 0 1 4 4v26a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V16a2 2 0 0 1 2-2z\"/><path d=\"M30 15h4v6h-4z\"/><rect x=\"14\" y=\"25\" width=\"16\" height=\"11\" rx=\"2\" opacity=\".55\"/>",
  // cepillo de dientes
  "1FAA5": "<rect x=\"3\" y=\"29\" width=\"42\" height=\"5.5\" rx=\"2.75\" transform=\"rotate(-30 24 24)\"/><rect x=\"30\" y=\"19\" width=\"12\" height=\"9\" rx=\"2\" transform=\"rotate(-30 24 24)\"/><path d=\"M34 19v9M38 19v9\" transform=\"rotate(-30 24 24)\" opacity=\".55\"/>",
  // planta
  "1FAB4": "<path d=\"M11 28h26v4H11z\"/><path d=\"M13 32h22l-3 11H16z\"/><path d=\"M24 28V14\"/><path d=\"M24 22c-2-6-7-9-13-8 1 6 6 9 13 8z\"/><path d=\"M24 16c1-6 6-10 13-10 0 6-5 10-13 10z\"/>",
  // arandano
  "1FAD0": "<circle cx=\"16\" cy=\"32\" r=\"8\"/><circle cx=\"32\" cy=\"32\" r=\"8\"/><circle cx=\"24\" cy=\"18\" r=\"8\"/><path d=\"M16.0 28.8L16.8 30.9L19.0 31.0L17.3 32.4L17.9 34.6L16.0 33.4L14.1 34.6L14.7 32.4L13.0 31.0L15.2 30.9zM32.0 28.8L32.8 30.9L35.0 31.0L33.3 32.4L33.9 34.6L32.0 33.4L30.1 34.6L30.7 32.4L29.0 31.0L31.2 30.9zM24.0 14.8L24.8 16.9L27.0 17.0L25.3 18.4L25.9 20.6L24.0 19.4L22.1 20.6L22.7 18.4L21.0 17.0L23.2 16.9z\" opacity=\".6\"/><path d=\"M27 10.5c1-3 4-5 8-4.5-1 3.5-4 5-8 4.5z\"/>",
  // pimiento
  "1FAD1": "<path d=\"M24 15c-4-3-12-2.5-13.5 5.5-1.3 7 .5 15 3.5 19 2 2.5 5 2.5 6.5.5 1 2 6 2 7 0 1.5 2 4.5 2 6.5-.5 3-4 4.8-12 3.5-19C36 12.5 28 12 24 15z\"/><path d=\"M24 15c0-3.5 1.5-6.5 5-8\"/><path d=\"M18 15.5c3 1.8 9 1.8 12 0\"/><path d=\"M24 20v19\" opacity=\".35\"/>",
  // aceituna
  "1FAD2": "<path d=\"M6 13c11-5 25-5 36 1\"/><path d=\"M14 11c1.5-4 5-6 9-5.5-1.5 4-5 5.5-9 5.5z\" opacity=\".55\"/><path d=\"M34 12c3-3 6.5-4 9.5-2.5-2.5 3-6 4-9.5 2.5z\" opacity=\".55\"/><path d=\"M15 11l.5 8M32 11.5l.5 8.5\"/><ellipse cx=\"15.5\" cy=\"27.5\" rx=\"6.5\" ry=\"8.5\" transform=\"rotate(-8 15.5 27.5)\"/><ellipse cx=\"32.5\" cy=\"29\" rx=\"6.5\" ry=\"8.5\" transform=\"rotate(8 32.5 29)\"/><path d=\"M12.5 25c0-2 1-3.5 2.5-4.5M29.5 26.5c0-2 1-3.5 2.5-4.5\" opacity=\".55\"/>",
  // te
  "1FAD6": "<path d=\"M11 30c0-8 6-13 13-13s13 5 13 13c0 4-1.5 7.5-4 10H15c-2.5-2.5-4-6-4-10z\"/><path d=\"M18 17c0-3 2.7-5 6-5s6 2 6 5\"/><circle cx=\"24\" cy=\"9\" r=\"2\"/><path d=\"M11.5 27c-4-1-6-4-7-8 3 0 5.5 2 7.5 4.5\"/><path d=\"M36.5 24c4-.5 6.5 1.5 6.5 5s-2.5 6-7.5 7\"/><path d=\"M13 26h22\" opacity=\".45\"/>",
  // judia, alubia, garbanzo
  "1FAD8": "<path d=\"M-8 0c0-4.5 3.5-6.5 8-6.5s8 2 8 6.5-3.5 6.5-7 6.5c-2.5 0-3-2.5-5-2.5S-8 5-8 0z\" transform=\"translate(14 32) rotate(-20)\"/><path d=\"M-8 0c0-4.5 3.5-6.5 8-6.5s8 2 8 6.5-3.5 6.5-7 6.5c-2.5 0-3-2.5-5-2.5S-8 5-8 0z\" transform=\"translate(34 32) rotate(20)\"/><path d=\"M-8 0c0-4.5 3.5-6.5 8-6.5s8 2 8 6.5-3.5 6.5-7 6.5c-2.5 0-3-2.5-5-2.5S-8 5-8 0z\" transform=\"translate(24 15) rotate(-5)\"/><path d=\"M-4-2.5c2-1.3 5-1.3 7 0\" transform=\"translate(24 15) rotate(-5)\" opacity=\".55\"/><path d=\"M-4-2.5c2-1.3 5-1.3 7 0\" transform=\"translate(14 32) rotate(-20)\" opacity=\".55\"/><path d=\"M-4-2.5c2-1.3 5-1.3 7 0\" transform=\"translate(34 32) rotate(20)\" opacity=\".55\"/>",
  // mermelada, tarro, potito
  "1FAD9": "<rect x=\"13\" y=\"6\" width=\"22\" height=\"8\" rx=\"2\"/><path d=\"M17 14v3c-4 1-6 3.5-6 7v15a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V24c0-3.5-2-6-6-7v-3\"/><path d=\"M18 6v8M24 6v8M30 6v8\" opacity=\".45\"/><rect x=\"15\" y=\"26\" width=\"18\" height=\"10\" rx=\"2\" opacity=\".55\"/>",
  // jengibre
  "1FADA": "<path d=\"M6 35c0-3.5 2.5-6 6-6.5l-4-4.5c-2.8-3.2 1.2-8 5.2-5.6l6.3 5.1c2-1 4.5-1.5 7-1l2.8-7c1.7-3.8 8-2.8 7.2 1.6l-1.2 7c3.5 1.5 6.2 4.5 5.7 8-.5 3-3 4.4-6.5 4.4H12c-3.5 0-6-1.2-6-3.5z\"/><path d=\"M11 21.5l3-1.2M29 17.5l3.5 1.2M17 34.5c1.5-.8 3-.8 4.5 0M29.5 33.5c1.5-.8 3-.8 4.5 0\" opacity=\".55\"/>",
  // guisante
  "1FADB": "<path d=\"M5 22c3 9 11 15 19 15s16-6 19-15\"/><path d=\"M5 22c10 2.5 28 2.5 38 0\" opacity=\".55\"/><circle cx=\"14.5\" cy=\"20\" r=\"5\"/><circle cx=\"24\" cy=\"20\" r=\"5\"/><circle cx=\"33.5\" cy=\"20\" r=\"5\"/><path d=\"M43 22c1.5-2 2-4.5 1-7\"/>",
  // toallita
  "1FAE7": "<rect x=\"6\" y=\"19\" width=\"36\" height=\"22\" rx=\"7\"/><rect x=\"13\" y=\"22\" width=\"22\" height=\"9\" rx=\"4.5\" opacity=\".55\"/><path d=\"M18.5 26.5l1-10.5c2 1.2 4 .5 5-1.5 1 2 3 3 5 2l.5 10\"/><path d=\"M18.5 26.5c3.5 1 7.5 1 11 0\"/>",
  // friegasuelos, lejia, limpia
  "E0B1": "<path d=\"M12 8h18a4 4 0 0 1 4 4v3H18l-2-3h-4z\"/><path d=\"M20 15v5M28 15v5\"/><path d=\"M17 20h14c2 0 3 2 3 4v16a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V24c0-2 1-4 3-4z\"/><path d=\"M20 15c-3 1.5-4 4-4 7\" opacity=\".55\"/><circle cx=\"7\" cy=\"7\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"6\" cy=\"11\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"7\" cy=\"15\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/><rect x=\"18\" y=\"28\" width=\"12\" height=\"8\" rx=\"2\" opacity=\".55\"/>",
  // granada
  "E0C4": "<path d=\"M19 14c-6 2-9.5 7-9.5 13a14.5 14.5 0 0 0 29 0c0-6-3.5-11-9.5-13\"/><path d=\"M19 14l-1-7 3.5 3L24 6l2.5 4L30 7l-1 7\"/><path d=\"M19 14c3 1 7 1 10 0\" opacity=\".55\"/><path d=\"M15 26c0-3 1.5-5.5 4-7\" opacity=\".55\"/>",
  // bizcocho
  "E0C7": "<path d=\"M7 27c0-6 4-10 9-10h16c5 0 9 4 9 10v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z\"/><path d=\"M7 27c3 2 5 0 8 1.5s5 1.5 8 0 5-1.5 8 0 5 1.5 10-1.5\"/><path d=\"M17 21c3-2 10-2 14 0\" opacity=\".55\"/><path d=\"M13 34v4M21 33v5M29 33v5M36 34v4\" opacity=\".35\"/>",
  // champinon
  "E0C9": "<path d=\"M7 27c0-10 7.5-17 17-17s17 7 17 17c0 1.7-1.3 3-3 3H10c-1.7 0-3-1.3-3-3z\"/><path d=\"M16 30v6c0 3.5 3.5 6 8 6s8-2.5 8-6v-6\"/><path d=\"M14 20c2-3 5-4.5 8-5\" opacity=\".55\"/>",
  // hogaza, masa madre
  "E0CA": "<path d=\"M5 34c0-12 8.5-20 19-20s19 8 19 20c0 3-2 5-5 5H10c-3 0-5-2-5-5z\"/><path d=\"M14 22c2.5 2 4 5 4.5 8M22.5 18.5c2.5 2.5 4 6 4.5 10M31.5 20c2.5 2 4 5 4.5 8.5\" opacity=\".55\"/>",
  // aceite, vinagre, salsa
  "E0CB": "<path d=\"M21 5h6v6c0 2 5 4 5 10v19a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V21c0-6 5-8 5-10z\"/><path d=\"M21 9h6\"/><path d=\"M16 26h16M16 35h16\" opacity=\".55\"/>",
  // agua
  "E0CC": "<path d=\"M20 4h8v4h-8z\"/><path d=\"M20 8c-4 2-6 5-6 9v23a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V17c0-4-2-7-6-9\"/><path d=\"M14 24c3-2 6-2 10 0s7 2 10 0\" opacity=\".55\"/><path d=\"M14 33c3-2 6-2 10 0s7 2 10 0\" opacity=\".55\"/>",
  // leche, nata, batido
  "E153": "<path d=\"M15 18 20 9h8l5 9v24a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2z\"/><path d=\"M15 18h18\"/><path d=\"M20 9l-2 9M28 9l2 9\" opacity=\".55\"/><path d=\"M19 27h10M19 32h7\"/>",
  // picada
  "E2CE": "<path d=\"M4 30h40l-4 10a2 2 0 0 1-2 1.5H10A2 2 0 0 1 8 40z\"/><path d=\"M9 30c0-6 4-10 9-10 2-3.5 9-3.5 12 0 5 0 9 4 9 10\"/><path d=\"M15 26c1-1.2 2.2.8 3.5-.5M22 23c1-1.2 2.2.8 3.5-.5M29 26c1-1.2 2.2.8 3.5-.5M20 28c1-1.2 2.2.8 3.5-.5\" opacity=\".55\"/>",
  // suero
  "E307": "<path d=\"M10 5h8l-1 6h-6z\"/><path d=\"M12.5 11v3\"/><path d=\"M12.5 14h3\"/><path d=\"M15.5 11v3\"/><path d=\"M9.5 17.5c0-2 1.5-3.5 3-3.5h3c1.5 0 3 1.5 3 3.5V40a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3z\"/><path d=\"M20 5h8l-1 6h-6z\"/><path d=\"M22.5 11v3\"/><path d=\"M22.5 14h3\"/><path d=\"M25.5 11v3\"/><path d=\"M19.5 17.5c0-2 1.5-3.5 3-3.5h3c1.5 0 3 1.5 3 3.5V40a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3z\"/><path d=\"M30 5h8l-1 6h-6z\"/><path d=\"M32.5 11v3\"/><path d=\"M32.5 14h3\"/><path d=\"M35.5 11v3\"/><path d=\"M29.5 17.5c0-2 1.5-3.5 3-3.5h3c1.5 0 3 1.5 3 3.5V40a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3z\"/><path d=\"M10 30h8M20 30h8M30 30h8\" opacity=\".55\"/>",
  // termometro
  "E324": "<path d=\"M19 29V10a5 5 0 0 1 10 0v19a9 9 0 1 1-10 0z\"/><path d=\"M24 14v20\" opacity=\".55\"/><circle cx=\"24\" cy=\"36\" r=\"3.2\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M33 13h3M33 18h3M33 23h3\" opacity=\".55\"/>",
  // pañal
  "PANAL": "<path d=\"M7 14h34v4c0 6-4 10-9 11.5-2.5.8-4 3.5-4 7V40a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-3.5c0-3.5-1.5-6.2-4-7C11 28 7 24 7 18z\"/><path d=\"M7 18h34\"/><path d=\"M12 16h5M31 16h5\"/><path d=\"M17 31c2 1 3.5 3 4 5M31 31c-2 1-3.5 3-4 5\" opacity=\".55\"/>",
  // papel culo (papel higiénico húmedo): rollo con una gota de agua
  "PAPELHUM": "<path d=\"M8 15c0-3 2.3-5 5.5-5h13c3.2 0 5.5 2 5.5 5v22c0 3-2.3 5-5.5 5h-13C10.3 42 8 40 8 37z\"/><path d=\"M8 15c0 3 2.3 5 5.5 5h13c3.2 0 5.5-2 5.5-5\"/><ellipse cx=\"20\" cy=\"14.8\" rx=\"3.6\" ry=\"1.5\"/><path d=\"M38 20c-2.6 3.3-4 5.8-4 7.6a4 4 0 0 0 8 0c0-1.8-1.4-4.3-4-7.6z\"/><path d=\"M8 30c4 2.5 8 2.5 12 0s8-2.5 12 0\" opacity=\".55\"/>",
  // café en grano: tres granos con su surco
  "CAFEGRANO": "<g transform=\"rotate(-30 17 18)\"><ellipse cx=\"17\" cy=\"18\" rx=\"8\" ry=\"11\"/><path d=\"M17 7.5c-3 4-3 7 0 10.5s3 6.5 0 10.5\"/></g><g transform=\"rotate(25 32 25)\"><ellipse cx=\"32\" cy=\"25\" rx=\"8\" ry=\"11\"/><path d=\"M32 14.5c-3 4-3 7 0 10.5s3 6.5 0 10.5\"/></g><g transform=\"rotate(-10 18 37)\" opacity=\".55\"><ellipse cx=\"18\" cy=\"38\" rx=\"6\" ry=\"7.5\"/><path d=\"M18 31c-2 2.5-2 4.5 0 7s2 4.5 0 7\"/></g>",
  // macarrones: tres tubos en paralelo
  "MACARRON": "<g transform=\"translate(5.4 34.6) rotate(-35)\"><path d=\"M8 -4h18a4 4 0 0 1 0 8H8\"/><ellipse cx=\"8\" cy=\"0\" rx=\"2.6\" ry=\"4\"/><path d=\"M13 -2.2h10M13 2.2h10\" opacity=\".5\"/></g><g transform=\"translate(11.1 42.8) rotate(-35)\"><path d=\"M8 -4h18a4 4 0 0 1 0 8H8\"/><ellipse cx=\"8\" cy=\"0\" rx=\"2.6\" ry=\"4\"/><path d=\"M13 -2.2h10M13 2.2h10\" opacity=\".5\"/></g><g transform=\"translate(-0.3 26.4) rotate(-35)\"><path d=\"M8 -4h18a4 4 0 0 1 0 8H8\"/><ellipse cx=\"8\" cy=\"0\" rx=\"2.6\" ry=\"4\"/><path d=\"M13 -2.2h10M13 2.2h10\" opacity=\".5\"/></g>",
  // albahaca, perejil, hierbabuena: tallo con pares de hojas grandes
  "ALBAHACA": "<path d=\"M24 44V12\"/><path d=\"M24 30c-2-6-8-9-15-8 1 7 7 11 15 8z\"/><path d=\"M24 30c2-6 8-9 15-8-1 7-7 11-15 8z\"/><path d=\"M24 17c-1.5-5-6-8-11-7 .5 5.5 5 8.5 11 7z\"/><path d=\"M24 17c1.5-5 6-8 11-7-.5 5.5-5 8.5-11 7z\"/><path d=\"M24 12c-2-3-2-6 0-8 2 2 2 5 0 8z\"/><path d=\"M12 24.5l8 4M36 24.5l-8 4M15 12l6 3.5M33 12l-6 3.5\" opacity=\".55\"/>",
  // orégano, tomillo, romero, laurel: ramita de hojas pequeñas
  "HIERBA": "<path d=\"M24 44c0-12 1-24 6-38\"/><path d=\"M24.6 34c-4-1-7-4-8-8 4 0 7 3 8 8zM25 34c3-2.5 7-3 10-2-2 3-6 4.5-10 2z\"/><path d=\"M25.8 23c-3.5-1.5-6-4.5-6.5-8.5 3.5.5 6 3.8 6.5 8.5zM26.4 23c2.5-2.8 6-3.8 9-3.3-1.7 3-5.2 4.6-9 3.3z\"/><path d=\"M28 13c-2.5-1.7-4-4.5-4-7.5 2.8.8 4.3 3.8 4 7.5zM28.6 13c1.8-2.4 4.6-3.4 7-3-1.3 2.5-4 3.8-7 3z\"/><path d=\"M12 42h24\" opacity=\".55\"/>",
  // albóndigas: cuenco con tres bolas en salsa
  "ALBONDIGA": "<path d=\"M5 26h38c0 9-8 16-19 16S5 35 5 26z\"/><circle cx=\"16\" cy=\"21\" r=\"5.5\"/><circle cx=\"32\" cy=\"21\" r=\"5.5\"/><circle cx=\"24\" cy=\"17\" r=\"5.5\"/><path d=\"M12 32c4 2 8 2 12 0s8-2 12 0\" opacity=\".55\"/><circle cx=\"22.5\" cy=\"15.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"14.5\" cy=\"19.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"30.5\" cy=\"19.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/>",
  // alcachofa: brácteas en capas
  "ALCACHOFA": "<path d=\"M24 6c-9 3-15 11-15 20 0 8 6 13 15 13s15-5 15-13c0-9-6-17-15-20z\"/><path d=\"M11 22c4 4 9 5 13 2 4 3 9 2 13-2\" opacity=\".55\"/><path d=\"M10 30c4 4 9 5 14 2 5 3 10 2 14-2\" opacity=\".55\"/><path d=\"M15 13c3 3 6 4 9 2 3 2 6 1 9-2\" opacity=\".55\"/><path d=\"M24 15v9M24 24v8\" opacity=\".55\"/><path d=\"M24 39v5\"/>",
  // calabaza: gajos con rabito y hoja
  "CALABAZA": "<path d=\"M24 14c-3-2-8-2-11 0-5 3-7 9-7 14 0 8 5 14 11 14 3 0 5-1 7-1s4 1 7 1c6 0 11-6 11-14 0-5-2-11-7-14-3-2-8-2-11 0z\"/><path d=\"M24 14c-4 5-5 18-3 27M24 14c4 5 5 18 3 27\" opacity=\".55\"/><path d=\"M24 14c0-4 1-7 3-9\"/><path d=\"M27 8c3-3 8-3 10 0-3 3-7 3-10 0z\"/>",
  // ciruela: fruto ovalado con surco
  "CIRUELA": "<ellipse cx=\"24\" cy=\"28\" rx=\"12.5\" ry=\"15\"/><path d=\"M24 13c-3.5 6-3.5 22 0 30\" opacity=\".55\"/><path d=\"M24 13c0-3 .8-5.5 2.5-7.5\"/><path d=\"M26.5 8.5c3-3 8-3 11 0-3 3-8 3-11 0z\"/><path d=\"M16 23a8 8 0 0 1 3-6\" opacity=\".55\"/>",
  // espárragos: manojo atado
  "ESPARRAGO": "<path d=\"M16 44V14M24 44V9M32 44V14\"/><path d=\"M16 14c-2-2-2-5 0-7 2 2 2 5 0 7zM24 9c-2-2-2-5 0-7 2 2 2 5 0 7zM32 14c-2-2-2-5 0-7 2 2 2 5 0 7z\"/><path d=\"M12 30h24v5H12z\"/><path d=\"M16 21l-2-2M24 17l2-2M32 21l2-2M16 40l-1.5-1.5M32 40l1.5-1.5\" opacity=\".55\"/>",
  // estrellitas (pasta de sopa)
  "ESTRELLA": "<path d=\"M17 7l2.6 5.3 5.8.9-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.9z\"/><path d=\"M33 23l2.4 4.9 5.4.8-3.9 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.9-3.8 5.4-.8z\"/><path d=\"M14 31l1.6 3.2 3.5.5-2.5 2.5.6 3.5-3.2-1.7-3.2 1.7.6-3.5-2.5-2.5 3.5-.5z\"/><circle cx=\"17\" cy=\"15\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"33\" cy=\"31\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"14\" cy=\"36.5\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"34\" cy=\"9\" r=\"1.4\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"40\" cy=\"15\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/>",
  // lavavajillas a mano (Fairy): bote con tapón y pompas
  "LAVAVAJ": "<path d=\"M19 5h8v4h-8z\"/><path d=\"M17 9h12v4H17z\"/><path d=\"M17 13h12c3 0 5 3 5 6v1c0 3-2 4-2 7v13a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V27c0-3-2-4-2-7v-1c0-3 2-6 5-6z\"/><path d=\"M15 30h18\" opacity=\".55\"/><circle cx=\"39\" cy=\"10\" r=\"3\"/><circle cx=\"41\" cy=\"18\" r=\"1.8\" opacity=\".55\"/><circle cx=\"35\" cy=\"4.5\" r=\"1.4\" opacity=\".55\"/>",
  // pistacho: cáscara abierta con el fruto
  "PISTACHO": "<path d=\"M24 41c-8 0-13-5-13-12 0-8 4-16 9-21l4 9 4-9c5 5 9 13 9 21 0 7-5 12-13 12z\"/><path d=\"M24 17c-4 3-6 8-6 13 0 4 2.7 6 6 6s6-2 6-6c0-5-2-10-6-13z\"/><path d=\"M21 27c1-2 2-3 3.5-3.5\" opacity=\".55\"/>",
  // bote de especias: pimentón, comino, canela…
  "ESPECIA": "<path d=\"M15 8h18v7H15z\"/><path d=\"M16 15h16v25a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3z\"/><rect x=\"16\" y=\"23\" width=\"16\" height=\"11\" opacity=\".55\"/><circle cx=\"20\" cy=\"11.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"24\" cy=\"11.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"28\" cy=\"11.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M21 31c1-3 2.5-4.5 6-5\" opacity=\".55\"/>",
  // molinillo de pimienta
  "MOLINILLO": "<circle cx=\"24\" cy=\"6\" r=\"2.5\"/><path d=\"M18 9h12l-1 6H19z\"/><path d=\"M19 15h10c0 4 3 6 3 11s-3 7-3 11H19c0-4-3-6-3-11s3-7 3-11z\"/><path d=\"M15 37h18v4a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2z\"/><path d=\"M17.5 26h13\" opacity=\".55\"/><circle cx=\"9\" cy=\"40\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"40\" cy=\"41\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"38\" cy=\"35\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/>",
  // embutido curado: caña de lomo, chorizo, salchichón, fuet
  "EMBUTIDO": "<path d=\"M9 33c-3-3-3-8 1-11L28 7c4-3 9-3 11 0s1 7-2 10L19 33c-3 3-7 3-10 0z\"/><path d=\"M38 6.5l3-3M41 3.5c1.5 1.5 1 3-.5 4\" /><path d=\"M17 23l4 4M23 18l4 4M29 13l4 4\" opacity=\".55\"/><ellipse cx=\"34\" cy=\"37\" rx=\"7\" ry=\"7\"/><circle cx=\"32\" cy=\"35\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"36.5\" cy=\"37\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"33\" cy=\"39.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"35\" cy=\"33.5\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/>",
};
