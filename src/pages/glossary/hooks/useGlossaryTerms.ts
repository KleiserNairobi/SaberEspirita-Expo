import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { IGlossaryTerm } from "@/types/glossary";
import { GlossaryFilterType } from "@/types/glossaryFilter";
import {
  getAllGlossaryTerms,
  getGlossaryTermById,
} from "@/services/firebase/glossaryService";

export function useGlossaryTerms() {
  return useQuery({
    queryKey: ["glossary", "all"],
    queryFn: getAllGlossaryTerms,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useGlossaryTerm(id: string) {
  return useQuery({
    queryKey: ["glossary", "term", id],
    queryFn: () => getGlossaryTermById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
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

    // Aplicar filtro de favoritos
    if (filterType === "FAVORITES") {
      filtered = filtered.filter((term) => favoriteIds.includes(term.id));
    }

    // Filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      // Se o filtro for "Por Categoria", busca apenas na categoria
      if (filterType === "BY_CATEGORY") {
        filtered = filtered.filter((term) => term.category.toLowerCase().includes(query));
      } else {
        // Busca em termo, definição e sinônimos
        filtered = filtered.filter(
          (term) =>
            term.term.toLowerCase().includes(query) ||
            term.definition.toLowerCase().includes(query) ||
            term.synonyms?.some((syn) => syn.toLowerCase().includes(query))
        );
      }
    }

    // Ordenação alfabética
    return filtered.sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  }, [allTerms, searchQuery, filterType, favoriteIds]);

  return filteredTerms;
}
