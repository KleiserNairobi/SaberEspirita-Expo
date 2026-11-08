import { useQuery, useQueryClient } from "@tanstack/react-query";
import { prayerApiService } from "@/services/api/prayerApiService";
import { IPrayer } from "@/types/prayer";

export function usePrayer(prayerId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["prayer", prayerId],
    queryFn: () => prayerApiService.getPrayerById(prayerId),
    enabled: !!prayerId,
    initialData: () => {
      const all = queryClient.getQueryData<IPrayer[]>(["prayers", "allWithCategories", "v2"]);
      return all?.find((p) => p.id === prayerId);
    },
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    refetchOnMount: true,
    retry: 2,
  });
}
