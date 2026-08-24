import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IPrayer, IPrayerCategory } from "@/types/prayer";

export interface GetPrayersParams {
  categoryId?: string;
  search?: string;
}

function normalizeCategories(rawCategories: any): string[] {
  if (!rawCategories) return [];
  if (Array.isArray(rawCategories)) return rawCategories;
  if (typeof rawCategories === "string") {
    const trimmed = rawCategories.trim();
    if (!trimmed || trimmed === "[]") return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback em caso de erro no parse
      }
    }
    return [trimmed];
  }
  return [];
}

function normalizePrayer(prayer: IPrayer): IPrayer {
  if (!prayer) return prayer;
  return {
    ...prayer,
    categories: normalizeCategories(prayer.categories),
  };
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
    const list = response.data || [];
    return list.map(normalizePrayer);
  },

  /**
   * Obtém a lista de orações em alta (Top 10) por período (day, week, total).
   */
  async getTrendingPrayers(period: "day" | "week" | "total" = "day"): Promise<IPrayer[]> {
    const response = await apiClient.get<IPrayer[]>("/prayers/trending", {
      params: { period },
    });
    const list = response.data || [];
    return list.map(normalizePrayer);
  },

  /**
   * Obtém os detalhes de uma oração específica por ID.
   */
  async getPrayerById(id: string): Promise<IPrayer | null> {
    if (!id) return null;
    const response = await apiClient.get<IPrayer>(`/prayers/${id}`);
    return response.data ? normalizePrayer(response.data) : null;
  },
};
