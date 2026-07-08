import {
  getFeaturedPodcasts,
  getPodcastById,
  getPodcasts,
} from "@/services/firebase/podcastService";
import { useQuery } from "@tanstack/react-query";

export const PODCAST_KEYS = {
  all: ["podcasts", "v1"] as const,
  featured: ["podcasts", "featured", "v1"] as const,
  detail: (id: string) => ["podcasts", "detail", id, "v1"] as const,
};

export function usePodcasts() {
  return useQuery({
    queryKey: PODCAST_KEYS.all,
    queryFn: getPodcasts,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

export function useFeaturedPodcasts() {
  return useQuery({
    queryKey: PODCAST_KEYS.featured,
    // Usa a query direta no Firestore (where featured == true) ao invés de buscar tudo e filtrar no cliente
    queryFn: getFeaturedPodcasts,
    staleTime: 1000 * 60 * 30, // 30 minutos — conteúdo raramente muda
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

export function usePodcast(id: string) {
  return useQuery({
    queryKey: PODCAST_KEYS.detail(id),
    queryFn: () => getPodcastById(id),
    // `enabled` é falso quando o id é vazio (store já tem o objeto em memória)
    enabled: !!id,
    staleTime: 1000 * 60 * 5,    // dados frescos por 5 min — sem re-fetch durante a sessão
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,        // confia no cache MMKV persistido entre sessões
    refetchOnReconnect: true,
  });
}
