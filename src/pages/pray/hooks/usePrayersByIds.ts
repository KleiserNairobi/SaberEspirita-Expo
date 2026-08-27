import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export function usePrayersByIds(prayerIds: string[]) {
  return useQuery({
    queryKey: ["prayers", "byIds", prayerIds],
    queryFn: async () => {
      const allPrayers = await prayerApiService.getPrayers();
      return allPrayers.filter((p) => prayerIds.includes(p.id));
    },
    enabled: prayerIds.length > 0,
    staleTime: 1000 * 60 * 15, // 15 minutos
    refetchOnMount: true,
  });
}
