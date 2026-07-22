import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocsFromCache,
  getDocsFromServer,
} from "firebase/firestore";

import { useAuthStore } from "@/stores/authStore";
import { db } from "@/configs/firebase/firebase";
import { ICourse, IUserCourseProgress, ILesson } from "@/types/course";
import { getCourseById } from "@/services/firebase/courseService";
import { getLessonById, getLessonsByCourseId } from "@/services/firebase/lessonService";

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

      // 1. Buscar o progresso mais recente
      const progressRef = collection(db, "users", user.uid, "courseProgress");
      const q = query(progressRef, orderBy("lastAccessedAt", "desc"), limit(1));
      let snapshot;

      try {
        const cacheSnap = await getDocsFromCache(q);
        if (!cacheSnap.empty) {
          snapshot = cacheSnap;
        } else {
          snapshot = await getDocsFromServer(q);
        }
      } catch {
        snapshot = await getDocsFromServer(q);
      }

      if (snapshot.empty) return null;

      const progressDoc = snapshot.docs[0];
      const courseId = (progressDoc.data().courseId as string) || progressDoc.id;

      const progressData = {
        ...progressDoc.data(),
        courseId,
        startedAt: progressDoc.data().startedAt?.toDate(),
        lastAccessedAt: progressDoc.data().lastAccessedAt?.toDate(),
        completedAt: progressDoc.data().completedAt?.toDate(),
      } as IUserCourseProgress;

      // 2. Buscar detalhes do curso (tenta desnormalizado primeiro, senão usa fallback)
      let courseData: ICourse | null = null;
      if (progressData.courseTitle && typeof progressData.courseLessonCount === "number") {
        courseData = {
          id: courseId,
          title: progressData.courseTitle,
          lessonCount: progressData.courseLessonCount,
        } as any;
      } else {
        courseData = await getCourseById(courseId);
      }

      if (!courseData) return null;

      // 3. Buscar a próxima aula (tenta desnormalizado primeiro, senão usa fallback)
      let nextLesson: ILesson | undefined;

      if (progressData.lastLessonId) {
        if (progressData.lastLessonTitle && typeof progressData.lastLessonOrder === "number") {
          nextLesson = {
            id: progressData.lastLessonId,
            title: progressData.lastLessonTitle,
            order: progressData.lastLessonOrder,
          } as any;
        } else {
          const lesson = await getLessonById(progressData.courseId, progressData.lastLessonId);
          if (lesson) nextLesson = lesson;
        }
      } else {
        const lessons = await getLessonsByCourseId(progressData.courseId);
        if (lessons.length > 0) {
          nextLesson = lessons[0];
        }
      }

      return {
        course: courseData,
        progress: progressData,
        nextLesson,
      };
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (invalidação manual nas modificações)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
  });
}
