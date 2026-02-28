import { getCategoryPrayerCount } from "@/services/firebase/prayerService";
import { PRAYER_MOMENTS } from "@/types/prayer";
import { useQuery } from "@tanstack/react-query";

/**
 * Busca a contagem de orações de TODOS os momentos listados
 */
export function usePrayerMomentsCounts() {
  return useQuery({
    queryKey: ["prayerMomentsCounts", "v3"], // v3 ignora cache de erros silenciosos do getCount
    queryFn: async () => {
      const categoryIds = Object.keys(PRAYER_MOMENTS);

      // Resolve todas as contagens em paralelo
      const countsPromises = categoryIds.map(async (categoryId) => {
        try {
          const count = await getCategoryPrayerCount(categoryId);
          return { categoryId, count };
        } catch (error) {
          console.error(`Erro buscando contagem da categoria ${categoryId}:`, error);
          return { categoryId, count: 0 };
        }
      });

      const results = await Promise.all(countsPromises);

      // Reduz resultados para mapa { 'AO-ACORDAR': 5, ... }
      return results.reduce(
        (acc, item) => {
          acc[item.categoryId] = item.count;
          return acc;
        },
        {} as Record<string, number>
      );
    },
    staleTime: 1000 * 60 * 30, // Mantém contagem válida em cache por 30m
  });
}
