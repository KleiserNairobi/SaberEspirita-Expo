import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { storage } from "@/utils/Storage";
import { favoritesApiService } from "@/services/api/favoritesApiService";

interface ReflectionFavoritesState {
  favorites: string[];
  addFavorite: (reflectionId: string) => void;
  removeFavorite: (reflectionId: string) => void;
  isFavorite: (reflectionId: string) => boolean;
  toggleFavorite: (reflectionId: string) => void;
  syncWithFirebase: (userId: string) => Promise<void>;
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
        set((state) => {
          if (state.favorites.includes(reflectionId)) return state;
          const newFavorites = [...state.favorites, reflectionId];
          favoritesApiService.toggleReflectionFavorite(reflectionId).catch(() => {});
          return { favorites: newFavorites };
        });
      },

      removeFavorite: (reflectionId: string) => {
        set((state) => {
          const newFavorites = state.favorites.filter((id) => id !== reflectionId);
          favoritesApiService.toggleReflectionFavorite(reflectionId).catch(() => {});
          return { favorites: newFavorites };
        });
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

      syncWithFirebase: async (_userId: string) => {
        try {
          const remoteFavorites = await favoritesApiService.getFavoriteReflections();
          const remoteIds = remoteFavorites.filter(Boolean);
          const localFavorites = get().favorites;
          
          const merged = Array.from(new Set([...localFavorites, ...remoteIds]));
          set({ favorites: merged });
        } catch (error) {
          console.warn("[reflectionFavoritesStore] Erro no sync:", error);
        }
      },
    }),
    {
      name: "reflection-favorites",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
