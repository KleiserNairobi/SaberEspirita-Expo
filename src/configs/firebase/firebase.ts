import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
// @ts-ignore - O Metro Bundler exige o import de 'firebase/auth', mas o TS pode não reconhecer o membro
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { mmkvFirebaseStorage } from "@/utils/Storage";

// Configurando o Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializando o Firebase (singleton seguro para Fast Refresh)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Inicializa o Auth com persistência via MMKV.
 * Usamos um singleton direto para garantir que a persistência seja injetada no boot.
 */
let firebaseAuth: ReturnType<typeof initializeAuth>;

try {
  // Tenta inicializar com persistência MMKV
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(mmkvFirebaseStorage),
  });
} catch (e) {
  // Se já inicializado (HMR), recupera a instância
  firebaseAuth = getAuth(app) as any;
}

export const auth = firebaseAuth;

auth.languageCode = "pt-BR";
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
