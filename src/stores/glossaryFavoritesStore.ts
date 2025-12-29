import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage } from "@/utils/Storage";

interface GlossaryFavoritesState {
  favorites: string[];
  toggleFavorite: (termId: string) => void;
  isFavorite: (termId: string) => boolean;
}

const zustandStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

export const useGlossaryFavoritesStore = create<GlossaryFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (termId) => {
        const { favorites } = get();
        set({
          favorites: favorites.includes(termId)
            ? favorites.filter((id) => id !== termId)
            : [...favorites, termId],
        });
      },
      isFavorite: (termId) => get().favorites.includes(termId),
    }),
    {
      name: "glossary-favorites",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
