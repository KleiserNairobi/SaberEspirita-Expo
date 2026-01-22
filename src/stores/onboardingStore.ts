import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

// Estado da store
interface OnboardingState {
  hasSeenWelcome: boolean;
  markWelcomeAsSeen: () => void;
  resetWelcome: () => void; // Útil para testes
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,

      markWelcomeAsSeen: () => {
        console.log("OnboardingStore: Marcando welcome como visto");
        set({ hasSeenWelcome: true });
      },

      resetWelcome: () => {
        console.log("OnboardingStore: Resetando welcome (para testes)");
        set({ hasSeenWelcome: false });
      },
    }),
    {
      name: "onboarding-storage", // Chave no MMKV
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
