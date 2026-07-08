import {
  getFeaturedMeditations,
  getMeditationById,
  getMeditations,
} from "@/services/firebase/meditationService";
import { useQuery } from "@tanstack/react-query";

export const MEDITATION_KEYS = {
  all: ["meditations", "v2"] as const,
  featured: ["meditations", "featured", "v2"] as const,
  detail: (id: string) => ["meditations", "detail", id, "v2"] as const,
};

export function useMeditations() {
  return useQuery({
    queryKey: MEDITATION_KEYS.all,
    queryFn: getMeditations,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

export function useFeaturedMeditations() {
  return useQuery({
    queryKey: MEDITATION_KEYS.featured,
    // Usa a query direta no Firestore (where featured == true) ao invés de buscar tudo e filtrar no cliente
    queryFn: getFeaturedMeditations,
    staleTime: 1000 * 60 * 30, // 30 minutos — conteúdo raramente muda
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

export function useMeditation(id: string) {
  return useQuery({
    queryKey: MEDITATION_KEYS.detail(id),
    queryFn: () => getMeditationById(id),
    // `enabled` é falso quando o id é vazio (store já tem o objeto em memória)
    enabled: !!id,
    staleTime: 1000 * 60 * 5,   // dados frescos por 5 min — sem re-fetch durante a sessão
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,       // confia no cache MMKV persistido entre sessões
    refetchOnReconnect: true,
  });
}
