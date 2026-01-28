import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { IPrayer, IPrayerCategory, IPrayerCategoryLink } from "@/types/prayer";

/**
 * Busca todas as categorias de orações
 */
export async function getPrayerCategories(): Promise<IPrayerCategory[]> {
  const categoriesRef = collection(db, "prayer_categories");
  const snapshot = await getDocs(categoriesRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IPrayerCategory[];
}

/**
 * Busca orações de uma categoria específica
 */
export async function getPrayersByCategory(categoryId: string): Promise<IPrayer[]> {
  // Buscar links da categoria
  const linksRef = collection(db, "prayer_category_links");
  const linksQuery = query(linksRef, where("categoryId", "==", categoryId));
  const linksSnapshot = await getDocs(linksQuery);

  const prayerIds = linksSnapshot.docs.map((doc) => doc.data().prayerId);

  if (prayerIds.length === 0) {
    return [];
  }

  // Buscar orações
  // Buscar orações em paralelo para performance
  const prayerPromises = prayerIds.map((prayerId) =>
    getDoc(doc(db, "prayers", prayerId))
  );

  const prayerDocs = await Promise.all(prayerPromises);

  const prayers: IPrayer[] = prayerDocs
    .filter((doc) => doc.exists())
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as IPrayer
    );

  return prayers;
}

/**
 * Busca uma oração específica por ID
 */
export async function getPrayerById(prayerId: string): Promise<IPrayer | null> {
  const prayerDoc = await getDoc(doc(db, "prayers", prayerId));

  if (!prayerDoc.exists()) {
    return null;
  }

  return {
    id: prayerDoc.id,
    ...prayerDoc.data(),
  } as IPrayer;
}

/**
 * Busca orações em destaque (featured)
 */
export async function getFeaturedPrayers(): Promise<IPrayer[]> {
  const prayersRef = collection(db, "prayers");
  const featuredQuery = query(prayersRef, where("featured", "==", true));
  const snapshot = await getDocs(featuredQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IPrayer[];
}
