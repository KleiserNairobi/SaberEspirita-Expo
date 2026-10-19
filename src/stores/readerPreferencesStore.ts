import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as Storage from "@/utils/Storage";

const zustandStorage = {
  setItem: (name: string, value: string) => {
    Storage.saveString(name, value);
  },
  getItem: (name: string) => Storage.loadString(name),
  removeItem: (name: string) => {
    Storage.remove(name);
  },
};

export type FontSizeLevel = 0 | 1 | 2 | 3;
export type LineSpacingOption = "padrao" | "confortavel" | "amplo";

export interface FontScaleConfig {
  level: FontSizeLevel;
  code: "A1" | "A2" | "A3" | "A4";
  name: string;
  body: number;
  title: number;
  quote: number;
  baseLineHeight: number;
  label: string;
}

export const FONT_SCALES: Record<FontSizeLevel, FontScaleConfig> = {
  0: {
    level: 0,
    code: "A1",
    name: "Pequeno",
    body: 15,
    title: 19,
    quote: 14,
    baseLineHeight: 23,
    label: "15px • Pequeno",
  },
  1: {
    level: 1,
    code: "A2",
    name: "Padrão",
    body: 17,
    title: 22,
    quote: 16,
    baseLineHeight: 28,
    label: "17px • Padrão",
  },
  2: {
    level: 2,
    code: "A3",
    name: "Grande",
    body: 20,
    title: 25,
    quote: 18,
    baseLineHeight: 34,
    label: "20px • Grande",
  },
  3: {
    level: 3,
    code: "A4",
    name: "Muito Grande",
    body: 23,
    title: 28,
    quote: 21,
    baseLineHeight: 40,
    label: "23px • Muito Grande",
  },
};

export const LINE_SPACING_MULTIPLIERS: Record<LineSpacingOption, number> = {
  padrao: 1.5,
  confortavel: 1.7,
  amplo: 2.0,
};

export interface ReaderPreferencesState {
  fontSizeLevel: FontSizeLevel;
  lineSpacing: LineSpacingOption;

  setFontSizeLevel: (level: FontSizeLevel) => void;
  setLineSpacing: (spacing: LineSpacingOption) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetDefaults: () => void;

  getCurrentScale: () => FontScaleConfig;
  getFontSize: () => number;
  getTitleSize: () => number;
  getQuoteSize: () => number;
  getLineHeight: () => number;
}

export const useReaderPreferencesStore = create<ReaderPreferencesState>()(
  persist(
    (set, get) => ({
      fontSizeLevel: 1, // A2 Padrão (17px)
      lineSpacing: "confortavel", // 1.7x conforto visual

      setFontSizeLevel: (level: FontSizeLevel) => {
        const clamped = Math.max(0, Math.min(3, level)) as FontSizeLevel;
        set({ fontSizeLevel: clamped });
      },

      setLineSpacing: (spacing: LineSpacingOption) => {
        set({ lineSpacing: spacing });
      },

      increaseFontSize: () => {
        const { fontSizeLevel } = get();
        if (fontSizeLevel < 3) {
          get().setFontSizeLevel((fontSizeLevel + 1) as FontSizeLevel);
        }
      },

      decreaseFontSize: () => {
        const { fontSizeLevel } = get();
        if (fontSizeLevel > 0) {
          get().setFontSizeLevel((fontSizeLevel - 1) as FontSizeLevel);
        }
      },

      resetDefaults: () => {
        set({
          fontSizeLevel: 1,
          lineSpacing: "padrao",
        });
      },

      getCurrentScale: () => {
        const { fontSizeLevel } = get();
        return FONT_SCALES[fontSizeLevel] || FONT_SCALES[1];
      },

      getFontSize: () => {
        return get().getCurrentScale().body;
      },

      getTitleSize: () => {
        return get().getCurrentScale().title;
      },

      getQuoteSize: () => {
        return get().getCurrentScale().quote;
      },

      getLineHeight: () => {
        const { lineSpacing } = get();
        const scale = get().getCurrentScale();
        const multiplier = LINE_SPACING_MULTIPLIERS[lineSpacing] || 1.5;
        return Math.round(scale.body * multiplier);
      },
    }),
    {
      name: "reader-settings",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
