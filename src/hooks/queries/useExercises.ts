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
  });
}

export function useCourseExercises(courseId: string) {
  return useQuery({
    queryKey: ["exercises", "course", courseId],
    queryFn: () => getExercisesByCourseId(courseId),
    enabled: !!courseId,
  });
}
