import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import { IExercise } from "@/types/course";

/**
 * Busca o exercício associado a uma aula
 * @param lessonId - ID da aula
 * @returns O primeiro exercício encontrado ou null
 */
/**
 * Busca todos os exercícios associados a uma aula
 * @param lessonId - ID da aula
 * @returns Lista de exercícios encontrados
 */
export async function getExercisesByLessonId(lessonId: string): Promise<IExercise[]> {
  try {
    const exercisesRef = collection(db, "exercises");
    const q = query(exercisesRef, where("lessonId", "==", lessonId));
    const querySnapshot = await getDocs(q);

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
