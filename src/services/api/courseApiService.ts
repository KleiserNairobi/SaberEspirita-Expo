import apiClient from "./apiClient";
import { CourseDifficultyLevel, ICourse, ICourseMaterialsResponse } from "@/types/course";

export interface GetCoursesParams {
  category?: string;
  difficultyLevel?: CourseDifficultyLevel;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface ICourseFeedbackInput {
  rating: number;
  comment?: string;
}

export interface ICourseFeedbackResponse {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

const CDN_BASE_URL = process.env.EXPO_PUBLIC_CDN_URL || "https://cdn.saberespirita.app.br";

/**
 * Resolve URLs de mídias (imagens, áudios e vídeos) para a CDN Cloudflare REST se for relativo.
 */
export function resolveCdnUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;
  return `${CDN_BASE_URL}/${cleanPath}`;
}

function normalizeMinGrade(value: any): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 70;
  return numeric > 0 && numeric <= 10 ? numeric * 10 : numeric;
}

function parseCertification(cert: any): ICourse["certification"] {
  if (!cert) {
    return {
      enabled: true,
      minimumGrade: 70,
      requiredLessonsPercent: 100,
      requiredExercisesPercent: 100,
    };
  }
  if (typeof cert === "string") {
    try {
      const parsed = JSON.parse(cert);
      return {
        enabled: parsed.enabled ?? true,
        minimumGrade: normalizeMinGrade(parsed.minimumGrade),
        requiredLessonsPercent: parsed.requiredLessonsPercent ?? 100,
        requiredExercisesPercent: parsed.requiredExercisesPercent ?? 100,
      };
    } catch {
      return {
        enabled: true,
        minimumGrade: 70,
        requiredLessonsPercent: 100,
        requiredExercisesPercent: 100,
      };
    }
  }
  return {
    enabled: cert.enabled ?? true,
    minimumGrade: normalizeMinGrade(cert.minimumGrade),
    requiredLessonsPercent: cert.requiredLessonsPercent ?? 100,
    requiredExercisesPercent: cert.requiredExercisesPercent ?? 100,
  };
}

export const MOCK_NOSSO_LAR_COURSE: ICourse = {
  id: "nosso-lar-estudo-guiado",
  title: "Nosso Lar — Estudo Guiado",
  description:
    "Estudo aprofundado da obra de André Luiz em diálogo permanente com a Codificação Kardequiana.",
  order: 999,
  workloadMinutes: 730,
  difficultyLevel: "Intermediário",
  author: "André Luiz / Chico Xavier",
  lessonCount: 15,
  isPremium: true,
  categoryId: "COMP",
  status: "DRAFT",
  allowNewEnrollments: true,
  certification: {
    enabled: true,
    minimumGrade: 70,
    requiredLessonsPercent: 100,
    requiredExercisesPercent: 100,
  },
  hasForum: true,
  stats: {
    exerciseCount: 0,
    totalDurationMinutes: 730,
  },
};

export const courseApiService = {
  /**
   * Obtém a lista de cursos com suporte a filtros.
   */
  async getCourses(params?: GetCoursesParams): Promise<ICourse[]> {
    const response = await apiClient.get<ICourse[]>("/courses", { params });
    const list: ICourse[] = (response.data || []).map((course) => ({
      ...course,
      categoryId:
        course.categoryId ||
        (course as any).category?.id ||
        (course as any).category_id,
      imageUrl:
        typeof course.imageUrl === "string" ? resolveCdnUrl(course.imageUrl) : course.imageUrl,
      certification: parseCertification(course.certification),
    }));

    if (
      !params?.category &&
      !params?.searchTerm &&
      !params?.difficultyLevel &&
      !list.some((course) => course.id === MOCK_NOSSO_LAR_COURSE.id)
    ) {
      list.push(MOCK_NOSSO_LAR_COURSE);
    }

    return list;
  },

  /**
   * Obtém os cursos em destaque (featured).
   */
  async getFeaturedCourses(): Promise<ICourse[]> {
    const response = await apiClient.get<ICourse[]>("/courses/featured");
    return (response.data || []).map((course) => ({
      ...course,
      categoryId:
        course.categoryId ||
        (course as any).category?.id ||
        (course as any).category_id,
      imageUrl: typeof course.imageUrl === "string" ? resolveCdnUrl(course.imageUrl) : course.imageUrl,
      certification: parseCertification(course.certification),
    }));
  },

  /**
   * Obtém os detalhes de um curso específico por ID.
   */
  async getCourseById(courseId: string): Promise<ICourse | null> {
    if (!courseId) return null;
    if (courseId.trim() === MOCK_NOSSO_LAR_COURSE.id) {
      return MOCK_NOSSO_LAR_COURSE;
    }
    const response = await apiClient.get<any>(`/courses/${courseId}`);
    if (!response.data) return null;

    const rawCourse = response.data.course ? response.data.course : response.data;
    const exerciseCount = response.data.exerciseCount ?? rawCourse.exerciseCount ?? rawCourse.stats?.exerciseCount ?? 0;
    const hasForum = response.data.hasForum ?? rawCourse.hasForum ?? false;
    const certification = parseCertification(rawCourse.certification ?? response.data.certification);

    return {
      ...rawCourse,
      imageUrl: typeof rawCourse.imageUrl === "string" ? resolveCdnUrl(rawCourse.imageUrl) : rawCourse.imageUrl,
      certification,
      hasForum,
      stats: {
        ...(rawCourse.stats || {}),
        exerciseCount,
      },
    };
  },

  /**
   * Envia uma avaliação/feedback para o curso.
   */
  async sendCourseFeedback(
    courseId: string,
    feedback: ICourseFeedbackInput
  ): Promise<ICourseFeedbackResponse> {
    const response = await apiClient.post<ICourseFeedbackResponse>(
      `/courses/${courseId}/feedbacks`,
      feedback
    );
    return response.data;
  },

  /**
   * Obtém a lista de feedbacks/avaliações de um curso.
   */
  async getCourseFeedbacks(
    courseId: string,
    size = 100
  ): Promise<ICourseFeedbackResponse[]> {
    const response = await apiClient.get<any>(`/courses/${courseId}/feedbacks`, {
      params: { size },
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (Array.isArray(response.data?.content)) {
      return response.data.content;
    }
    return [];
  },

  /**
   * Obtém os materiais complementares vinculados ao curso (apostilas, podcasts, reflexões e meditações).
   */
  async getCourseMaterials(courseId: string): Promise<ICourseMaterialsResponse> {
    if (!courseId || courseId.trim() === MOCK_NOSSO_LAR_COURSE.id) {
      return { booklets: [], podcasts: [], reflections: [], meditations: [] };
    }

    const response = await apiClient.get<ICourseMaterialsResponse>(
      `/courses/${courseId}/materials`
    );
    const data = response.data || { booklets: [], podcasts: [], reflections: [], meditations: [] };

    return {
      booklets: (data.booklets || []).map((b) => ({
        ...b,
        fileUrl: resolveCdnUrl(b.fileUrl) || b.fileUrl,
        imageUrl: resolveCdnUrl(b.imageUrl) || b.imageUrl,
      })),
      podcasts: (data.podcasts || []).map((p) => ({
        ...p,
        audioUrl: resolveCdnUrl(p.audioUrl) || p.audioUrl,
        imageUrl: resolveCdnUrl(p.imageUrl) || p.imageUrl,
      })),
      reflections: (data.reflections || []).map((r) => ({
        ...r,
        imageUrl: resolveCdnUrl(r.imageUrl) || r.imageUrl,
      })),
      meditations: (data.meditations || []).map((m) => ({
        ...m,
        audioUrl: resolveCdnUrl(m.audioUrl) || m.audioUrl,
        imageUrl: resolveCdnUrl(m.imageUrl) || m.imageUrl,
      })),
    };
  },
};

