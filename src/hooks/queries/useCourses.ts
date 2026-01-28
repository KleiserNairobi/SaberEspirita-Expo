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
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: "always", // Revalida em background
    refetchOnReconnect: true,
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: COURSES_KEYS.featured,
    queryFn: getFeaturedCourses,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: COURSES_KEYS.detail(id),
    queryFn: () => getCourseById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}
