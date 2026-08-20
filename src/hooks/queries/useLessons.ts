import { useQuery } from "@tanstack/react-query";

import { lessonApiService } from "@/services/api/lessonApiService";
import { ILesson } from "@/types/course";

export const LESSONS_KEYS = {
  byCourse: (courseId: string) => ["lessons", "course", courseId] as const,
  detail: (courseId: string, lessonId: string) =>
    ["lessons", "detail", courseId, lessonId] as const,
};

async function fetchLessonsByCourse(courseId: string): Promise<ILesson[]> {
  try {
    const lessons = await lessonApiService.getLessonsByCourseId(courseId);
    if (lessons && lessons.length > 0) return lessons;
  } catch (error) {
    console.warn(`useLessons(${courseId}): Erro ao buscar liçoes:`, error);
  }
  return [];
}

async function fetchLessonById(
  courseId: string,
  lessonId: string
): Promise<ILesson | null> {
  try {
    const lesson = await lessonApiService.getLessonById(lessonId);
    if (lesson) return lesson;
  } catch (error) {
    console.warn(`useLesson(${lessonId}): Erro ao buscar lição:`, error);
  }
  return null;
}

export function useLessons(courseId: string) {
  return useQuery({
    queryKey: LESSONS_KEYS.byCourse(courseId),
    queryFn: () => fetchLessonsByCourse(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnReconnect: true,
  });
}

export function useLesson(courseId: string, lessonId: string) {
  return useQuery({
    queryKey: LESSONS_KEYS.detail(courseId, lessonId),
    queryFn: () => fetchLessonById(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnReconnect: true,
  });
}
