import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { ILesson } from "@/types/course";

/**
 * Busca todas as aulas de um curso específico com estratégia Cache-First
 * @param courseId - ID do curso
 * @returns Lista de aulas ordenada pela ordem
 */
export async function getLessonsByCourseId(courseId: string): Promise<ILesson[]> {
  try {
    const lessonsRef = collection(db, "courses", courseId, "lessons");
    const q = query(lessonsRef, orderBy("order", "asc"));

    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        const lessons: ILesson[] = [];
        cacheSnapshot.forEach((doc) => {
          lessons.push({ ...doc.data(), id: doc.id } as ILesson);
        });
        return lessons;
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const querySnapshot = await getDocsFromServer(q);

    const lessons: ILesson[] = [];
    querySnapshot.forEach((doc) => {
      lessons.push({ ...doc.data(), id: doc.id } as ILesson);
    });

    return lessons;
  } catch (error) {
    console.error(`Erro ao buscar aulas do curso ${courseId}:`, error);
    throw error;
  }
}

/**
 * Busca uma aula específica por ID com estratégia Cache-First
 * @param courseId - ID do curso
 * @param lessonId - ID da aula
 * @returns Aula encontrada ou null
 */
export async function getLessonById(
  courseId: string,
  lessonId: string
): Promise<ILesson | null> {
  try {
    const lessonRef = doc(db, "courses", courseId, "lessons", lessonId);

    try {
      const cacheSnap = await getDocFromCache(lessonRef);
      if (cacheSnap.exists()) {
        return { ...cacheSnap.data(), id: cacheSnap.id } as ILesson;
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const lessonSnap = await getDocFromServer(lessonRef);

    if (lessonSnap.exists()) {
      return { ...lessonSnap.data(), id: lessonSnap.id } as ILesson;
    }

    return null;
  } catch (error) {
    console.error(`Erro ao buscar aula ${lessonId}:`, error);
    throw error;
  }
}
