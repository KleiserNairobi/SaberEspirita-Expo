import { useQuery } from "@tanstack/react-query";
import {
  getExercisesByLessonId,
  getExercisesByCourseId,
} from "@/services/firebase/exerciseService";

export const EXERCISES_KEYS = {
  byLesson: (lessonId: string) => ["exercises", "lesson", lessonId] as const,
};

export function useExercises(lessonId: string) {
  return useQuery({
    queryKey: EXERCISES_KEYS.byLesson(lessonId),
    queryFn: () => getExercisesByLessonId(lessonId),
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

export function useCourseExercises(courseId: string) {
  return useQuery({
    queryKey: ["exercises", "course", courseId],
    queryFn: () => getExercisesByCourseId(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}
