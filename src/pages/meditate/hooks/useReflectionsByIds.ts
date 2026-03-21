import { useQuery } from "@tanstack/react-query";

import { getReflectionsByIds } from "@/services/firebase/reflectionService";

export function useReflectionsByIds(reflectionIds: string[]) {
  return useQuery({
    queryKey: ["reflections", "byIds", reflectionIds],
    queryFn: () => getReflectionsByIds(reflectionIds),
    enabled: reflectionIds.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}
