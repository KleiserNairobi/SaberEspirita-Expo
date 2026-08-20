import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IReflection } from "@/types/reflection";

export interface GetReflectionsParams {
  topic?: string;
  author?: string;
  search?: string;
}

export const reflectionApiService = {
  /**
   * Obtém a reflexão diária do dia de hoje.
   */
  async getTodayReflection(): Promise<IReflection | null> {
    const response = await apiClient.get<IReflection>("/reflections/today");
    if (!response.data) return null;
    return {
      ...response.data,
      imageUrl: resolveCdnUrl(response.data.imageUrl),
    };
  },

  /**
   * Obtém a lista de reflexões diárias com suporte a filtros.
   */
  async getReflections(params?: GetReflectionsParams): Promise<IReflection[]> {
    const response = await apiClient.get<IReflection[]>("/reflections", { params });
    return (response.data || []).map((reflection) => ({
      ...reflection,
      imageUrl: resolveCdnUrl(reflection.imageUrl),
    }));
  },

  /**
   * Obtém os detalhes de uma reflexão específica por ID.
   */
  async getReflectionById(id: string): Promise<IReflection | null> {
    if (!id) return null;
    const response = await apiClient.get<IReflection>(`/reflections/${id}`);
    if (!response.data) return null;
    return {
      ...response.data,
      imageUrl: resolveCdnUrl(response.data.imageUrl),
    };
  },
};
