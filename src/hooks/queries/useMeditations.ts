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
    queryFn: async () => {
      // Força a busca de todas para garantir que pegamos as meditações novas 
      // que sabemos que existem e estão retornando na listagem completa.
      const all = await getMeditations();
      
      const featured = all
        .filter((m) => m.featured === true)
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          // As mais novas (Saber Espírita) primeiro
          return dateB - dateA;
        });

      console.log(`[useFeaturedMeditations] Encontradas ${featured.length} meditações em destaque.`);
      return featured;
    },
    staleTime: 0, // Força revalidação imediata
    gcTime: 1000 * 60 * 10,
    refetchOnMount: "always",
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
