import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export function usePrayerCategories() {
  return useQuery({
    queryKey: ["prayerCategories"],
    queryFn: () => prayerApiService.getPrayerCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
