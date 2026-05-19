import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
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
 * Busca as orações mais lidas com base no período (day, week, total)
 * Integração real com prayer_logs e prayer_stats
 */
export async function getTrendingPrayers(period: "day" | "week" | "total"): Promise<IPrayer[]> {
  try {
    let prayerIds: { id: string; count: number }[] = [];

    if (period === "total") {
      // Busca direto das estatísticas consolidadas
      const statsRef = collection(db, "prayer_stats");
      const q = query(statsRef, orderBy("usageCount", "desc"), limit(10));
      const snapshot = await getDocs(q);
      prayerIds = snapshot.docs.map(doc => ({
        id: doc.id,
        count: doc.data().usageCount || 0
      }));
    } else {
      // Busca nos logs recentes (Hoje ou Semana)
      const logsRef = collection(db, "prayer_logs");
      const dateLimit = new Date();
      if (period === "day") {
        dateLimit.setHours(0, 0, 0, 0); // Desde o início do dia
      } else {
        dateLimit.setDate(dateLimit.getDate() - 7); // Últimos 7 dias
      }

      const q = query(logsRef, where("timestamp", ">=", dateLimit), limit(100)); // Pega uma amostra de logs
      const snapshot = await getDocs(q);
      
      const counts: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const id = doc.data().prayerId;
        if (id) counts[id] = (counts[id] || 0) + 1;
      });

      prayerIds = Object.entries(counts)
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }

    if (prayerIds.length === 0) return [];

    // Busca os detalhes das orações (Join)
    const ids = prayerIds.map(p => p.id);
    const prayers = await getPrayersByIds(ids);

    // Reordena as orações conforme o ranking e anexa o contador
    return prayerIds
      .map(p => {
        const prayer = prayers.find(item => item.id === p.id);
        if (prayer) {
          return {
            ...prayer,
            displayCount: p.count // Campo temporário para exibição no ranking
          };
        }
        return null;
      })
      .filter((p): p is (IPrayer & { displayCount: number }) => !!p);

  } catch (error) {
    console.warn("[TrendingService] Erro ao buscar rankings:", error);
    return [];
  }
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

/**
 * Busca todas as orações e as mapeia com seus respectivos categoryIds
 */
export async function getAllPrayersWithCategories(): Promise<(IPrayer & { categories: string[] })[]> {
  const prayersRef = collection(db, "prayers");
  const prayersSnapshot = await getDocs(prayersRef);
  
  const prayers = prayersSnapshot.docs.map((doc) => mapDocToPrayer(doc));

  const linksRef = collection(db, "prayer_category_links");
  const linksSnapshot = await getDocs(linksRef);

  // Map prayerId -> categoryId[]
  const categoryMap: Record<string, string[]> = {};
  linksSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (!categoryMap[data.prayerId]) {
      categoryMap[data.prayerId] = [];
    }
    categoryMap[data.prayerId].push(data.categoryId);
  });

  return prayers.map((prayer) => ({
    ...prayer,
    categories: categoryMap[prayer.id] || [],
  }));
}
