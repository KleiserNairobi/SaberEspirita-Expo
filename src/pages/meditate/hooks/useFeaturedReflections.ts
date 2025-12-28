import { useQuery } from "@tanstack/react-query";

import { getFeaturedReflections } from "@/services/firebase/reflectionService";
import { IReflection } from "@/types/reflection";

export function useFeaturedReflections() {
  return useQuery<IReflection[]>({
    queryKey: ["reflections", "featured"],
    queryFn: getFeaturedReflections,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
