import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { storage } from "@/utils/Storage";

interface PrayerFavoritesState {
  favorites: string[];
  addFavorite: (prayerId: string) => void;
  removeFavorite: (prayerId: string) => void;
  isFavorite: (prayerId: string) => boolean;
  toggleFavorite: (prayerId: string) => void;
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
        set((state) => ({
          favorites: [...state.favorites, prayerId],
        }));
      },

      removeFavorite: (prayerId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== prayerId),
        }));
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
    }),
    {
      name: "prayer-favorites",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
