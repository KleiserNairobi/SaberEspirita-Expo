import { useQuery } from "@tanstack/react-query";

import { getPrayersByIds } from "@/services/firebase/prayerService";

export function usePrayersByIds(prayerIds: string[]) {
  return useQuery({
    queryKey: ["prayers", "byIds", prayerIds],
    queryFn: () => getPrayersByIds(prayerIds),
    enabled: prayerIds.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}
