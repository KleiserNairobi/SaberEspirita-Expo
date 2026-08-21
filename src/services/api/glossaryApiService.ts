import apiClient from "./apiClient";
import { IGlossaryTerm } from "@/types/glossary";

export interface GetGlossaryParams {
  category?: string;
  search?: string;
}

function normalizeArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback se não for JSON válido
      }
    }
    return value
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeGlossaryTerm(raw: any): IGlossaryTerm {
  return {
    ...raw,
    term: raw.term || "",
    definition: raw.definition || "",
    category: raw.category || "Doutrina Básica",
    references: normalizeArray(raw.references),
    relatedTerms: normalizeArray(raw.relatedTerms),
    synonyms: normalizeArray(raw.synonyms),
  };
}

export const glossaryApiService = {
  /**
   * Obtém a lista de termos do glossário com suporte a busca e categoria.
   */
  async getGlossaryTerms(params?: GetGlossaryParams): Promise<IGlossaryTerm[]> {
    const response = await apiClient.get<any[]>("/glossary", { params });
    const list = response.data || [];
    return list.map(normalizeGlossaryTerm);
  },

  /**
   * Obtém os detalhes de um termo específico por ID.
   */
  async getGlossaryTermById(id: string): Promise<IGlossaryTerm | null> {
    if (!id) return null;
    const response = await apiClient.get<any>(`/glossary/${id}`);
    if (!response.data) return null;
    return normalizeGlossaryTerm(response.data);
  },
};
