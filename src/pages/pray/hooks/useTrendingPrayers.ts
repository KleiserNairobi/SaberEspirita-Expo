import { useQuery } from "@tanstack/react-query";
import { getTrendingPrayers } from "@/services/firebase/prayerService";

export type TrendingPeriod = "day" | "week" | "total";

export function useTrendingPrayers(period: TrendingPeriod) {
  return useQuery({
    queryKey: ["prayers", "trending", period],
    queryFn: () => getTrendingPrayers(period),
    staleTime: 1000 * 60 * 60 * 2, // 2 horas de validade do cache
    gcTime: 1000 * 60 * 60 * 24, // 24 horas na memória
    refetchOnWindowFocus: false, // Evita requisições ao minimizar/maximizar
    refetchOnMount: false, // Usa o cache existente se montar de novo
  });
}
