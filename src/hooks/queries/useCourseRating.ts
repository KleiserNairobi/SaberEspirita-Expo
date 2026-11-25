import { useQuery } from "@tanstack/react-query";

import { courseApiService } from "@/services/api/courseApiService";

export const RATING_KEYS = {
  detail: (id: string) => ["courseRating", id] as const,
};
async function fetchCourseRating(courseId: string): Promise<number | null> {
  try {
    const feedbacks = await courseApiService.getCourseFeedbacks(courseId);
    const valid = (feedbacks || []).filter(
      (f) => typeof f?.rating === "number" && Number.isFinite(f.rating) && f.rating >= 1 && f.rating <= 5
    );
    if (valid.length > 0) {
      const total = valid.reduce((acc, f) => acc + f.rating, 0);
      const rawAvg = total / valid.length;
      return rawAvg >= 5 ? 5.0 : Math.min(4.9, Math.round(rawAvg * 10) / 10);
    }
  } catch (error) {
    console.warn(`useCourseRating(${courseId}): Erro ao buscar avaliacoes:`, error);
  }
  return null;
}

export function useCourseRating(courseId: string) {
  return useQuery({
    queryKey: RATING_KEYS.detail(courseId),
    queryFn: () => fetchCourseRating(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}
