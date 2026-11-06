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
 * Utilitário: Verifica se uma data ISO pertence a um dia civil anterior ao dia atual
 */
export function isDifferentDay(dateStr: string | null | undefined, now: Date = new Date()): boolean {
  if (!dateStr) return false;
  const recorded = new Date(dateStr);
  if (isNaN(recorded.getTime())) return false;
  return (
    recorded.getFullYear() !== now.getFullYear() ||
    recorded.getMonth() !== now.getMonth() ||
    recorded.getDate() !== now.getDate()
  );
}

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
  lastMoodDate: string | null; // ISO Date String do último registro

  // Actions
  setMood: (mood: UserMood | null) => void;
  setMoment: (moment: WisdomMoment | "RANDOM" | "GERAL" | null) => void;
  resetToDailyDefault: () => void;
  clearMood: () => void;
  checkDayTransition: () => boolean;
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

      // Verifica virada de dia civil: se o dia mudou, reseta o humor ativo do dia anterior
      checkDayTransition: () => {
        const { lastMoodDate, currentMood, lastMood } = get();
        if (!lastMoodDate) return false;

        if (isDifferentDay(lastMoodDate)) {
          console.log("[MoodStore] Virada de dia civil detectada. Renovando sintonia diária.");
          set({
            lastMood: currentMood || lastMood,
            currentMood: null,
            currentMoment: null,
          });
          return true;
        }
        return false;
      },

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
          lastMoodDate: now.toISOString(),
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
            lastMoodDate: now.toISOString(),
          });
          return;
        }

        if (moment === "RANDOM") {
          set({
            currentMoment: "RANDOM",
            lastMoodDate: now.toISOString(),
          });
          return;
        }

        const mappedMood = WISDOM_MOMENT_TO_MOOD[moment];

        if (mappedMood) {
          set({
            lastMood: currentMood,
            lastMoodDate: now.toISOString(),
            currentMoment: moment,
            currentMood: mappedMood,
          });
        } else {
          set({
            currentMoment: moment,
            lastMoodDate: now.toISOString(),
          });
        }
      },

      // Restaura para a lição oficial do dia e humor neutro
      resetToDailyDefault: () => {
        set({
          currentMood: null,
          currentMoment: null,
        });
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
        if (state) {
          state.checkDayTransition?.();
        }
      },
    }
  )
);
