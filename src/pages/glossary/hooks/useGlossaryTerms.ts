import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { GlossaryFilterType } from "@/types/glossaryFilter";
import { glossaryApiService } from "@/services/api/glossaryApiService";

export const GLOSSARY_KEYS = {
  all: ["glossary", "v1"] as const,
  term: (id: string) => ["glossary", "term", id, "v1"] as const,
  byCategory: (category: string) => ["glossary", "category", category, "v1"] as const,
};

export function useGlossaryTerms() {
  return useQuery({
    queryKey: GLOSSARY_KEYS.all,
    queryFn: () => glossaryApiService.getGlossaryTerms(),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

export function useGlossaryTerm(id: string) {
  return useQuery({
    queryKey: GLOSSARY_KEYS.term(id),
    queryFn: () => glossaryApiService.getGlossaryTermById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

export function useFilteredGlossaryTerms(
  searchQuery: string,
  filterType: GlossaryFilterType,
  favoriteIds: string[] = []
) {
  const { data: allTerms } = useGlossaryTerms();

  const filteredTerms = useMemo(() => {
    let filtered = allTerms || [];

    // Aplicar filtro de categoria ou favoritos
    if (filterType === "FAVORITES") {
      filtered = filtered.filter((term) => favoriteIds.includes(term.id));
    } else if (filterType !== "ALL") {
      // É uma categoria específica
      filtered = filtered.filter((term) => term.category === filterType);
    }

    // Filtro de busca (Search Query) atua dentro do que sobrou do filtro principal
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      // Busca em termo, definição e sinônimos
      filtered = filtered.filter((term) => {
        const termMatch = term.term?.toLowerCase().includes(query) ?? false;
        const defMatch = term.definition?.toLowerCase().includes(query) ?? false;
        const syns = Array.isArray(term.synonyms)
          ? term.synonyms
          : typeof term.synonyms === "string"
          ? [term.synonyms]
          : [];
        const synMatch = syns.some((syn) =>
          typeof syn === "string" ? syn.toLowerCase().includes(query) : false
        );
        return termMatch || defMatch || synMatch;
      });
    }

    // Ordenação alfabética
    return filtered.sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  }, [allTerms, searchQuery, filterType, favoriteIds]);

  return filteredTerms;
}
