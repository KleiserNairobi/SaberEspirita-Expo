import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { ICourse, CourseDifficultyLevel } from "@/types/course";

/**
 * Busca todos os cursos disponíveis com estratégia Cache-First
 * @returns Lista de cursos ordenada por título
 */
export async function getCourses(): Promise<ICourse[]> {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, orderBy("title", "asc"), limit(50));

    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        const courses: ICourse[] = [];
        cacheSnapshot.forEach((doc) => {
          courses.push({ id: doc.id, ...doc.data() } as ICourse);
        });
        return courses;
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const querySnapshot = await getDocsFromServer(q);

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
 * Busca um curso específico por ID com estratégia Cache-First
 * @param courseId - ID do curso
 * @returns Curso encontrado ou null
 */
export async function getCourseById(courseId: string): Promise<ICourse | null> {
  try {
    const courseRef = doc(db, "courses", courseId);

    try {
      const cacheSnap = await getDocFromCache(courseRef);
      if (cacheSnap.exists()) {
        return { id: cacheSnap.id, ...cacheSnap.data() } as ICourse;
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const courseSnap = await getDocFromServer(courseRef);

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
 * Busca cursos por nível de dificuldade com estratégia Cache-First
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

    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        const courses: ICourse[] = [];
        cacheSnapshot.forEach((doc) => {
          courses.push({ id: doc.id, ...doc.data() } as ICourse);
        });
        return courses;
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const querySnapshot = await getDocsFromServer(q);

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
 * Busca cursos em destaque (featured) com estratégia Cache-First
 * @returns Lista de cursos em destaque
 */
export async function getFeaturedCourses(): Promise<ICourse[]> {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(
      coursesRef,
      where("featured", "==", true),
      orderBy("order", "asc"),
      limit(5)
    );

    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        const courses: ICourse[] = [];
        cacheSnapshot.forEach((doc) => {
          courses.push({ id: doc.id, ...doc.data() } as ICourse);
        });
        return courses;
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const querySnapshot = await getDocsFromServer(q);

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
