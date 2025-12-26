import { useQuery } from "@tanstack/react-query";

import { getFeaturedReflections } from "@/data/reflections.mock";
import { IReflection } from "@/types/reflection";

export function useFeaturedReflections() {
  return useQuery<IReflection[]>({
    queryKey: ["reflections", "featured"],
    queryFn: async () => {
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getFeaturedReflections();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
