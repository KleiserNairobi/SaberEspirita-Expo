import { useQuery } from "@tanstack/react-query";
import { reflectionApiService } from "@/services/api/reflectionApiService";
import { IReflection } from "@/types/reflection";
import { REFLECTION_KEYS } from "./useReflections";

export function useFeaturedReflections() {
  return useQuery<IReflection[]>({
    queryKey: REFLECTION_KEYS.featured,
    queryFn: async () => {
      const reflections = await reflectionApiService.getReflections();
      return reflections.filter((r) => r.featured);
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (conteúdo raramente muda)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
  });
}
