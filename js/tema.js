// Antes de pintar nada (script normal, no módulo):
// 1) La app no se deja meter dentro de otra web (protección contra «clickjacking»; GitHub Pages no deja
//    mandar la cabecera frame-ancestors y una CSP en <meta> no la admite).
// 2) Tema claro/oscuro, para que no parpadee.
(function () {
  if (window.top !== window.self) {
    document.documentElement.style.display = "none";
    try { window.top.location.replace(window.self.location.href); } catch (e) {}
    throw new Error("Compra no se puede abrir dentro de otra página");
  }
  try {
    var t = localStorage.getItem("compra.theme") || "system";
    var dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    if (dark) document.querySelector('meta[name="theme-color"]').content = "#0E1511";
    if (navigator.standalone) document.documentElement.classList.add("standalone");
  } catch (e) {}
})();
