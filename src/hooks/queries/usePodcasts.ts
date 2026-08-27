import { useQuery } from "@tanstack/react-query";
import { podcastApiService } from "@/services/api/podcastApiService";

export const PODCAST_KEYS = {
  all: ["podcasts", "v1"] as const,
  featured: ["podcasts", "featured", "v1"] as const,
  detail: (id: string) => ["podcasts", "detail", id, "v1"] as const,
};

export function usePodcasts() {
  return useQuery({
    queryKey: PODCAST_KEYS.all,
    queryFn: () => podcastApiService.getPodcasts(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

export function useFeaturedPodcasts() {
  return useQuery({
    queryKey: PODCAST_KEYS.featured,
    queryFn: async () => {
      const podcasts = await podcastApiService.getPodcasts();
      return podcasts.filter((p) => p.featured);
    },
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

export function usePodcast(id: string) {
  return useQuery({
    queryKey: PODCAST_KEYS.detail(id),
    queryFn: () => podcastApiService.getPodcastById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
