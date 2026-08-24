import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export function useAllPrayersWithCategories() {
  return useQuery({
    queryKey: ["prayers", "allWithCategories", "v2"],
    queryFn: () => prayerApiService.getPrayers(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
