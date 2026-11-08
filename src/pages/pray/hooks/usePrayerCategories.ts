import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export function usePrayerCategories() {
  return useQuery({
    queryKey: ["prayerCategories"],
    queryFn: () => prayerApiService.getPrayerCategories(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    refetchOnReconnect: true,
    retry: 2,
  });
}
