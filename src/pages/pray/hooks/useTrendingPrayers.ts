import { useQuery } from "@tanstack/react-query";
import { getTrendingPrayers } from "@/services/firebase/prayerService";

export type TrendingPeriod = "day" | "week" | "total";

export function useTrendingPrayers(period: TrendingPeriod) {
  return useQuery({
    queryKey: ["prayers", "trending", period],
    queryFn: () => getTrendingPrayers(period),
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: true,
  });
}
