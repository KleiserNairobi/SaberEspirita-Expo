import apiClient from "./apiClient";
import { IGlossaryTerm } from "@/types/glossary";

export interface GetGlossaryParams {
  category?: string;
  search?: string;
}

export const glossaryApiService = {
  /**
   * Obtém a lista de termos do glossário com suporte a busca e categoria.
   */
  async getGlossaryTerms(params?: GetGlossaryParams): Promise<IGlossaryTerm[]> {
    const response = await apiClient.get<IGlossaryTerm[]>("/glossary", { params });
    return response.data || [];
  },

  /**
   * Obtém os detalhes de um termo específico por ID.
   */
  async getGlossaryTermById(id: string): Promise<IGlossaryTerm | null> {
    if (!id) return null;
    const response = await apiClient.get<IGlossaryTerm>(`/glossary/${id}`);
    return response.data || null;
  },
};
