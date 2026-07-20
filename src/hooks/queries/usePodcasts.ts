import { useQuery } from "@tanstack/react-query";

import {
  getFeaturedPodcasts,
  getPodcastById,
  getPodcasts,
} from "@/services/firebase/podcastService";

export const PODCAST_KEYS = {
  all: ["podcasts", "v1"] as const,
  featured: ["podcasts", "featured", "v1"] as const,
  detail: (id: string) => ["podcasts", "detail", id, "v1"] as const,
};

export function usePodcasts() {
  return useQuery({
    queryKey: PODCAST_KEYS.all,
    queryFn: getPodcasts,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

export function useFeaturedPodcasts() {
  return useQuery({
    queryKey: PODCAST_KEYS.featured,
    queryFn: getFeaturedPodcasts,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

export function usePodcast(id: string) {
  return useQuery({
    queryKey: PODCAST_KEYS.detail(id),
    queryFn: () => getPodcastById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}
