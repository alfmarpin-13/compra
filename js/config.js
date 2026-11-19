// Configuración web de Firebase. No es secreta: la seguridad la dan las reglas de Firestore.
// Pega aquí el objeto firebaseConfig de Configuración del proyecto → Tus apps → App web.
export const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "TU-PROYECTO.firebaseapp.com",
  projectId: "TU-PROYECTO",
  storageBucket: "TU-PROYECTO.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
};

export const isConfigured = () => !firebaseConfig.apiKey.startsWith("PEGA_");
