import { useQuery } from "@tanstack/react-query";

import { getFeaturedPrayers } from "@/services/firebase/prayerService";

export function useFeaturedPrayers() {
  return useQuery({
    queryKey: ["prayers", "featured"],
    queryFn: getFeaturedPrayers,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
