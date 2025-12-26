import { create } from "zustand";
import { storage } from "@/utils/Storage";

const FONT_SIZE_KEY = "prayer-font-size-level";

// Mapeamento de níveis para tamanhos (usando tokens do tema)
const FONT_SIZE_MAP = {
  0: 16, // md - padrão
  1: 18, // lg
  2: 20, // xl
  3: 24, // xxl
  4: 32, // xxxl
} as const;

interface PrayerPreferencesState {
  fontSizeLevel: number;
  setFontSizeLevel: (level: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  getFontSize: () => number;
}

export const usePrayerPreferencesStore = create<PrayerPreferencesState>((set, get) => ({
  fontSizeLevel: storage.getNumber(FONT_SIZE_KEY) ?? 0,

  setFontSizeLevel: (level: number) => {
    const clampedLevel = Math.max(0, Math.min(4, level));
    storage.set(FONT_SIZE_KEY, clampedLevel);
    set({ fontSizeLevel: clampedLevel });
  },

  increaseFontSize: () => {
    const currentLevel = get().fontSizeLevel;
    if (currentLevel < 4) {
      get().setFontSizeLevel(currentLevel + 1);
    }
  },

  decreaseFontSize: () => {
    const currentLevel = get().fontSizeLevel;
    if (currentLevel > 0) {
      get().setFontSizeLevel(currentLevel - 1);
    }
  },

  getFontSize: () => {
    const level = get().fontSizeLevel as keyof typeof FONT_SIZE_MAP;
    return FONT_SIZE_MAP[level];
  },
}));
