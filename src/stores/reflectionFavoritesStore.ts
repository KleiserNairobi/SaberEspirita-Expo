import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { storage } from "@/utils/Storage";

interface ReflectionFavoritesState {
  favorites: string[];
  addFavorite: (reflectionId: string) => void;
  removeFavorite: (reflectionId: string) => void;
  isFavorite: (reflectionId: string) => boolean;
  toggleFavorite: (reflectionId: string) => void;
}

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

export const useReflectionFavoritesStore = create<ReflectionFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (reflectionId: string) => {
        set((state) => ({
          favorites: [...state.favorites, reflectionId],
        }));
      },

      removeFavorite: (reflectionId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== reflectionId),
        }));
      },

      isFavorite: (reflectionId: string) => {
        return get().favorites.includes(reflectionId);
      },

      toggleFavorite: (reflectionId: string) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(reflectionId)) {
          removeFavorite(reflectionId);
        } else {
          addFavorite(reflectionId);
        }
      },
    }),
    {
      name: "reflection-favorites",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
