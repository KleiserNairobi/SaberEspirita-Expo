import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IMeditation, IMeditationCategory } from "@/types/meditate";

export interface GetMeditationsParams {
  categoryId?: string;
  search?: string;
}

export const meditationApiService = {
  /**
   * Obtém a lista de categorias de meditação.
   */
  async getMeditationCategories(): Promise<IMeditationCategory[]> {
    const response = await apiClient.get<IMeditationCategory[]>("/meditations/categories");
    return (response.data || []).map((cat) => ({
      ...cat,
      image: resolveCdnUrl(cat.image),
    }));
  },

  /**
   * Obtém a lista de meditações guiadas com suporte a filtros.
   */
  async getMeditations(params?: GetMeditationsParams): Promise<IMeditation[]> {
    const response = await apiClient.get<IMeditation[]>("/meditations", { params });
    return (response.data || []).map((meditation) => ({
      ...meditation,
      audioUrl: resolveCdnUrl(meditation.audioUrl) || meditation.audioUrl,
      imageUrl: resolveCdnUrl(meditation.imageUrl),
    }));
  },

  /**
   * Obtém uma meditação específica por ID.
   */
  async getMeditationById(id: string): Promise<IMeditation | null> {
    if (!id) return null;
    const response = await apiClient.get<IMeditation>(`/meditations/${id}`);
    if (!response.data) return null;
    return {
      ...response.data,
      audioUrl: resolveCdnUrl(response.data.audioUrl) || response.data.audioUrl,
      imageUrl: resolveCdnUrl(response.data.imageUrl),
    };
  },
};
