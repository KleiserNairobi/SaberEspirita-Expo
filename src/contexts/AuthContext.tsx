import { auth } from "@/lib/firebase";
import { AUTH_KEYS, load, remove, save } from "@/utils/Storage";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// Interface para os dados do usuário que serão salvos no MMKV
interface StoredUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Inicia como true para indicar restauração
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para converter User do Firebase para StoredUser
  const userToStoredUser = (user: User): StoredUser => {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString(),
    };
  };

  // Função para salvar usuário no MMKV
  const saveUserToStorage = (user: User | null) => {
    if (user) {
      const storedUser = userToStoredUser(user);
      save(AUTH_KEYS.USER, storedUser);
      console.log("Usuário salvo no MMKV:", storedUser.uid);
    } else {
      remove(AUTH_KEYS.USER);
      console.log("Usuário removido do MMKV");
    }
  };

  // Função para carregar usuário do MMKV
  const loadUserFromStorage = (): User | null => {
    const storedUser = load<StoredUser>(AUTH_KEYS.USER);
    if (storedUser) {
      console.log("Usuário carregado do MMKV:", storedUser.uid);
      // Converter StoredUser para um objeto compatível com User do Firebase
      // Nota: Esta é uma representação parcial, suficiente para a UI
      return {
        uid: storedUser.uid,
        email: storedUser.email,
        displayName: storedUser.displayName,
        photoURL: storedUser.photoURL,
        // Outras propriedades necessárias podem ser adicionadas aqui
      } as User;
    }
    return null;
  };

  useEffect(() => {
    console.log("AuthProvider: Iniciando restauração de sessão...");

    // 1. Primeiro tenta carregar do MMKV (instantâneo)
    const storedUser = loadUserFromStorage();
    if (storedUser) {
      console.log("AuthProvider: Usuário encontrado no MMKV:", storedUser.uid);
      setUser(storedUser);
      setInitialized(true);
      setLoading(false); // Já temos usuário, pode mostrar a UI
    } else {
      console.log("AuthProvider: Nenhum usuário encontrado no MMKV");
    }

    // 2. Depois verifica com Firebase (validação em background)
    const timer = setTimeout(() => {
      console.log("AuthProvider: Iniciando listener do Firebase...");
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log(
          "AuthProvider: Estado do Firebase:",
          firebaseUser ? `Usuário logado (${firebaseUser.uid})` : "Sem usuário"
        );

        if (firebaseUser) {
          // Atualiza com dados do Firebase
          console.log("AuthProvider: Sincronizando com MMKV...");
          setUser(firebaseUser);
          saveUserToStorage(firebaseUser); // Sincroniza com MMKV
        } else if (!storedUser) {
          // Nenhum usuário local nem no Firebase
          console.log("AuthProvider: Limpando estado (sem usuário)");
          setUser(null);
          saveUserToStorage(null);
        }

        setInitialized(true);
        setLoading(false);
      });

      return unsubscribe;
    }, 500);

    return () => {
      console.log("AuthProvider: Limpando timer e unsubscribe");
      clearTimeout(timer);
    };
  }, []);

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      saveUserToStorage(userCredential.user); // Salva no MMKV
      setLoading(false);
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/user-disabled":
          errorMessage = "Usuário desabilitado";
          break;
        case "auth/user-not-found":
          errorMessage = "Usuário não encontrado";
          break;
        case "auth/wrong-password":
          errorMessage = "Senha incorreta";
          break;
        case "auth/invalid-credential":
          errorMessage = "Credenciais inválidas";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente novamente mais tarde";
          break;
        default:
          errorMessage = error.message || "Erro ao fazer login";
      }

      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      saveUserToStorage(userCredential.user); // Salva no MMKV
      setLoading(false);
    } catch (error: any) {
      let errorMessage = "Erro ao criar conta";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este email já está em uso";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Operação não permitida";
          break;
        case "auth/weak-password":
          errorMessage = "Senha muito fraca. Use no mínimo 6 caracteres";
          break;
        default:
          errorMessage = error.message || "Erro ao criar conta";
      }

      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      saveUserToStorage(null); // Remove do MMKV
      setLoading(false);
    } catch (error: any) {
      setError("Erro ao fazer logout");
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    initialized,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
