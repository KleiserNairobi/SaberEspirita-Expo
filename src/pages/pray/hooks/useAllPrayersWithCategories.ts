import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export function useAllPrayersWithCategories() {
  return useQuery({
    queryKey: ["prayers", "allWithCategories"],
    queryFn: () => prayerApiService.getPrayers(),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}
