import { useQuery } from "@tanstack/react-query";
import { courseApiService } from "@/services/api/courseApiService";
import { getCourseAverageRating as getCourseAverageRatingFirestore } from "@/services/firebase/courseFeedbackService";

export const RATING_KEYS = {
  detail: (id: string) => ["courseRating", id] as const,
};

async function fetchCourseRating(courseId: string): Promise<number | null> {
  try {
    const feedbacks = await courseApiService.getCourseFeedbacks(courseId);
    if (feedbacks && feedbacks.length > 0) {
      const total = feedbacks.reduce((acc, f) => acc + f.rating, 0);
      return Math.floor((total / feedbacks.length) * 10) / 10;
    }
  } catch (error) {
    console.warn(`useCourseRating(${courseId}): Falha na API REST, utilizando fallback do Firestore:`, error);
  }
  return await getCourseAverageRatingFirestore(courseId);
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

