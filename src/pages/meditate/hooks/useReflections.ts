import { useQuery, useQueryClient } from "@tanstack/react-query";
import { reflectionApiService } from "@/services/api/reflectionApiService";
import { IReflection } from "@/types/reflection";

export const REFLECTION_KEYS = {
  all: ["reflections", "v1"] as const,
  featured: ["reflections", "featured", "v1"] as const,
  today: ["reflections", "today", "v1"] as const,
  detail: (id: string) => ["reflections", "detail", id, "v1"] as const,
};

export function useReflection(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: REFLECTION_KEYS.detail(id),
    queryFn: () => reflectionApiService.getReflectionById(id),
    enabled: !!id,
    initialData: () => {
      const featured = queryClient.getQueryData<IReflection[]>(REFLECTION_KEYS.featured);
      const foundFeatured = featured?.find((r) => r.id === id);
      if (foundFeatured) return foundFeatured;

      const all = queryClient.getQueryData<IReflection[]>(REFLECTION_KEYS.all);
      const foundAll = all?.find((r) => r.id === id);
      if (foundAll) return foundAll;

      return undefined;
    },
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    retry: 2,
  });
}

export function useReflections() {
  return useQuery({
    queryKey: REFLECTION_KEYS.all,
    queryFn: () => reflectionApiService.getReflections(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 2,
  });
}

export function useTodayReflection() {
  return useQuery({
    queryKey: REFLECTION_KEYS.today,
    queryFn: () => reflectionApiService.getTodayReflection(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 2,
  });
}
