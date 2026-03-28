import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { IPrayer, IPrayerCategory } from "@/types/prayer";

/**
 * Converte um documento do Firestore para o tipo IPrayer, tratando Timestamps
 */
function mapDocToPrayer(doc: any): IPrayer {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
  } as IPrayer;
}

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

  // Buscar orações em lotes de 10 (limite do Firestore para operador 'in')
  const prayersRef = collection(db, "prayers");
  const chunks: string[][] = [];

  for (let i = 0; i < prayerIds.length; i += 10) {
    chunks.push(prayerIds.slice(i, i + 10));
  }

  const prayersPromises = chunks.map(async (chunk) => {
    const q = query(prayersRef, where(documentId(), "in", chunk));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => mapDocToPrayer(doc));
  });

  const results = await Promise.all(prayersPromises);

  // Flatten dos resultados
  return results.flat();
}

/**
 * Busca uma oração específica por ID
 */
export async function getPrayerById(prayerId: string): Promise<IPrayer | null> {
  const prayerDoc = await getDoc(doc(db, "prayers", prayerId));

  if (!prayerDoc.exists()) {
    return null;
  }

  return mapDocToPrayer(prayerDoc);
}

/**
 * Busca orações em destaque (featured)
 */
export async function getFeaturedPrayers(): Promise<IPrayer[]> {
  const prayersRef = collection(db, "prayers");
  const featuredQuery = query(prayersRef, where("featured", "==", true));
  const snapshot = await getDocs(featuredQuery);

  return snapshot.docs.map((doc) => mapDocToPrayer(doc));
}

/**
 * Busca a quantidade total de orações de uma categoria
 */
export async function getCategoryPrayerCount(categoryId: string): Promise<number> {
  const linksRef = collection(db, "prayer_category_links");
  const linksQuery = query(linksRef, where("categoryId", "==", categoryId));
  const snapshot = await getDocs(linksQuery);

  return snapshot.docs.length;
}

/**
 * Busca orações através de uma lista de IDs (usado para Favoritos)
 */
export async function getPrayersByIds(prayerIds: string[]): Promise<IPrayer[]> {
  if (!prayerIds || prayerIds.length === 0) {
    return [];
  }

  const prayersRef = collection(db, "prayers");
  const chunks: string[][] = [];

  // Firestore "in" limit is 10
  for (let i = 0; i < prayerIds.length; i += 10) {
    chunks.push(prayerIds.slice(i, i + 10));
  }

  const prayersPromises = chunks.map(async (chunk) => {
    const q = query(prayersRef, where(documentId(), "in", chunk));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => mapDocToPrayer(doc));
  });

  const results = await Promise.all(prayersPromises);
  return results.flat();
}

/**
 * Busca IDs de orações criadas nos últimos X dias
 */
export async function getRecentPrayerIds(days: number): Promise<string[]> {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const prayersRef = collection(db, "prayers");
  const recentQuery = query(prayersRef, where("createdAt", ">=", dateLimit));
  const snapshot = await getDocs(recentQuery);

  return snapshot.docs.map((doc) => doc.id);
}
