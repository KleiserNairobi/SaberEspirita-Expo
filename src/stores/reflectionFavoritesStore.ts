import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { useAuthStore } from "@/stores/authStore";
import { storage } from "@/utils/Storage";
import {
  getUserFavoriteReflections,
  syncUserFavoriteReflections,
} from "@/services/firebase/reflectionFavoritesService";

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
          const uid = useAuthStore.getState().user?.uid;
          if (uid) syncUserFavoriteReflections(uid, newFavorites);
          return { favorites: newFavorites };
        });
      },

      removeFavorite: (reflectionId: string) => {
        set((state) => {
          const newFavorites = state.favorites.filter((id) => id !== reflectionId);
          const uid = useAuthStore.getState().user?.uid;
          if (uid) syncUserFavoriteReflections(uid, newFavorites);
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

      syncWithFirebase: async (userId: string) => {
        try {
          const remoteFavorites = await getUserFavoriteReflections(userId);
          const localFavorites = get().favorites;
          
          // Merge local and remote
          const merged = Array.from(new Set([...localFavorites, ...remoteFavorites]));
          
          set({ favorites: merged });
          
          // If merged is larger than remote, push updates to Firebase
          if (merged.length > remoteFavorites.length) {
            await syncUserFavoriteReflections(userId, merged);
          }
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
