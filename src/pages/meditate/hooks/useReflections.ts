import { useQuery } from "@tanstack/react-query";

import { getAllReflections } from "@/services/firebase/reflectionService";

export function useReflections() {
  return useQuery({
    queryKey: ["reflections"],
    queryFn: getAllReflections,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}
