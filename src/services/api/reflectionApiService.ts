import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IReflection } from "@/types/reflection";

export interface GetReflectionsParams {
  topic?: string;
  author?: string;
  search?: string;
}

function parseTags(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  return [];
}

function formatReflection(reflection: IReflection): IReflection {
  return {
    ...reflection,
    imageUrl: resolveCdnUrl(reflection.imageUrl),
    tags: parseTags(reflection.tags),
  };
}

export const reflectionApiService = {
  /**
   * Obtém a reflexão diária do dia de hoje.
   */
  async getTodayReflection(): Promise<IReflection | null> {
    const response = await apiClient.get<IReflection>("/reflections/today");
    if (!response.data) return null;
    return formatReflection(response.data);
  },

  /**
   * Obtém a lista de reflexões diárias com suporte a filtros.
   */
  async getReflections(params?: GetReflectionsParams): Promise<IReflection[]> {
    const response = await apiClient.get<IReflection[]>("/reflections", { params });
    return (response.data || []).map(formatReflection);
  },

  /**
   * Obtém os detalhes de uma reflexão específica por ID.
   */
  async getReflectionById(id: string): Promise<IReflection | null> {
    if (!id) return null;
    const response = await apiClient.get<IReflection>(`/reflections/${id}`);
    if (!response.data) return null;
    return formatReflection(response.data);
  },
};
