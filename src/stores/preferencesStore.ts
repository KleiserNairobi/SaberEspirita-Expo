import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { OneSignal } from "react-native-onesignal";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { auth, db } from "@/configs/firebase/firebase";
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

        const uid = auth.currentUser?.uid;
        if (uid) {
          setDoc(
            doc(db, "users", uid),
            {
              "notificationPrefs.course_reminders": value,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          ).catch((error) => {
            console.error("Erro ao persistir preferência course_reminders:", error);
          });
        }
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
