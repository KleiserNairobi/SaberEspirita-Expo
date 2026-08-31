import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userActivityApiService } from "@/services/api/userActivityApiService";
import { useAuthStore } from "@/stores/authStore";

export const COURSE_PROGRESS_KEYS = {
  byUserAndCourse: (userId: string, courseId: string) =>
    ["courseProgress", userId, courseId] as const,
  all: (userId: string) => ["coursesProgressList", userId] as const,
};

/**
 * Hook para buscar o progresso do usuário em um curso específico via API REST.
 */
export function useCourseProgress(courseId: string) {
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useQuery({
    queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(userId, courseId),
    queryFn: () => userActivityApiService.getCourseProgress(courseId),
    enabled: !!userId && !!courseId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias em memória
    refetchOnMount: true,
  });
}

interface TouchCourseAccessParams {
  courseId: string;
  lessonId?: string;
  userId?: string;
}

/**
 * Hook mutador para registrar acesso a um curso/aula.
 */
export function useTouchCourseAccess() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useMutation({
    mutationFn: async ({ courseId, lessonId }: TouchCourseAccessParams) => {
      // O mero acesso à aula NÃO deve marcar a lição como concluída no backend.
      // A lição só é concluída via useCompleteLesson() / handleFinish no botão de finalizar.
      return null;
    },
    onSuccess: (_, variables) => {
      const targetUserId = variables.userId || userId;
      if (targetUserId) {
        queryClient.invalidateQueries({
          queryKey: ["lastAccessedCourse"],
        });
        queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(
            targetUserId,
            variables.courseId
          ),
        });
      }
    },
  });
}

/**
 * Hook de mutação para marcar uma lição como concluída via API REST.
 */
export function useCompleteLesson() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useMutation({
    mutationFn: ({ courseId, lessonId }: { courseId: string; lessonId: string }) =>
      userActivityApiService.completeLesson(courseId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(userId, variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: ["coursesProgressList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allCoursesProgress"],
      });
      queryClient.invalidateQueries({
        queryKey: ["lastAccessedCourse"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-activity"],
      });
    },
  });
}
