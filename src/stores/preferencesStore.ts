import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OneSignal } from "react-native-onesignal";
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
      setAppUpdateNotifications: (value) => {
        set({ appUpdateNotifications: value });
        // Sincronizar com OneSignal
        try {
          OneSignal.User.addTag("app_updates", value.toString());
        } catch (error) {
          console.error("Erro ao sincronizar tag app_updates:", error);
        }
      },
      setCourseNotifications: (value) => {
        set({ courseNotifications: value });
        // Sincronizar com OneSignal
        try {
          OneSignal.User.addTag("course_reminders", value.toString());
        } catch (error) {
          console.error("Erro ao sincronizar tag course_reminders:", error);
        }
      },
    }),
    {
      name: "preferences-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
