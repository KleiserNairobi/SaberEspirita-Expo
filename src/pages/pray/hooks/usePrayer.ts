import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export function usePrayer(prayerId: string) {
  return useQuery({
    queryKey: ["prayer", prayerId],
    queryFn: () => prayerApiService.getPrayerById(prayerId),
    enabled: !!prayerId,
    staleTime: 1000 * 60 * 15, // 15 minutos
    refetchOnMount: true,
  });
}
