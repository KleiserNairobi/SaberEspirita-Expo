import { useQuery } from "@tanstack/react-query";

import { getPrayerCategories } from "@/services/firebase/prayerService";

export function usePrayerCategories() {
  return useQuery({
    queryKey: ["prayerCategories"],
    queryFn: getPrayerCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
