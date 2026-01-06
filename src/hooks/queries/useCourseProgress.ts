import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import { IUserCourseProgress } from "@/types/course";

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
  });
}
