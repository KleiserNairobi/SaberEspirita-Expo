import {
  collection,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  limit,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import { IExercise } from "@/types/course";

/**
 * Busca todos os exercícios associados a uma aula com estratégia Cache-First
 * @param lessonId - ID da aula
 * @returns Lista de exercícios encontrados
 */
export async function getExercisesByLessonId(lessonId: string): Promise<IExercise[]> {
  try {
    const exercisesRef = collection(db, "exercises");
    const q = query(exercisesRef, where("lessonId", "==", lessonId));

    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        const exercises: IExercise[] = [];
        cacheSnapshot.forEach((doc) => {
          exercises.push({ ...doc.data(), id: doc.id } as IExercise);
        });
        return exercises;
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const querySnapshot = await getDocsFromServer(q);

    const exercises: IExercise[] = [];
    querySnapshot.forEach((doc) => {
      exercises.push({ ...doc.data(), id: doc.id } as IExercise);
    });

    return exercises;
  } catch (error) {
    console.error(`Erro ao buscar exercícios para a aula ${lessonId}:`, error);
    return [];
  }
}

/**
 * Busca todos os exercícios associados a um curso com estratégia Cache-First
 * @param courseId - ID do curso
 * @returns Lista de exercícios encontrados
 */
export async function getExercisesByCourseId(courseId: string): Promise<IExercise[]> {
  try {
    const exercisesRef = collection(db, "exercises");
    const q = query(exercisesRef, where("courseId", "==", courseId));

    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        const exercises: IExercise[] = [];
        cacheSnapshot.forEach((doc) => {
          exercises.push({ ...doc.data(), id: doc.id } as IExercise);
        });
        return exercises;
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const querySnapshot = await getDocsFromServer(q);

    const exercises: IExercise[] = [];
    querySnapshot.forEach((doc) => {
      exercises.push({ ...doc.data(), id: doc.id } as IExercise);
    });

    return exercises;
  } catch (error) {
    console.error(`Erro ao buscar exercícios do curso ${courseId}:`, error);
    return [];
  }
}
