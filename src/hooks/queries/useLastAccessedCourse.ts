import { useQuery, useQueryClient } from "@tanstack/react-query";

import { courseApiService } from "@/services/api/courseApiService";
import { lessonApiService } from "@/services/api/lessonApiService";
import { userActivityApiService } from "@/services/api/userActivityApiService";
import { useAuthStore } from "@/stores/authStore";
import { ICourse, ILesson, IUserCourseProgress } from "@/types/course";

import { COURSES_KEYS } from "./useCourses";

export interface LastAccessedCourseData {
  course: ICourse;
  progress: IUserCourseProgress;
  nextLesson?: ILesson;
}

export function useLastAccessedCourse() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = user?.uid || "";

  return useQuery({
    queryKey: ["lastAccessedCourse", userId],
    queryFn: async (): Promise<LastAccessedCourseData | null> => {
      if (!userId) return null;

      try {
        // Reutiliza cache de cursos se já disponível, ou busca apenas 1 vez
        const courses = await queryClient.ensureQueryData({
          queryKey: COURSES_KEYS.all,
          queryFn: () => courseApiService.getCourses(),
          staleTime: 1000 * 60 * 5,
        });
        if (!courses || courses.length === 0) return null;

        // Busca o progresso fresco do usuário via API REST
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
            userId,
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
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: true,
  });
}
