import { useQuery } from "@tanstack/react-query";
import { reflectionApiService } from "@/services/api/reflectionApiService";

export const REFLECTION_KEYS = {
  all: ["reflections", "v1"] as const,
  featured: ["reflections", "featured", "v1"] as const,
  today: ["reflections", "today", "v1"] as const,
  detail: (id: string) => ["reflections", "detail", id, "v1"] as const,
};

export function useReflections() {
  return useQuery({
    queryKey: REFLECTION_KEYS.all,
    queryFn: () => reflectionApiService.getReflections(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
  });
}

export function useTodayReflection() {
  return useQuery({
    queryKey: REFLECTION_KEYS.today,
    queryFn: () => reflectionApiService.getTodayReflection(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    refetchOnMount: true,
  });
}
