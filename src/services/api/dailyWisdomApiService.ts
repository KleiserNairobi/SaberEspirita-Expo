import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { IDailyWisdom } from "@/types/dailyWisdom";

export interface GetDailyWisdomPagedResponse {
  content: IDailyWisdom[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

function formatDailyWisdom(item: IDailyWisdom): IDailyWisdom {
  if (!item) return item;
  return {
    ...item,
    content: item.content ? item.content.replace(/\\n/g, "\n") : item.content,
    openingQuote: item.openingQuote ? item.openingQuote.replace(/\\n/g, "\n") : item.openingQuote,
    imageUrl: item.imageUrl ? resolveCdnUrl(item.imageUrl) : undefined,
  };
}

export const dailyWisdomApiService = {
  /**
   * Obtém a mensagem de sabedoria do dia atual no fuso de Brasília (com fallbacks de dia do ano).
   */
  async getTodayWisdom(): Promise<IDailyWisdom | null> {
    try {
      const response = await apiClient.get<IDailyWisdom>("/daily-wisdom/today");
      if (!response.data) return null;
      return formatDailyWisdom(response.data);
    } catch (error) {
      console.warn("dailyWisdomApiService: Falha ao carregar sabedoria do dia:", error);
      return null;
    }
  },

  /**
   * Sorteia uma mensagem de sabedoria ativa (com suporte opcional a filtro por momento da alma).
   */
  async getRandomWisdom(moment?: string): Promise<IDailyWisdom | null> {
    try {
      const response = await apiClient.get<IDailyWisdom>("/daily-wisdom/random", {
        params: moment ? { moment } : undefined,
      });
      if (!response.data) return null;
      return formatDailyWisdom(response.data);
    } catch (error) {
      console.warn("dailyWisdomApiService: Falha ao sortear sabedoria:", error);
      return null;
    }
  },

  /**
   * Obtém as mensagens de sabedoria filtradas pelo Momento da Alma.
   */
  async getWisdomByMoment(moment?: string): Promise<IDailyWisdom[]> {
    try {
      const response = await apiClient.get<IDailyWisdom[]>("/daily-wisdom/by-moment", {
        params: moment ? { moment } : undefined,
      });
      return (response.data || []).map(formatDailyWisdom);
    } catch (error) {
      console.warn("dailyWisdomApiService: Falha ao buscar sabedoria por momento:", error);
      return [];
    }
  },

  /**
   * Obtém os detalhes de uma mensagem específica por ID.
   */
  async getWisdomById(id: string): Promise<IDailyWisdom | null> {
    if (!id) return null;
    try {
      const response = await apiClient.get<IDailyWisdom>(`/daily-wisdom/${id}`);
      if (!response.data) return null;
      return formatDailyWisdom(response.data);
    } catch (error) {
      console.warn(`dailyWisdomApiService: Falha ao buscar sabedoria ${id}:`, error);
      return null;
    }
  },

  /**
   * Obtém o acervo completo de sabedoria de forma paginada.
   */
  async getAllWisdom(page = 0, size = 20): Promise<GetDailyWisdomPagedResponse> {
    try {
      const response = await apiClient.get<GetDailyWisdomPagedResponse>("/daily-wisdom", {
        params: { page, size },
      });
      return {
        ...response.data,
        content: (response.data.content || []).map(formatDailyWisdom),
      };
    } catch (error) {
      console.warn("dailyWisdomApiService: Falha ao listar acervo paginado:", error);
      return { content: [], totalElements: 0, totalPages: 0, number: 0, size };
    }
  },
};
