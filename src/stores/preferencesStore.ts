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

interface PreferencesState {
  soundEffects: boolean;
  appUpdateNotifications: boolean;
  courseNotifications: boolean;

  // Actions
  setSoundEffects: (value: boolean) => void;
  setAppUpdateNotifications: (value: boolean) => void;
  setCourseNotifications: (value: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      soundEffects: true,
      appUpdateNotifications: true,
      courseNotifications: true,

      setSoundEffects: (value) => set({ soundEffects: value }),
      setAppUpdateNotifications: (value) =>
        set({ appUpdateNotifications: value }),
      setCourseNotifications: (value) => set({ courseNotifications: value }),
    }),
    {
      name: "preferences-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
