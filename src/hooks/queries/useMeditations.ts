import {
  getFeaturedMeditations,
  getMeditationById,
  getMeditations,
} from "@/services/firebase/meditationService";
import { useQuery } from "@tanstack/react-query";

export const MEDITATION_KEYS = {
  all: ["meditations"] as const,
  featured: ["meditations", "featured"] as const,
  detail: (id: string) => ["meditations", "detail", id] as const,
};

export function useMeditations() {
  return useQuery({
    queryKey: MEDITATION_KEYS.all,
    queryFn: getMeditations,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas - Médio raramente muda
    gcTime: 1000 * 60 * 60 * 24 * 7, // Mantem cache por 7 dias
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

export function useFeaturedMeditations() {
  return useQuery({
    queryKey: MEDITATION_KEYS.featured,
    queryFn: getFeaturedMeditations,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

export function useMeditation(id: string) {
  return useQuery({
    queryKey: MEDITATION_KEYS.detail(id),
    queryFn: () => getMeditationById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}
