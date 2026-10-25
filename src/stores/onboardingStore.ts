import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { userOnboardingApiService } from "@/services/api/userOnboardingApiService";
import { OnboardingAnswers } from "@/types/onboarding";
import * as Storage from "@/utils/Storage";

// Adapter MMKV para Zustand (mesmo padrão do themeStore e authStore)
const zustandStorage = {
  setItem: (name: string, value: string) => {
    Storage.saveString(name, value);
  },
  getItem: (name: string) => Storage.loadString(name),
  removeItem: (name: string) => {
    Storage.remove(name);
  },
};

export interface OnboardingStoreState {
  hasSeenWelcome: boolean; // Mantido para retrocompatibilidade
  hasCompletedOnboarding: boolean;
  answers: OnboardingAnswers;
  isSyncedWithBackend: boolean;
  completedAt?: string;
  notificationPromptDismissedAt?: string;

  setOnboardingAnswer: <K extends keyof OnboardingAnswers>(
    field: K,
    value: OnboardingAnswers[K]
  ) => void;
  completeOnboarding: (isAuthenticated?: boolean) => Promise<void>;
  syncPendingOnboardingWithBackend: () => Promise<void>;
  markWelcomeAsSeen: () => void; // Compatibilidade legada
  resetOnboarding: () => void;
  dismissNotificationPrompt: () => void;
  shouldShowNotificationPrompt: () => boolean;
}

export const useOnboardingStore = create<OnboardingStoreState>()(
  persist(
    (set, get) => ({
      hasSeenWelcome: false,
      hasCompletedOnboarding: false,
      answers: {},
      isSyncedWithBackend: false,
      completedAt: undefined,

      setOnboardingAnswer: (field, value) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [field]: value,
          },
        }));
      },

      completeOnboarding: async (isAuthenticated = false) => {
        const now = new Date().toISOString();
        set({
          hasCompletedOnboarding: true,
          hasSeenWelcome: true,
          completedAt: now,
        });

        // Se o usuário já estiver autenticado, tenta sincronizar imediatamente com o backend
        if (isAuthenticated) {
          const answers = get().answers;
          if (answers.moment || answers.goal || answers.dailyTime) {
            const success = await userOnboardingApiService.updateOnboarding(answers);
            if (success) {
              set({ isSyncedWithBackend: true });
            }
          }
        }
      },

      syncPendingOnboardingWithBackend: async () => {
        const state = get();
        if (state.isSyncedWithBackend) return;

        const answers = state.answers;
        if (answers.moment || answers.goal || answers.dailyTime) {
          console.log(
            "OnboardingStore: Sincronizando dados pendentes de onboarding com o backend..."
          );
          const success = await userOnboardingApiService.updateOnboarding(answers);
          if (success) {
            console.log(
              "OnboardingStore: Onboarding sincronizado com sucesso no PostgreSQL."
            );
            set({ isSyncedWithBackend: true });
          }
        }
      },

      markWelcomeAsSeen: () => {
        set({
          hasCompletedOnboarding: true,
          hasSeenWelcome: true,
        });
      },

      resetOnboarding: () => {
        set({
          hasSeenWelcome: false,
          hasCompletedOnboarding: false,
          answers: {},
          isSyncedWithBackend: false,
          completedAt: undefined,
          notificationPromptDismissedAt: undefined,
        });
      },

      dismissNotificationPrompt: () => {
        set({ notificationPromptDismissedAt: new Date().toISOString() });
      },

      shouldShowNotificationPrompt: () => {
        const state = get();
        // Se o usuário já configurou o horário de notificação, nunca mais exibe
        if (state.answers.notificationTime) return false;
        // Se nunca dispensou o aviso, deve exibir
        if (!state.notificationPromptDismissedAt) return true;
        // Se já dispensou, aguarda 7 dias de respiro para oferecer novamente
        const dismissedTime = new Date(state.notificationPromptDismissedAt).getTime();
        const now = Date.now();
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        return now - dismissedTime > SEVEN_DAYS_MS;
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => zustandStorage),
      // Retrocompatibilidade automática: se hasSeenWelcome era true, consideramos onboarding completo
      merge: (persistedState: any, currentState: OnboardingStoreState) => {
        const merged = { ...currentState, ...persistedState };
        if (merged.hasSeenWelcome) {
          merged.hasCompletedOnboarding = true;
        }
        return merged;
      },
    }
  )
);
