import { useQuery } from "@tanstack/react-query";
import { getCourseAverageRating } from "@/services/firebase/courseFeedbackService";

export const RATING_KEYS = {
  detail: (id: string) => ["courseRating", id] as const,
};

export function useCourseRating(courseId: string) {
  return useQuery({
    queryKey: RATING_KEYS.detail(courseId),
    queryFn: () => getCourseAverageRating(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}
