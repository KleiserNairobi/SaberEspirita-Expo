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
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
