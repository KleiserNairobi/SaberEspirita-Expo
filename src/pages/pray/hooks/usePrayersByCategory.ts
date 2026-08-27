import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export function usePrayersByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["prayers", "category", categoryId],
    queryFn: () => prayerApiService.getPrayers({ categoryId }),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 15, // 15 minutos
    refetchOnMount: true,
  });
}
