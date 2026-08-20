import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IPrayer, IPrayerCategory } from "@/types/prayer";

export interface GetPrayersParams {
  categoryId?: string;
  search?: string;
}

export const prayerApiService = {
  /**
   * Obtém a lista de categorias da central de orações.
   */
  async getPrayerCategories(): Promise<IPrayerCategory[]> {
    const response = await apiClient.get<IPrayerCategory[]>("/prayers/categories");
    return (response.data || []).map((cat) => ({
      ...cat,
      image: resolveCdnUrl(cat.image),
    }));
  },

  /**
   * Obtém a lista de orações espíritas com suporte a filtro e busca.
   */
  async getPrayers(params?: GetPrayersParams): Promise<IPrayer[]> {
    const response = await apiClient.get<IPrayer[]>("/prayers", { params });
    return response.data || [];
  },

  /**
   * Obtém os detalhes de uma oração específica por ID.
   */
  async getPrayerById(id: string): Promise<IPrayer | null> {
    if (!id) return null;
    const response = await apiClient.get<IPrayer>(`/prayers/${id}`);
    return response.data || null;
  },
};
