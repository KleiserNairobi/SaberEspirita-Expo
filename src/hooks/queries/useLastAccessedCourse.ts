import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { ICourse, IUserCourseProgress, ILesson } from "@/types/course";
import { courseApiService } from "@/services/api/courseApiService";
import { lessonApiService } from "@/services/api/lessonApiService";
import { userActivityApiService } from "@/services/api/userActivityApiService";

export interface LastAccessedCourseData {
  course: ICourse;
  progress: IUserCourseProgress;
  nextLesson?: ILesson;
}

export function useLastAccessedCourse() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["lastAccessedCourse", user?.uid],
    queryFn: async (): Promise<LastAccessedCourseData | null> => {
      if (!user?.uid) return null;

      try {
        const courses = await courseApiService.getCourses();
        if (!courses || courses.length === 0) return null;

        // Buscar histórico de progresso do usuário via API REST
        const progresses = await userActivityApiService.getCoursesProgress();
        
        let targetCourse = courses[0];
        let targetProgress: IUserCourseProgress | null = null;

        if (progresses && progresses.length > 0) {
          const sortedProgresses = [...progresses].sort((a, b) => {
            const dateA = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
            const dateB = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
            return dateB - dateA;
          });

          const latestProgress = sortedProgresses[0];
          const foundCourse = courses.find((c) => c.id === latestProgress.courseId);
          if (foundCourse) {
            targetCourse = foundCourse;
            targetProgress = latestProgress;
          }
        }

        if (!targetProgress) {
          targetProgress = {
            userId: user.uid,
            courseId: targetCourse.id,
            completedLessons: [],
            exerciseResults: [],
            certificateEligible: false,
            certificateIssued: false,
            startedAt: new Date(),
            lastAccessedAt: new Date(),
          };
        }

        const lessons = await lessonApiService.getLessonsByCourseId(targetCourse.id);
        const completedIds = targetProgress.completedLessons || [];

        let nextLesson = lessons.find((l) => !completedIds.includes(l.id));
        if (!nextLesson && lessons.length > 0) {
          nextLesson = lessons[lessons.length - 1];
        }

        return {
          course: targetCourse,
          progress: targetProgress,
          nextLesson: nextLesson || lessons[0],
        };
      } catch (error) {
        console.warn("useLastAccessedCourse: erro ao carregar via REST API:", error);
        return null;
      }
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: true,
  });
}
