import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";

/**
 * Interface for the persisted data in Firestore
 */
interface IPrayerFavoritesDoc {
  favorites: string[];
  updatedAt: any;
}

/**
 * Fetches the user's favorite prayer IDs from Firestore.
 * @param userId The authenticated user ID
 * @returns An array of prayer IDs
 */
export async function getUserFavoritePrayers(userId: string): Promise<string[]> {
  if (!userId) return [];

  try {
    const docRef = doc(db, "user_prayer_favorites", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as IPrayerFavoritesDoc;
      return data.favorites || [];
    }
  } catch (error) {
    console.warn("[PrayerFavoritesService] Erro ao buscar favoritos do usuário:", error);
  }

  return [];
}

/**
 * Syncs the user's favorite prayer IDs to Firestore.
 * @param userId The authenticated user ID
 * @param favorites Array of favorite prayer IDs to sync
 */
export async function syncUserFavoritePrayers(
  userId: string,
  favorites: string[]
): Promise<void> {
  if (!userId) return;

  try {
    const docRef = doc(db, "user_prayer_favorites", userId);
    await setDoc(
      docRef,
      {
        favorites,
        updatedAt: serverTimestamp(),
      },
      { merge: true } // Merge true to avoid overriding other fields if added later
    );
  } catch (error) {
    console.warn("[PrayerFavoritesService] Erro ao sincronizar favoritos:", error);
  }
}
