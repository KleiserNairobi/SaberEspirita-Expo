import {
  getRecentPrayerIds,
} from "@/services/firebase/prayerService";
import { PRAYER_MOMENTS } from "@/types/prayer";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";

/**
 * Busca a contagem de orações de TODOS os momentos listados
 * Além da contagem, verifica se há orações "novas" (últimos 15 dias)
 */
export function usePrayerMomentsCounts() {
  return useQuery({
    queryKey: ["prayerMomentsCounts", "v4"], // v4 adiciona suporte a badge de novo
    queryFn: async () => {
      const categoryIds = Object.keys(PRAYER_MOMENTS);

      // 1. Busca todos os ids de orações criadas recentemente (últimos 15 dias)
      const recentIds = await getRecentPrayerIds(15);

      // 2. Para cada categoria, busca links e compara com o set de recentes
      const countsPromises = categoryIds.map(async (categoryId) => {
        try {
          // Buscamos os links para podermos identificar se algum é novo
          const linksRef = collection(db, "prayer_category_links");
          const linksQuery = query(linksRef, where("categoryId", "==", categoryId));
          const snapshot = await getDocs(linksQuery);

          const prayerIdsInCategory = snapshot.docs.map((doc) => doc.data().prayerId);
          const hasNew = prayerIdsInCategory.some((id) => recentIds.includes(id));

          return { categoryId, count: prayerIdsInCategory.length, hasNew };
        } catch (error) {
          console.error(`Erro buscando contagem da categoria ${categoryId}:`, error);
          return { categoryId, count: 0, hasNew: false };
        }
      });

      const results = await Promise.all(countsPromises);

      // Reduz resultados para mapa { 'AO-ACORDAR': { count: 5, hasNew: true }, ... }
      return results.reduce(
        (acc, item) => {
          acc[item.categoryId] = { count: item.count, hasNew: item.hasNew };
          return acc;
        },
        {} as Record<string, { count: number; hasNew: boolean }>
      );
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  });
}
