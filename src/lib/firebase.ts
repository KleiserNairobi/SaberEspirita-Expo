import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configurando o Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCnoAUmWP2Hhu3yHCv7rm2pILsFUinGdWI",
  authDomain: "saber-espirita.firebaseapp.com",
  databaseURL: "https://saber-espirita.firebaseio.com",
  projectId: "saber-espirita",
  storageBucket: "saber-espirita.firebasestorage.app",
  messagingSenderId: "280205524209",
  appId: "1:280205524209:web:889baa34bb3004389f3d50",
  measurementId: "G-65YMZ4PKGY",
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Configurar auth - o Firebase deve detectar automaticamente o AsyncStorage
// em ambientes React Native quando a biblioteca está instalada
export const auth = getAuth(app);

// Nota: A partir do Firebase v9+, a persistência é configurada automaticamente
// para React Native quando @react-native-async-storage/async-storage está instalado

export const db = getFirestore(app);
export default app;
