import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { useAuthStore } from "@/stores/authStore";
import { db } from "@/configs/firebase/firebase";
import { ICourse, IUserCourseProgress, ILesson } from "@/types/course";

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
      const snapshot = await getDocs(q);

      if (snapshot.empty) return null;

      const progressDoc = snapshot.docs[0];
      const progressData = {
        ...progressDoc.data(),
        startedAt: progressDoc.data().startedAt?.toDate(),
        lastAccessedAt: progressDoc.data().lastAccessedAt?.toDate(),
        completedAt: progressDoc.data().completedAt?.toDate(),
      } as IUserCourseProgress;

      // Se o curso já foi concluído (100%), talvez não queiramos mostrar no "Continuar"
      // Mas por enquanto vamos mostrar para permitir revisão ou certificado

      // 2. Buscar detalhes do curso
      const courseDoc = await getDoc(doc(db, "courses", progressData.courseId));
      if (!courseDoc.exists()) return null;

      const courseData = { id: courseDoc.id, ...courseDoc.data() } as ICourse;

      // 3. Buscar a próxima aula (se houver lastLessonId, pegamos a próxima, senão a primeira)
      // Simplificação: vamos buscar a aula que está marcada como lastLessonId
      let nextLesson: ILesson | undefined;

      if (progressData.lastLessonId) {
        // Tenta buscar a aula atual (onde parou)
        const lessonSnap = await getDoc(doc(db, "lessons", progressData.lastLessonId));
        if (lessonSnap.exists()) {
          nextLesson = { id: lessonSnap.id, ...lessonSnap.data() } as ILesson;
        }
      } else {
        // Se não tem lastLessonId, pega a primeira aula do curso (ordem 1)
        const lessonsRef = collection(db, "lessons");
        const lessonsQuery = query(
          lessonsRef,
          where("courseId", "==", courseData.id),
          orderBy("order", "asc"),
          limit(1)
        );
        const lessonsSnap = await getDocs(lessonsQuery);
        if (!lessonsSnap.empty) {
          const lessonDoc = lessonsSnap.docs[0];
          nextLesson = { id: lessonDoc.id, ...lessonDoc.data() } as ILesson;
        }
      }

      return {
        course: courseData,
        progress: progressData,
        nextLesson,
      };
    },
    enabled: !!user?.uid,
  });
}
