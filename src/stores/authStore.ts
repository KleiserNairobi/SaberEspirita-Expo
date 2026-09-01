import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { OneSignal } from "react-native-onesignal";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UserProfileDTO, authApiService } from "@/services/api/authApiService";
import * as Storage from "@/utils/Storage";
import { getDeviceIdentifiers } from "@/utils/device";

import { usePreferencesStore } from "./preferencesStore";

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

// Interface do Usuário da Aplicação
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  reload?: () => Promise<void>;
}

// Tipo legado exportado para compatibilidade total de tipagem nos componentes
export type User = AppUser;

// Interface para os dados do usuário que serão persistidos no MMKV
interface StoredUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Estado da store
interface AuthState {
  user: AppUser | null;
  isGuest: boolean;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  lastSeenUpdate: number | null;
  isDeviceBanned: boolean;

  // Actions
  setUser: (user: AppUser | null) => void;
  setLastSeenUpdate: (timestamp: number | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ user: AppUser }>;
  signInWithGoogle: (
    idToken: string,
    name?: string | null,
    photoUrl?: string | null
  ) => Promise<void>;
  signInWithApple: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  verifyEmailCode: (email: string, code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  confirmPasswordReset: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  sendVerificationEmail: (user: AppUser) => Promise<void>;
  initializeAuth: () => () => void;
  checkDeviceBanStatus: () => Promise<boolean>;
}

// Helper para converter DTO do backend para AppUser
const profileToAppUser = (
  profile?: UserProfileDTO | null,
  fallbackId?: string,
  fallbackEmail?: string,
  fallbackName?: string,
  emailVerified: boolean = true,
  fallbackPhotoUrl?: string | null
): AppUser => ({
  uid: profile?.userId || profile?.id || fallbackId || "user_" + Date.now(),
  email: profile?.email ?? fallbackEmail ?? null,
  displayName:
    profile?.userName ||
    profile?.displayName ||
    fallbackName ||
    profile?.email?.split("@")[0] ||
    fallbackEmail?.split("@")[0] ||
    "Usuário",
  photoURL: profile?.photoUrl || profile?.photoURL || fallbackPhotoUrl || null,
  emailVerified: emailVerified,
  reload: async () => {},
});

// Helper para converter AppUser para formato serializável
const userToStoredUser = (user: AppUser): StoredUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

// Helper para obter mensagem de erro amigável
const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.response?.data?.message) return error.response.data.message;
  return error?.message || "Erro de autenticação. Tente novamente.";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isGuest: false,
      loading: false,
      initialized: false,
      error: null,
      lastSeenUpdate: null,
      isDeviceBanned: false,

      setUser: (user) => set({ user }),
      setLastSeenUpdate: (lastSeenUpdate) => set({ lastSeenUpdate }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          let deviceIdPayload: string | undefined = undefined;
          try {
            const devIds = await getDeviceIdentifiers();
            deviceIdPayload = JSON.stringify(devIds);
          } catch {}

          const res = await authApiService.login({
            email,
            password,
            deviceId: deviceIdPayload,
          });
          const appUser = profileToAppUser(
            res.user,
            res.userId,
            res.email,
            res.displayName
          );

          set({ user: appUser, isGuest: false, loading: false });

          // Sincronizar com OneSignal
          try {
            OneSignal.login(appUser.uid);
            const preferences = usePreferencesStore.getState();
            OneSignal.User.addTags({
              app_updates: preferences.appUpdateNotifications.toString(),
              course_reminders: preferences.courseNotifications.toString(),
            });
          } catch (onesignalError) {
            console.error("Erro ao sincronizar OneSignal no login:", onesignalError);
          }
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          console.error("AuthStore: Erro no login:", errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, displayName?: string) => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Criando conta no Spring Boot...");
          const nameToUse = displayName?.trim() || email.split("@")[0] || "Usuário";
          let deviceIdPayload: string | undefined = undefined;
          try {
            const devIds = await getDeviceIdentifiers();
            deviceIdPayload = JSON.stringify(devIds);
          } catch {}

          const res = await authApiService.register({
            displayName: nameToUse,
            userName: nameToUse,
            email,
            password,
            deviceId: deviceIdPayload,
          });
          const appUser = profileToAppUser(
            res.user,
            res.userId,
            res.email,
            res.displayName || nameToUse,
            false
          );

          // Não publicamos user na store principal ainda para não forçar navegação prematura pelo RootNavigator
          set({ loading: false });
          return { user: appUser };
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          console.error("AuthStore: Erro ao criar conta:", errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      verifyEmailCode: async (email: string, code: string) => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Validando código de e-mail OTP...");
          const res = await authApiService.verifyEmail(email, code);
          const appUser = profileToAppUser(
            res.user,
            res.userId,
            res.email,
            res.displayName,
            true
          );

          set({ user: appUser, isGuest: false, loading: false });
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          console.error("AuthStore: Erro ao validar código de e-mail:", errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      resendVerificationCode: async (email: string) => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Solicitando reenvio de código OTP...");
          await authApiService.resendCode(email);
          set({ loading: false });
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          console.error("AuthStore: Erro ao reenviar código:", errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      signInWithGoogle: async (
        idToken: string,
        name?: string | null,
        photoUrl?: string | null
      ) => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Realizando login social REST com Google...");
          let deviceIdPayload: string | undefined = undefined;
          try {
            const devIds = await getDeviceIdentifiers();
            deviceIdPayload = JSON.stringify(devIds);
          } catch {}

          const res = await authApiService.socialLogin(
            "google",
            idToken,
            name,
            photoUrl,
            deviceIdPayload
          );
          const appUser = profileToAppUser(
            res.user,
            res.userId,
            res.email,
            res.displayName,
            true,
            res.photoUrl || (res.user as any)?.photoURL || (res.user as any)?.photoUrl || photoUrl
          );

          set({ user: appUser, isGuest: false, loading: false });

          try {
            OneSignal.login(appUser.uid);
            const preferences = usePreferencesStore.getState();
            OneSignal.User.addTags({
              app_updates: preferences.appUpdateNotifications.toString(),
              course_reminders: preferences.courseNotifications.toString(),
            });
          } catch (onesignalError) {
            console.error(
              "Erro ao sincronizar OneSignal no login Google:",
              onesignalError
            );
          }
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          console.error("AuthStore: Erro no login Google:", errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      signInWithApple: async () => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Realizando login social REST com Apple...");
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });

          let name: string | null = null;
          if (credential.fullName?.givenName || credential.fullName?.familyName) {
            name =
              `${credential.fullName.givenName || ""} ${credential.fullName.familyName || ""}`.trim();
          }

          if (!credential.identityToken) {
            throw new Error("Identity Token da Apple ausente.");
          }

          let deviceIdPayload: string | undefined = undefined;
          try {
            const devIds = await getDeviceIdentifiers();
            deviceIdPayload = JSON.stringify(devIds);
          } catch {}

          const res = await authApiService.socialLogin(
            "apple",
            credential.identityToken,
            name,
            deviceIdPayload
          );
          const appUser = profileToAppUser(
            res.user,
            res.userId,
            res.email,
            res.displayName
          );

          set({ user: appUser, isGuest: false, loading: false });

          try {
            OneSignal.login(appUser.uid);
            const preferences = usePreferencesStore.getState();
            OneSignal.User.addTags({
              app_updates: preferences.appUpdateNotifications.toString(),
              course_reminders: preferences.courseNotifications.toString(),
            });
          } catch (onesignalError) {
            console.error(
              "Erro ao sincronizar OneSignal no login Apple:",
              onesignalError
            );
          }
        } catch (error: any) {
          if (error.code === "ERR_REQUEST_CANCELED") {
            set({ loading: false });
            return;
          }
          const errorMessage = getErrorMessage(error);
          console.error("AuthStore: Erro no login Apple:", errorMessage);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      loginAsGuest: async () => {
        set({ loading: true, error: null });
        try {
          set({ user: null, isGuest: true, loading: false });
        } catch (error) {
          set({ error: "Erro ao entrar como convidado", loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Encerrando sessão...");
          await authApiService.logout();
          set({ user: null, isGuest: false, loading: false });

          try {
            await GoogleSignin.signOut();
          } catch {}

          try {
            OneSignal.logout();
          } catch (onesignalError) {
            console.error("Erro ao deslogar do OneSignal:", onesignalError);
          }
        } catch (error: any) {
          Storage.remove("jwt_token");
          Storage.remove("refresh_token");
          set({ user: null, isGuest: false, loading: false });
        }
      },

      sendPasswordResetEmail: async (email: string) => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Solicitando envio de OTP de redefinição para:", email);
          await authApiService.forgotPassword(email);
          set({ loading: false });
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      confirmPasswordReset: async (email: string, code: string, newPassword: string) => {
        set({ loading: true, error: null });
        try {
          console.log("AuthStore: Redefinindo senha com código OTP...");
          await authApiService.resetPassword(email, code, newPassword);
          set({ loading: false });
        } catch (error: any) {
          const errorMessage = getErrorMessage(error);
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      sendVerificationEmail: async (_user: AppUser) => {
        set({ loading: false });
      },

      initializeAuth: () => {
        console.log("AuthStore: Inicializando sessão (PostgreSQL/MMKV)...");

        get()
          .checkDeviceBanStatus()
          .catch(() => {});

        const { user, isGuest } = get();
        console.log(
          "AuthStore: Estado da sessão:",
          user ? `Usuário logado (${user.uid})` : isGuest ? "Convidado" : "Sem usuário"
        );

        set({ initialized: true, loading: false });

        if (user?.uid && !isGuest) {
          const jwtToken = Storage.loadString("jwt_token");
          const refreshToken = Storage.loadString("refresh_token");

          const ensureTokenAndFetchProfile = async () => {
            let activeToken = jwtToken;

            // Se não houver jwt_token no MMKV, gera/renova o token JWT no boot
            if (!activeToken) {
              const tokenToUse = refreshToken || user.uid;
              try {
                console.log(
                  "AuthStore: Obtendo token JWT do Spring Boot para a sessão ativa..."
                );
                const res = await authApiService.refreshToken(tokenToUse);
                const newToken = res?.accessToken || res?.token;
                if (newToken) {
                  activeToken = newToken;
                  console.log(
                    "AuthStore: Token JWT do Spring Boot obtido e salvo no MMKV com sucesso."
                  );
                }
              } catch (err) {
                console.warn("AuthStore: Falha ao obter token JWT inicial:", err);
              }
            }

            // Busca o perfil atualizado do usuário via GET /users/me
            try {
              const profile = await authApiService.getProfile();
              if (profile) {
                const updatedUser: AppUser = {
                  uid: profile.userId || profile.id || user.uid,
                  email: profile.email ?? user.email,
                  displayName: profile.displayName ?? profile.userName ?? user.displayName,
                  photoURL: profile.photoUrl ?? profile.photoURL ?? user.photoURL,
                  emailVerified: true,
                };
                set({ user: updatedUser });
                console.log(
                  "AuthStore: Perfil sincronizado via GET /users/me com sucesso."
                );
              }
            } catch (err) {
              console.warn(
                "AuthStore: Erro ao buscar perfil (mantendo sessão ativa offline):",
                err
              );
            }
          };

          ensureTokenAndFetchProfile();
        }

        return () => {};
      },

      checkDeviceBanStatus: async () => {
        set({ isDeviceBanned: false });
        return false;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user ? userToStoredUser(state.user) : null,
        isGuest: state.isGuest,
        lastSeenUpdate: state.lastSeenUpdate,
        isDeviceBanned: state.isDeviceBanned,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          console.log("AuthStore: Usuário restaurado do MMKV:", state.user.uid);
        }
        if (state?.isGuest) {
          console.log("AuthStore: Modo convidado restaurado do MMKV");
        }
      },
    }
  )
);

export function useAuth() {
  return useAuthStore();
}
