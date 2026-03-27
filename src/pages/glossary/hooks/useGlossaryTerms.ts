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
      filtered = filtered.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          term.synonyms?.some((syn) => syn.toLowerCase().includes(query))
      );
    }

    // Ordenação alfabética
    return filtered.sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  }, [allTerms, searchQuery, filterType, favoriteIds]);

  return filteredTerms;
}
