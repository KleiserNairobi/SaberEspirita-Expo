import { useQuery } from "@tanstack/react-query";
import { MOCK_NOSSO_LAR_COURSE, courseApiService } from "@/services/api/courseApiService";
import { useIsAdmin } from "@/stores/authStore";
import { ICourse, ICourseMaterialsResponse } from "@/types/course";

export const COURSES_KEYS = {
  all: ["courses"] as const,
  featured: ["courses", "featured"] as const,
  detail: (id: string) => ["courses", "detail", id] as const,
  materials: (courseId: string) => ["courses", "materials", courseId] as const,
};

async function fetchCourses(): Promise<ICourse[]> {
  return await courseApiService.getCourses();
}

async function fetchFeaturedCourses(): Promise<ICourse[]> {
  return await courseApiService.getFeaturedCourses();
}

async function fetchCourseById(id: string): Promise<ICourse | null> {
  const course = await courseApiService.getCourseById(id);
  return course || null;
}

async function fetchCourseMaterials(courseId: string): Promise<ICourseMaterialsResponse> {
  return await courseApiService.getCourseMaterials(courseId);
}

export function useCourses() {
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: COURSES_KEYS.all,
    queryFn: fetchCourses,
    select: (courses) => {
      const list = courses || [];
      if (isAdmin) {
        if (!list.some((c) => c.id === MOCK_NOSSO_LAR_COURSE.id)) {
          return [...list, MOCK_NOSSO_LAR_COURSE];
        }
        return list;
      }
      return list.filter((c) => c.status !== "DRAFT");
    },
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    refetchOnReconnect: true,
    retry: 2,
  });
}

export function useFeaturedCourses() {
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: COURSES_KEYS.featured,
    queryFn: fetchFeaturedCourses,
    select: (courses) => {
      const list = courses || [];
      if (isAdmin) {
        if (!list.some((c) => c.id === MOCK_NOSSO_LAR_COURSE.id)) {
          return [...list, MOCK_NOSSO_LAR_COURSE];
        }
        return list;
      }
      return list.filter((c) => c.status !== "DRAFT");
    },
    staleTime: 1000 * 60 * 3, // 3 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    refetchOnReconnect: true,
    retry: 2,
  });
}

export function useCourse(id: string) {
  const isAdmin = useIsAdmin();

  return useQuery({
    queryKey: COURSES_KEYS.detail(id),
    queryFn: () => fetchCourseById(id),
    enabled: !!id,
    select: (course) => {
      if (!course) return null;
      if (course.status === "DRAFT" && !isAdmin) return null;
      return course;
    },
    staleTime: 1000 * 60 * 1, // 1 minuto
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    retry: 2,
  });
}

export function useCourseMaterials(courseId: string) {
  return useQuery({
    queryKey: COURSES_KEYS.materials(courseId),
    queryFn: () => fetchCourseMaterials(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    placeholderData: (previousData) => previousData,
    refetchOnReconnect: true,
    retry: 2,
  });
}


