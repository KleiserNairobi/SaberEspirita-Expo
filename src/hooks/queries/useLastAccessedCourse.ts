import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { ICourse, IUserCourseProgress, ILesson } from "@/types/course";
import { courseApiService } from "@/services/api/courseApiService";
import { lessonApiService } from "@/services/api/lessonApiService";

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

        const firstCourse = courses[0];
        const lessons = await lessonApiService.getLessonsByCourseId(firstCourse.id);

        return {
          course: firstCourse,
          progress: {
            courseId: firstCourse.id,
            completedLessons: [],
            completedExercises: [],
            updatedAt: new Date().toISOString(),
          } as any,
          nextLesson: lessons[0],
        };
      } catch (error) {
        console.warn("useLastAccessedCourse: erro ao carregar via REST API:", error);
        return null;
      }
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
  });
}
