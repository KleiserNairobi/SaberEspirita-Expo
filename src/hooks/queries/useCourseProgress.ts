import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import { IUserCourseProgress } from "@/types/course";
import { touchCourseAccess } from "@/services/firebase/progressService";

export const COURSE_PROGRESS_KEYS = {
  byUserAndCourse: (userId: string, courseId: string) =>
    ["courseProgress", userId, courseId] as const,
};

/**
 * Hook para buscar o progresso do usuário em um curso específico
 */
export function useCourseProgress(courseId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user?.uid || "", courseId),
    queryFn: async (): Promise<IUserCourseProgress | null> => {
      if (!user?.uid || !courseId) return null;

      const progressRef = doc(db, "users", user.uid, "courseProgress", courseId);
      const progressSnap = await getDoc(progressRef);

      if (!progressSnap.exists()) {
        // Usuário ainda não iniciou o curso
        return null;
      }

      return {
        ...progressSnap.data(),
        startedAt: progressSnap.data().startedAt?.toDate(),
        lastAccessedAt: progressSnap.data().lastAccessedAt?.toDate(),
        completedAt: progressSnap.data().completedAt?.toDate(),
        certificateIssuedAt: progressSnap.data().certificateIssuedAt?.toDate(),
      } as IUserCourseProgress;
    },
    enabled: !!user?.uid && !!courseId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (invalidação manual consistente nas modificações)
  });
}

interface TouchCourseAccessParams {
  courseId: string;
  lessonId?: string;
  userId?: string;
}

/**
 * Hook mutador para registrar acesso a um curso, garantindo invalidação de cache
 */
export function useTouchCourseAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, lessonId, userId }: TouchCourseAccessParams) => {
      await touchCourseAccess(courseId, { lessonId, userId });
    },
    onSuccess: (_, variables) => {
      const { userId, courseId } = variables;
      if (userId) {
        // Invalida a query do último curso acessado
        queryClient.invalidateQueries({
          queryKey: ["lastAccessedCourse", userId],
        });
        // Invalida o progresso de todos os cursos
        queryClient.invalidateQueries({
          queryKey: ["allCoursesProgress", userId],
        });
        // Invalida o progresso do curso individual modificado
        queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(userId, courseId),
        });
      }
    },
  });
}

