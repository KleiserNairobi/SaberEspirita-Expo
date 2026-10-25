import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as Storage from "@/utils/Storage";
import { WisdomMoment } from "@/types/dailyWisdom";

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
  | "NORMAL"
  | "CALMO"
  | "TRISTE"
  | "ANSIOSO"
  | "GRATO"
  | "IRRITADO"
  | "CANSADO"
  | "DESCONHECIDO";

/**
 * Mapeamento: Humor Emocional (Ore) ➔ Momento da Alma (Medite)
 */
export const MOOD_TO_WISDOM_MOMENT: Record<UserMood, WisdomMoment> = {
  NORMAL: "GERAL",
  CALMO: "GERAL",
  TRISTE: "AFLICAO_PROVAS",
  ANSIOSO: "ANSIEDADE_MEDO",
  GRATO: "GRATIDAO_LOUVOR",
  IRRITADO: "PERDAO_HARMONIA",
  CANSADO: "DESANIMO_FORCA",
  DESCONHECIDO: "GERAL",
};

/**
 * Mapeamento: Momento da Alma (Medite) ➔ Humor Emocional (Ore)
 * Apenas momentos com equivalência semântica direta refletem em Ore.
 * Momentos como SAUDE_CURA e DECISAO_SABEDORIA são temáticos e não forçam alteração de humor.
 */
export const WISDOM_MOMENT_TO_MOOD: Partial<Record<WisdomMoment, UserMood>> = {
  LUTO_SAUDADE: "TRISTE",
  AFLICAO_PROVAS: "TRISTE",
  PERDAO_HARMONIA: "IRRITADO",
  ANSIEDADE_MEDO: "ANSIOSO",
  DESANIMO_FORCA: "CANSADO",
  GRATIDAO_LOUVOR: "GRATO",
};

interface MoodState {
  currentMood: UserMood | null;
  currentMoment: WisdomMoment | "RANDOM" | "GERAL" | null;
  lastMood: UserMood | null;
  lastMoodDate: string | null; // ISO Date String

  // Actions
  setMood: (mood: UserMood | null) => void;
  setMoment: (moment: WisdomMoment | "RANDOM" | "GERAL" | null) => void;
  clearMood: () => void;
}

/**
 * Store unificado para gerenciar o estado emocional (Ore) e reflexivo (Medite)
 * Garante via de mão dupla entre o diagnóstico de humor e o momento da sabedoria.
 */
export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      currentMood: null,
      currentMoment: null,
      lastMood: null,
      lastMoodDate: null,

      // 1. Ação a partir de Ore ➔ reflete em Medite
      setMood: (mood) => {
        const now = new Date();
        const { currentMood } = get();

        if (!mood) {
          set({ currentMood: null, currentMoment: null });
          return;
        }

        const mappedMoment = MOOD_TO_WISDOM_MOMENT[mood] || "GERAL";

        set({
          lastMood: currentMood,
          lastMoodDate: currentMood ? now.toISOString() : get().lastMoodDate,
          currentMood: mood,
          currentMoment: mappedMoment,
        });
      },

      // 2. Ação a partir de Medite ➔ reflete em Ore
      setMoment: (moment) => {
        const now = new Date();
        const { currentMood } = get();

        if (!moment || moment === "GERAL") {
          set({
            currentMoment: "GERAL",
          });
          return;
        }

        if (moment === "RANDOM") {
          set({
            currentMoment: "RANDOM",
          });
          return;
        }

        // Apenas reflete em Ore se houver correspondência emocional genuína.
        // Se o momento for situacional (ex: Saúde e Cura, Decisão e Discernimento),
        // não força humor artificial e mantém a escolha do usuário.
        const mappedMood = WISDOM_MOMENT_TO_MOOD[moment];

        if (mappedMood) {
          set({
            lastMood: currentMood,
            lastMoodDate: currentMood ? now.toISOString() : get().lastMoodDate,
            currentMoment: moment,
            currentMood: mappedMood,
          });
        } else {
          set({
            currentMoment: moment,
          });
        }
      },

      clearMood: () => set({ currentMood: null, currentMoment: null }),
    }),
    {
      name: "mood-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        currentMood: state.currentMood,
        currentMoment: state.currentMoment,
        lastMood: state.lastMood,
        lastMoodDate: state.lastMoodDate,
      }),
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
            state.currentMood = null;
            state.currentMoment = null;
          }
        }
      },
    }
  )
);
