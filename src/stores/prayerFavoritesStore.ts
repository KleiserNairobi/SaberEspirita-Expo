import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { useAuthStore } from "@/stores/authStore";
import { storage } from "@/utils/Storage";
import {
  getUserFavoritePrayers,
  syncUserFavoritePrayers,
} from "@/services/firebase/prayerFavoritesService";

interface PrayerFavoritesState {
  favorites: string[];
  addFavorite: (prayerId: string) => void;
  removeFavorite: (prayerId: string) => void;
  isFavorite: (prayerId: string) => boolean;
  toggleFavorite: (prayerId: string) => void;
  syncWithFirebase: (userId: string) => Promise<void>;
}

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

export const usePrayerFavoritesStore = create<PrayerFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (prayerId: string) => {
        set((state) => {
          if (state.favorites.includes(prayerId)) return state;
          const newFavorites = [...state.favorites, prayerId];
          const uid = useAuthStore.getState().user?.uid;
          if (uid) syncUserFavoritePrayers(uid, newFavorites);
          return { favorites: newFavorites };
        });
      },

      removeFavorite: (prayerId: string) => {
        set((state) => {
          const newFavorites = state.favorites.filter((id) => id !== prayerId);
          const uid = useAuthStore.getState().user?.uid;
          if (uid) syncUserFavoritePrayers(uid, newFavorites);
          return { favorites: newFavorites };
        });
      },

      isFavorite: (prayerId: string) => {
        return get().favorites.includes(prayerId);
      },

      toggleFavorite: (prayerId: string) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(prayerId)) {
          removeFavorite(prayerId);
        } else {
          addFavorite(prayerId);
        }
      },

      syncWithFirebase: async (userId: string) => {
        try {
          const remoteFavorites = await getUserFavoritePrayers(userId);
          const localFavorites = get().favorites;
          
          // Merge local and remote
          const merged = Array.from(new Set([...localFavorites, ...remoteFavorites]));
          
          set({ favorites: merged });
          
          // If merged is larger than remote, push updates to Firebase
          if (merged.length > remoteFavorites.length) {
            await syncUserFavoritePrayers(userId, merged);
          }
        } catch (error) {
          console.warn("[prayerFavoritesStore] Erro no sync:", error);
        }
      },
    }),
    {
      name: "prayer-favorites",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
