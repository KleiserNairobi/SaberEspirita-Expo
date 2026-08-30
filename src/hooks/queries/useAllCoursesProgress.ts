import { useQuery } from "@tanstack/react-query";
import { userActivityApiService } from "@/services/api/userActivityApiService";
import { useAuthStore } from "@/stores/authStore";
import { IUserCourseProgress } from "@/types/course";

/**
 * Hook para buscar o progresso de todos os cursos do usuário via API REST.
 */
export function useAllCoursesProgress() {
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useQuery({
    queryKey: ["allCoursesProgress", userId],
    queryFn: async (): Promise<Record<string, IUserCourseProgress>> => {
      if (!userId) return {};

      const list = await userActivityApiService.getCoursesProgress();
      const progressMap: Record<string, IUserCourseProgress> = {};

      list.forEach((item) => {
        if (item.courseId) {
          progressMap[item.courseId] = item;
        }
      });

      return progressMap;
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias em memória
    refetchOnMount: true,
  });
}
