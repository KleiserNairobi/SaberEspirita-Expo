import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { ICourse, CourseDifficultyLevel } from "@/types/course";

/**
 * Busca todos os cursos disponíveis
 * @returns Lista de cursos ordenada por título
 */
export async function getCourses(): Promise<ICourse[]> {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);

    const courses: ICourse[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() } as ICourse);
    });

    return courses;
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    throw error;
  }
}

/**
 * Busca um curso específico por ID
 * @param courseId - ID do curso
 * @returns Curso encontrado ou null
 */
export async function getCourseById(courseId: string): Promise<ICourse | null> {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() } as ICourse;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    throw error;
  }
}

/**
 * Busca cursos por nível de dificuldade
 * @param level - Nível de dificuldade
 * @returns Lista de cursos filtrada
 */
export async function getCoursesByDifficulty(
  level: CourseDifficultyLevel
): Promise<ICourse[]> {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(
      coursesRef,
      where("difficultyLevel", "==", level),
      orderBy("title", "asc")
    );
    const querySnapshot = await getDocs(q);

    const courses: ICourse[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() } as ICourse);
    });

    return courses;
  } catch (error) {
    console.error("Erro ao buscar cursos por dificuldade:", error);
    throw error;
  }
}

/**
 * Busca cursos em destaque (featured)
 * @returns Lista de cursos em destaque
 */
export async function getFeaturedCourses(): Promise<ICourse[]> {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, where("featured", "==", true), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const courses: ICourse[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() } as ICourse);
    });

    return courses;
  } catch (error) {
    console.error("Erro ao buscar cursos em destaque:", error);
    throw error;
  }
}

/**
 * Busca cursos por termo de busca (título ou descrição)
 * @param searchTerm - Termo de busca
 * @param allCourses - Lista de todos os cursos (para filtrar localmente)
 * @returns Lista de cursos filtrada
 */
export function searchCourses(searchTerm: string, allCourses: ICourse[]): ICourse[] {
  if (!searchTerm.trim()) {
    return allCourses;
  }

  const term = searchTerm.toLowerCase();

  return allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term) ||
      course.author.toLowerCase().includes(term)
  );
}
