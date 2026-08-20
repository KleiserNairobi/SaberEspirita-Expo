import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IPodcast } from "@/types/podcast";

export interface GetPodcastsParams {
  search?: string;
}

export const podcastApiService = {
  /**
   * Obtém a lista de episódios de podcasts espíritas.
   */
  async getPodcasts(params?: GetPodcastsParams): Promise<IPodcast[]> {
    const response = await apiClient.get<IPodcast[]>("/podcasts", { params });
    return (response.data || []).map((podcast) => ({
      ...podcast,
      audioUrl: resolveCdnUrl(podcast.audioUrl) || podcast.audioUrl,
      imageUrl: resolveCdnUrl(podcast.imageUrl),
    }));
  },

  /**
   * Obtém os detalhes de um podcast por ID.
   */
  async getPodcastById(id: string): Promise<IPodcast | null> {
    if (!id) return null;
    const response = await apiClient.get<IPodcast>(`/podcasts/${id}`);
    if (!response.data) return null;
    return {
      ...response.data,
      audioUrl: resolveCdnUrl(response.data.audioUrl) || response.data.audioUrl,
      imageUrl: resolveCdnUrl(response.data.imageUrl),
    };
  },
};
