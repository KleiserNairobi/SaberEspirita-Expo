import { useQuery } from "@tanstack/react-query";
import {
  getCourses,
  getFeaturedCourses,
  getCourseById,
} from "@/services/firebase/courseService";

export const COURSES_KEYS = {
  all: ["courses"] as const,
  featured: ["courses", "featured"] as const,
  detail: (id: string) => ["courses", "detail", id] as const,
};

export function useCourses() {
  return useQuery({
    queryKey: COURSES_KEYS.all,
    queryFn: getCourses,
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: COURSES_KEYS.featured,
    queryFn: getFeaturedCourses,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: COURSES_KEYS.detail(id),
    queryFn: () => getCourseById(id),
    enabled: !!id, // Só executa se tiver ID
  });
}
