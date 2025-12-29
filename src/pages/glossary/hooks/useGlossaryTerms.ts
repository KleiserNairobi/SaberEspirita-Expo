import { useState, useMemo } from "react";
import { MOCK_GLOSSARY } from "@/data/mockGlossary";
import { IGlossaryTerm, GlossaryCategory } from "@/types/glossary";
import { GlossaryFilterType } from "@/types/glossaryFilter";

export function useGlossaryTerms() {
  // Por enquanto retorna dados mock
  // Futuramente será substituído por React Query + Firestore
  return {
    data: MOCK_GLOSSARY,
    isLoading: false,
    error: null,
  };
}

export function useGlossaryTerm(id: string) {
  const term = MOCK_GLOSSARY.find((t) => t.id === id);

  return {
    data: term || null,
    isLoading: false,
    error: term ? null : "Termo não encontrado",
  };
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
