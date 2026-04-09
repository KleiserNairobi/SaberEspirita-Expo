import { useQuery } from "@tanstack/react-query";
import { getAllPrayersWithCategories } from "@/services/firebase/prayerService";

export function useAllPrayersWithCategories() {
  return useQuery({
    queryKey: ["prayers", "allWithCategories"],
    queryFn: getAllPrayersWithCategories,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}
