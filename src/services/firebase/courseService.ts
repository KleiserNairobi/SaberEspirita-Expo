import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { CourseDifficultyLevel, ICourse } from "@/types/course";

/**
 * Busca todos os cursos disponíveis com estratégia Cache-First
 * @returns Lista de cursos ordenada por título
 */
export async function getCourses(): Promise<ICourse[]> {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, orderBy("title", "asc"), limit(50));

    const querySnapshot = await getDocs(q);

    const courses: ICourse[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ ...doc.data(), id: doc.id } as ICourse);
    });

    return courses;
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    throw error;
  }
}

/**
 * Busca um curso específico por ID com estratégia resiliente do Firestore
 * @param courseId - ID do curso
 * @returns Curso encontrado ou null
 */
export async function getCourseById(courseId: string): Promise<ICourse | null> {
  if (!courseId) return null;
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (courseSnap.exists()) {
      return { ...courseSnap.data(), id: courseSnap.id } as ICourse;
    }

    // Fallback de resiliência caso o courseId fornecido seja um alias de campo
    try {
      const q = query(collection(db, "courses"), where("id", "==", courseId), limit(1));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const d = querySnap.docs[0];
        return { ...d.data(), id: d.id } as ICourse;
      }
    } catch {
      // Ignora erro de fallback
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
      orderBy("title", "asc"),
      limit(50)
    );

    const querySnapshot = await getDocs(q);

    const courses: ICourse[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ ...doc.data(), id: doc.id } as ICourse);
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
    const q = query(
      coursesRef,
      where("featured", "==", true),
      orderBy("order", "asc"),
      limit(20)
    );

    const querySnapshot = await getDocs(q);

    const courses: ICourse[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ ...doc.data(), id: doc.id } as ICourse);
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
