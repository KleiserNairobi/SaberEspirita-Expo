import { useQuery } from "@tanstack/react-query";
import { meditationApiService } from "@/services/api/meditationApiService";

export const MEDITATION_KEYS = {
  all: ["meditations", "v2"] as const,
  featured: ["meditations", "featured", "v2"] as const,
  detail: (id: string) => ["meditations", "detail", id, "v2"] as const,
};

export function useMeditations() {
  return useQuery({
    queryKey: MEDITATION_KEYS.all,
    queryFn: () => meditationApiService.getMeditations(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

export function useFeaturedMeditations() {
  return useQuery({
    queryKey: MEDITATION_KEYS.featured,
    queryFn: async () => {
      const meditations = await meditationApiService.getMeditations();
      const featured = meditations.filter((m) => m.featured);
      if (featured.length > 0) return featured;
      return meditations.slice(0, 10);
    },
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

export function useMeditation(id: string) {
  return useQuery({
    queryKey: MEDITATION_KEYS.detail(id),
    queryFn: () => meditationApiService.getMeditationById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
