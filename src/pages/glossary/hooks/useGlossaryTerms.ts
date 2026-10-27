import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { GlossaryFilterType } from "@/types/glossaryFilter";
import { glossaryApiService } from "@/services/api/glossaryApiService";

export const GLOSSARY_KEYS = {
  all: ["glossary", "v1"] as const,
  term: (id: string) => ["glossary", "term", id, "v1"] as const,
  byCategory: (category: string) => ["glossary", "category", category, "v1"] as const,
};

// Collator instanciado uma única vez no nível de módulo para performance máxima (evita recriação JNI no Hermes)
const ptCollator = new Intl.Collator("pt-BR", { sensitivity: "base" });

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function useGlossaryTerms() {
  return useQuery({
    queryKey: GLOSSARY_KEYS.all,
    queryFn: () => glossaryApiService.getGlossaryTerms(),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas de cache fresco
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false, // Abre instantaneamente em 0ms do cache local
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}

export function useGlossaryTerm(id: string) {
  return useQuery({
    queryKey: GLOSSARY_KEYS.term(id),
    queryFn: () => glossaryApiService.getGlossaryTermById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnMount: false,
  });
}

export function useFilteredGlossaryTerms(
  searchQuery: string,
  filterType: GlossaryFilterType,
  favoriteIds: string[] = []
) {
  const { data: allTerms } = useGlossaryTerms();

  // 1. Pré-ordenação memorizada ultrarrápida: < 1ms usando o ptCollator estático
  const sortedAllTerms = useMemo(() => {
    if (!allTerms || allTerms.length === 0) return [];
    return [...allTerms].sort((a, b) => ptCollator.compare(a.term || "", b.term || ""));
  }, [allTerms]);

  // Set O(1) para favoritos
  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  // 2. Filtragem: busca geral irrestrita quando houver query; caso contrário filtra pela categoria ativa
  const filteredTerms = useMemo(() => {
    if (sortedAllTerms.length === 0) return [];

    const query = searchQuery.trim();

    // REGRA: A busca é SEMPRE GERAL em todo o acervo, focada estritamente no título do termo (e sinônimos)
    if (query) {
      const normalizedQuery = normalizeText(query);

      const matches = sortedAllTerms.filter((term) => {
        if (!term.term) return false;
        if (normalizeText(term.term).includes(normalizedQuery)) return true;

        if (Array.isArray(term.synonyms)) {
          return term.synonyms.some((syn) =>
            typeof syn === "string" && normalizeText(syn).includes(normalizedQuery)
          );
        }
        return false;
      });

      // Prioriza termos cujo título COMEÇA com a palavra pesquisada (ex: "Reencarnação" antes de "Equipe Reencarnatória")
      return matches.sort((a, b) => {
        const normA = normalizeText(a.term || "");
        const normB = normalizeText(b.term || "");
        const startsA = normA.startsWith(normalizedQuery);
        const startsB = normB.startsWith(normalizedQuery);

        if (startsA && !startsB) return -1;
        if (!startsA && startsB) return 1;

        return ptCollator.compare(a.term || "", b.term || "");
      });
    }

    // Sem busca digitada: exibe termos da categoria selecionada
    if (filterType === "FAVORITES") {
      return sortedAllTerms.filter((term) => favoritesSet.has(term.id));
    }

    if (filterType === "ALL") {
      return sortedAllTerms;
    }

    return sortedAllTerms.filter((term) => term.category === filterType);
  }, [sortedAllTerms, searchQuery, filterType, favoritesSet]);

  return filteredTerms;
}
