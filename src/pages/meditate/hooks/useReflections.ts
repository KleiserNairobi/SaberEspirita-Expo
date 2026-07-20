import { useQuery } from "@tanstack/react-query";

import { getAllReflections } from "@/services/firebase/reflectionService";

export const REFLECTION_KEYS = {
  all: ["reflections", "v1"] as const,
  featured: ["reflections", "featured", "v1"] as const,
  detail: (id: string) => ["reflections", "detail", id, "v1"] as const,
};

export function useReflections() {
  return useQuery({
    queryKey: REFLECTION_KEYS.all,
    queryFn: getAllReflections,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (textos estáticos)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
  });
}
