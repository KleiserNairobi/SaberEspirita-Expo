import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/configs/firebase/firebase";
import * as Storage from "@/utils/Storage";

// Adapter MMKV para Zustand (mesmo padrão do themeStore)
const zustandStorage = {
  setItem: (name: string, value: string) => {
    Storage.saveString(name, value);
  },
  getItem: (name: string) => Storage.loadString(name),
  removeItem: (name: string) => {
    Storage.remove(name);
  },
};

// Interface para os dados do usuário que serão persistidos
interface StoredUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Estado da store
interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  initializeAuth: () => (() => void) | undefined;
}

// Helper para converter User do Firebase para formato serializável
const userToStoredUser = (user: User): StoredUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

// Helper para obter mensagem de erro amigável
const getErrorMessage = (error: any): string => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Email inválido";
    case "auth/user-disabled":
      return "Usuário desabilitado";
    case "auth/user-not-found":
      return "Usuário não encontrado";
    case "auth/wrong-password":
      return "Senha incorreta";
    case "auth/invalid-credential":
      return "Credenciais inválidas";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde";
    case "auth/email-already-in-use":
      return "Este email já está em uso";
    case "auth/operation-not-allowed":
      return "Operação não permitida";
    case "auth/weak-password":
      return "Senha muito fraca. Use no mínimo 6 caracteres";
    default:
      return error.message || "Erro desconhecido";
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      initialized: false,
      error: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Iniciando login...");
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log("AuthStore: Login bem-sucedido:", userCredential.user.uid);
          set({ user: userCredential.user, loading: false });
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          console.error("AuthStore: Erro no login:", errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Criando nova conta...");
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          console.log("AuthStore: Conta criada:", userCredential.user.uid);
          set({ user: userCredential.user, loading: false });
          return userCredential;
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          console.error("AuthStore: Erro ao criar conta:", errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Fazendo logout...");
          await firebaseSignOut(auth);
          set({ user: null, loading: false });
          console.log("AuthStore: Logout concluído");
        } catch (error: any) {
          const errorMessage = "Erro ao fazer logout";
          console.error("AuthStore:", errorMessage, error);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      initializeAuth: () => {
        console.log("AuthStore: Inicializando listener do Firebase...");

        // Listener do Firebase para sincronizar estado
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          console.log(
            "AuthStore: Estado do Firebase:",
            firebaseUser ? `Usuário logado (${firebaseUser.uid})` : "Sem usuário"
          );

          if (firebaseUser) {
            // Firebase retornou usuário autenticado
            set({ user: firebaseUser, initialized: true, loading: false });
          } else {
            // Firebase retornou null
            // Verificar se há usuário persistido no MMKV
            const currentUser = get().user;

            if (currentUser) {
              console.log(
                "AuthStore: Firebase null, mas usuário encontrado no MMKV. Mantendo sessão."
              );
              // Mantém o usuário do MMKV (persistência offline)
              set({ initialized: true, loading: false });
            } else {
              // Nenhum usuário
              console.log("AuthStore: Nenhum usuário autenticado");
              set({ user: null, initialized: true, loading: false });
            }
          }
        });

        // Retorna função de cleanup (não usada aqui, mas poderia ser útil)
        return unsubscribe;
      },
    }),
    {
      name: "auth-storage", // Chave no MMKV
      storage: createJSONStorage(() => zustandStorage),
      // Particializar para salvar apenas dados serializáveis do user
      partialize: (state) => ({
        user: state.user ? userToStoredUser(state.user) : null,
      }),
      // Após hidratar do MMKV, reconstruir o objeto User
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          console.log("AuthStore: Usuário restaurado do MMKV:", state.user.uid);
        }
      },
    }
  )
);

// Hook de compatibilidade (opcional, para facilitar migração gradual)
export function useAuth() {
  return useAuthStore();
}
