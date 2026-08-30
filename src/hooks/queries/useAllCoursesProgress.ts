import { useQuery } from "@tanstack/react-query";
import { userActivityApiService } from "@/services/api/userActivityApiService";
import { useAuthStore } from "@/stores/authStore";
import { IUserCourseProgress } from "@/types/course";

export const COURSES_PROGRESS_KEYS = {
  list: (userId: string) => ["coursesProgressList", userId] as const,
  map: (userId: string) => ["allCoursesProgress", userId] as const,
};

/**
 * Hook centralizado para buscar a lista de progresso de cursos do usuário via API REST.
 * Garante deduplicação e reutilização em múltiplos componentes sem requisições repetidas.
 */
export function useCoursesProgressList() {
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useQuery({
    queryKey: COURSES_PROGRESS_KEYS.list(userId),
    queryFn: () => userActivityApiService.getCoursesProgress(),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias em memória
    refetchOnMount: true,
  });
}

/**
 * Hook para buscar o progresso mapeado por courseId (Record<string, IUserCourseProgress>).
 * Consome a mesma query base do React Query para evitar requisições duplicadas.
 */
export function useAllCoursesProgress() {
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useQuery({
    queryKey: COURSES_PROGRESS_KEYS.list(userId),
    queryFn: () => userActivityApiService.getCoursesProgress(),
    select: (list: IUserCourseProgress[]): Record<string, IUserCourseProgress> => {
      const progressMap: Record<string, IUserCourseProgress> = {};
      if (Array.isArray(list)) {
        list.forEach((item) => {
          if (item.courseId) {
            progressMap[item.courseId] = item;
          }
        });
      }
      return progressMap;
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnMount: true,
  });
}
