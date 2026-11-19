// Configuración web de Firebase. No es secreta: la seguridad la dan las reglas de Firestore.
// Pega aquí el objeto firebaseConfig de Configuración del proyecto → Tus apps → App web.
export const firebaseConfig = {
  apiKey: "AIzaSyBBm5Jq5BtogztGc-ir0kvLxZq3c0KkE2E",
  authDomain: "alfilu-compra.firebaseapp.com",
  projectId: "alfilu-compra",
  storageBucket: "alfilu-compra.firebasestorage.app",
  messagingSenderId: "548734344561",
  appId: "1:548734344561:web:4efc89b3c74d276a13aad0",
};

export const isConfigured = () => !firebaseConfig.apiKey.startsWith("PEGA_");
