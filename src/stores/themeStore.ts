import { Appearance } from "react-native";
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

export type ThemeType = "light" | "dark" | "system";

interface ThemeState {
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  toggleTheme: () => void;
  getResolvedTheme: () => "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeType: "system",

      setThemeType: (type: ThemeType) => set({ themeType: type }),

      toggleTheme: () => {
        const current = get().getResolvedTheme();
        set({ themeType: current === "light" ? "dark" : "light" });
      },

      getResolvedTheme: () => {
        const { themeType } = get();
        if (themeType === "system") {
          return Appearance.getColorScheme() === "dark" ? "dark" : "light";
        }
        return themeType;
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
