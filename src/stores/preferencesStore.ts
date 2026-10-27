import { syncOneSignalTags } from "@/services/notifications/oneSignalService";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export type RateAppStatus = "idle" | "rated" | "remind_later" | "declined";

interface PreferencesState {
  soundEffects: boolean;
  appUpdateNotifications: boolean;
  courseNotifications: boolean;

  // Rate App
  rateAppStatus: RateAppStatus;
  lastRateInteractionDate: string | null;
  lessonsCompletedCount: number;

  // Actions
  setSoundEffects: (value: boolean) => void;
  setAppUpdateNotifications: (value: boolean) => void;
  setCourseNotifications: (value: boolean) => void;

  // Rate App Actions
  incrementLessonsCompletedCount: () => void;
  setRateAppStatus: (status: RateAppStatus) => void;
  updateLastRateInteractionDate: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      soundEffects: true,
      appUpdateNotifications: true,
      courseNotifications: true,

      // Rate App defaults
      rateAppStatus: "idle",
      lastRateInteractionDate: null,
      lessonsCompletedCount: 0,

      setSoundEffects: (value) => set({ soundEffects: value }),
      setAppUpdateNotifications: (value) => {
        set({ appUpdateNotifications: value });
        syncOneSignalTags({ app_updates: value.toString() });
      },
      setCourseNotifications: (value) => {
        set({ courseNotifications: value });
        syncOneSignalTags({ course_reminders: value.toString() });
      },

      // Rate App Actions Implementation
      incrementLessonsCompletedCount: () =>
        set((state) => ({ lessonsCompletedCount: state.lessonsCompletedCount + 1 })),
      setRateAppStatus: (status) => set({ rateAppStatus: status }),
      updateLastRateInteractionDate: () =>
        set({ lastRateInteractionDate: new Date().toISOString() }),
    }),
    {
      name: "preferences-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
