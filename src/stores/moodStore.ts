import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as Storage from "@/utils/Storage";

// Adapter MMKV para Zustand
const zustandStorage = {
  setItem: (name: string, value: string) => {
    Storage.saveString(name, value);
  },
  getItem: (name: string) => Storage.loadString(name),
  removeItem: (name: string) => {
    Storage.remove(name);
  },
};

export type UserMood =
  | "CALMO"
  | "TRISTE"
  | "ANSIOSO"
  | "GRATO"
  | "IRRITADO"
  | "CANSADO"
  | "DESCONHECIDO";

interface MoodState {
  currentMood: UserMood | null;
  lastMood: UserMood | null;
  lastMoodDate: string | null; // ISO Date String

  // Actions
  setMood: (mood: UserMood | null) => void;
  clearMood: () => void;
}

/**
 * Store para gerenciar o estado emocional do usuário (Mood Check-in)
 * Persiste o último humor por até 24h para criar o vínculo de acolhimento.
 */
export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      currentMood: null,
      lastMood: null,
      lastMoodDate: null,

      setMood: (mood) => {
        const now = new Date();
        const { currentMood } = get();

        // Se já houver um humor hoje, movemos para o 'last' antes de atualizar
        set({
          lastMood: currentMood,
          lastMoodDate: currentMood ? now.toISOString() : get().lastMoodDate,
          currentMood: mood,
        });
      },

      clearMood: () => set({ currentMood: null }),
    }),
    {
      name: "mood-storage",
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.lastMoodDate) {
          const lastDate = new Date(state.lastMoodDate);
          const now = new Date();
          const diffInHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);

          // Se passou mais de 24h, limpamos o rastro para resetar o acolhimento
          if (diffInHours > 24) {
            console.log("MoodStore: Passaram-se 24h, resetando rastro emocional.");
            state.lastMood = null;
            state.lastMoodDate = null;
          }
        }
      },
    }
  )
);
