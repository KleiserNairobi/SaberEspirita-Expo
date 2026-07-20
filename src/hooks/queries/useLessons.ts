import { useQuery } from "@tanstack/react-query";
import { getLessonsByCourseId, getLessonById } from "@/services/firebase/lessonService";

export const LESSONS_KEYS = {
  byCourse: (courseId: string) => ["lessons", "course", courseId] as const,
  detail: (courseId: string, lessonId: string) =>
    ["lessons", "detail", courseId, lessonId] as const,
};

export function useLessons(courseId: string) {
  return useQuery({
    queryKey: LESSONS_KEYS.byCourse(courseId),
    queryFn: () => getLessonsByCourseId(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

export function useLesson(courseId: string, lessonId: string) {
  return useQuery({
    queryKey: LESSONS_KEYS.detail(courseId, lessonId),
    queryFn: () => getLessonById(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}
