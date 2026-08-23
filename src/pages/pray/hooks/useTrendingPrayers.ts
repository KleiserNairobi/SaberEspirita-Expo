import { useQuery } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";

export type TrendingPeriod = "day" | "week" | "total";

export function useTrendingPrayers(period: TrendingPeriod) {
  return useQuery({
    queryKey: ["prayers", "trending", period],
    queryFn: () => prayerApiService.getTrendingPrayers(period),
    staleTime: 1000 * 60 * 5, // 5 minutos de validade do cache
    gcTime: 1000 * 60 * 60, // 1 hora na memória
    refetchOnWindowFocus: false, // Evita requisições ao minimizar/maximizar
    refetchOnMount: false, // Usa o cache existente se montar de novo
  });
}
