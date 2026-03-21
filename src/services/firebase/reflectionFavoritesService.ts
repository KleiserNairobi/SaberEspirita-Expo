import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";

/**
 * Interface for the persisted data in Firestore
 */
interface IReflectionFavoritesDoc {
  favorites: string[];
  updatedAt: any;
}

/**
 * Fetches the user's favorite reflection IDs from Firestore.
 * @param userId The authenticated user ID
 * @returns An array of reflection IDs
 */
export async function getUserFavoriteReflections(userId: string): Promise<string[]> {
  if (!userId) return [];

  try {
    const docRef = doc(db, "user_reflection_favorites", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as IReflectionFavoritesDoc;
      return data.favorites || [];
    }
  } catch (error) {
    console.warn("[ReflectionFavoritesService] Erro ao buscar favoritos do usuário:", error);
  }

  return [];
}

/**
 * Syncs the user's favorite reflection IDs to Firestore.
 * @param userId The authenticated user ID
 * @param favorites Array of favorite reflection IDs to sync
 */
export async function syncUserFavoriteReflections(
  userId: string,
  favorites: string[]
): Promise<void> {
  if (!userId) return;

  try {
    const docRef = doc(db, "user_reflection_favorites", userId);
    await setDoc(
      docRef,
      {
        favorites,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("[ReflectionFavoritesService] Erro ao sincronizar favoritos:", error);
  }
}
