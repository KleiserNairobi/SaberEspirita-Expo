import { useQuery } from "@tanstack/react-query";
import { courseApiService } from "@/services/api/courseApiService";
import { ICourse } from "@/types/course";

export const COURSES_KEYS = {
  all: ["courses"] as const,
  featured: ["courses", "featured"] as const,
  detail: (id: string) => ["courses", "detail", id] as const,
};
async function fetchCourses(): Promise<ICourse[]> {
  try {
    return await courseApiService.getCourses();
  } catch (error) {
    console.warn("useCourses: Erro ao buscar cursos:", error);
    return [];
  }
}

async function fetchFeaturedCourses(): Promise<ICourse[]> {
  try {
    return await courseApiService.getFeaturedCourses();
  } catch (error) {
    console.warn("useFeaturedCourses: Erro ao buscar cursos em destaque:", error);
    return [];
  }
}

async function fetchCourseById(id: string): Promise<ICourse | null> {
  try {
    const course = await courseApiService.getCourseById(id);
    if (course) return course;
  } catch (error) {
    console.warn(`useCourse(${id}): Erro ao buscar curso:`, error);
  }
  return null;
}

export function useCourses() {
  return useQuery({
    queryKey: COURSES_KEYS.all,
    queryFn: fetchCourses,
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnReconnect: true,
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: COURSES_KEYS.featured,
    queryFn: fetchFeaturedCourses,
    staleTime: 1000 * 60 * 3, // 3 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: COURSES_KEYS.detail(id),
    queryFn: () => fetchCourseById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minuto
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

