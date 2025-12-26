import { useQuery } from "@tanstack/react-query";

import { getPrayersByCategory } from "@/services/firebase/prayerService";

export function usePrayersByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["prayers", "category", categoryId],
    queryFn: () => getPrayersByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
