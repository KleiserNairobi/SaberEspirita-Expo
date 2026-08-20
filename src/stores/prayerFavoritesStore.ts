import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { storage } from "@/utils/Storage";
import { favoritesApiService } from "@/services/api/favoritesApiService";

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
          favoritesApiService.togglePrayerFavorite(prayerId).catch(() => {});
          return { favorites: newFavorites };
        });
      },

      removeFavorite: (prayerId: string) => {
        set((state) => {
          const newFavorites = state.favorites.filter((id) => id !== prayerId);
          favoritesApiService.togglePrayerFavorite(prayerId).catch(() => {});
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

      syncWithFirebase: async (_userId: string) => {
        try {
          const remoteFavorites = await favoritesApiService.getFavoritePrayers();
          const remoteIds = remoteFavorites.filter(Boolean);
          const localFavorites = get().favorites;
          
          const merged = Array.from(new Set([...localFavorites, ...remoteIds]));
          set({ favorites: merged });
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
