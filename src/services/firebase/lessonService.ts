import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { ILesson } from "@/types/course";

/**
 * Busca todas as aulas de um curso específico
 * @param courseId - ID do curso
 * @returns Lista de aulas ordenada pela ordem
 */
export async function getLessonsByCourseId(courseId: string): Promise<ILesson[]> {
  try {
    // Assume que 'lessons' é uma subcoleção de 'courses'
    // Estrutura: courses/{courseId}/lessons/{lessonId}
    const lessonsRef = collection(db, "courses", courseId, "lessons");
    const q = query(lessonsRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const lessons: ILesson[] = [];
    querySnapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() } as ILesson);
    });

    return lessons;
  } catch (error) {
    console.error(`Erro ao buscar aulas do curso ${courseId}:`, error);
    throw error;
  }
}

/**
 * Busca uma aula específica por ID
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
    const lessonSnap = await getDoc(lessonRef);

    if (lessonSnap.exists()) {
      return { id: lessonSnap.id, ...lessonSnap.data() } as ILesson;
    }

    return null;
  } catch (error) {
    console.error(`Erro ao buscar aula ${lessonId}:`, error);
    throw error;
  }
}
