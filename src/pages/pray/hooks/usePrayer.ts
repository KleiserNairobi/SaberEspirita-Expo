import { useQuery } from "@tanstack/react-query";

import { getPrayerById } from "@/services/firebase/prayerService";

export function usePrayer(prayerId: string) {
  return useQuery({
    queryKey: ["prayer", prayerId],
    queryFn: () => getPrayerById(prayerId),
    enabled: !!prayerId,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}
