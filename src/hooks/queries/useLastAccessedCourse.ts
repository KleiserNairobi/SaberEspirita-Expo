import { useQuery, useQueryClient } from "@tanstack/react-query";

import { courseApiService } from "@/services/api/courseApiService";
import { lessonApiService } from "@/services/api/lessonApiService";
import { userActivityApiService } from "@/services/api/userActivityApiService";
import { useAuthStore } from "@/stores/authStore";
import { ICourse, ILesson, IUserCourseProgress } from "@/types/course";
import { getLastCourseAccess } from "@/utils/lessonProgressStorage";

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

        // Busca também o último acesso registrado localmente no dispositivo (MMKV)
        const localLastAccess = getLastCourseAccess(userId);

        let targetCourse: ICourse | null = null;
        let targetProgress: IUserCourseProgress | null = null;

        let latestBackendTime = 0;
        let latestBackendProgress: IUserCourseProgress | null = null;

        if (progresses && progresses.length > 0) {
          const sortedProgresses = [...progresses].sort((a, b) => {
            const dateA = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
            const dateB = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
            return dateB - dateA;
          });
          latestBackendProgress = sortedProgresses[0];
          latestBackendTime = latestBackendProgress.lastAccessedAt
            ? new Date(latestBackendProgress.lastAccessedAt).getTime()
            : 0;
        }

        const localTime = localLastAccess?.updatedAt || 0;

        // Se o acesso local for mais recente que o backend (ex: começou uma aula mas não concluiu ainda)
        if (localLastAccess && localTime > latestBackendTime) {
          const localCourse = courses.find((c) => c.id === localLastAccess.courseId);
          if (localCourse) {
            targetCourse = localCourse;
            // Verifica se já existia algum progresso no backend para este curso
            const existingProg = progresses.find((p) => p.courseId === localCourse.id);
            if (existingProg) {
              targetProgress = {
                ...existingProg,
                lastAccessedAt: new Date(localTime),
              };
            } else {
              targetProgress = {
                userId,
                courseId: localCourse.id,
                completedLessons: [],
                exerciseResults: [],
                certificateEligible: false,
                certificateIssued: false,
                startedAt: new Date(localTime),
                lastAccessedAt: new Date(localTime),
              };
            }
          }
        }

        // Se não definiu pelo local, define pelo backend mais recente
        if (!targetCourse && latestBackendProgress) {
          const foundCourse = courses.find((c) => c.id === latestBackendProgress!.courseId);
          if (foundCourse) {
            targetCourse = foundCourse;
            targetProgress = latestBackendProgress;
          }
        }

        // Fallback para o primeiro curso da lista caso não haja nenhum histórico
        if (!targetCourse) {
          targetCourse = courses[0];
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

        let nextLesson: ILesson | undefined;

        // Se o último acesso local apontou para uma aula específica do curso
        if (localLastAccess && localLastAccess.courseId === targetCourse.id && localLastAccess.lessonId) {
          nextLesson = lessons.find((l) => l.id === localLastAccess.lessonId);
        }

        if (!nextLesson) {
          nextLesson = lessons.find((l) => !completedIds.includes(l.id));
        }

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
