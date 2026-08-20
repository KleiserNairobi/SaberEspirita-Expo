import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export function useFeaturedPrayers() {
  return useQuery({
    queryKey: ["prayers", "featured"],
    queryFn: async () => {
      const prayers = await prayerApiService.getPrayers();
      return prayers.filter((p) => p.featured);
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  });
}
