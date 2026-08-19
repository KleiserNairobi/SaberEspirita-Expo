import apiClient from "./apiClient";
import { CourseDifficultyLevel, ICourse } from "@/types/course";

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

export const courseApiService = {
  /**
   * Obtém a lista de cursos com suporte a filtros.
   */
  async getCourses(params?: GetCoursesParams): Promise<ICourse[]> {
    const response = await apiClient.get<ICourse[]>("/courses", { params });
    return (response.data || []).map((course) => ({
      ...course,
      imageUrl: typeof course.imageUrl === "string" ? resolveCdnUrl(course.imageUrl) : course.imageUrl,
    }));
  },

  /**
   * Obtém os cursos em destaque (featured).
   */
  async getFeaturedCourses(): Promise<ICourse[]> {
    const response = await apiClient.get<ICourse[]>("/courses/featured");
    return (response.data || []).map((course) => ({
      ...course,
      imageUrl: typeof course.imageUrl === "string" ? resolveCdnUrl(course.imageUrl) : course.imageUrl,
    }));
  },

  /**
   * Obtém os detalhes de um curso específico por ID.
   */
  async getCourseById(courseId: string): Promise<ICourse | null> {
    if (!courseId) return null;
    const response = await apiClient.get<ICourse>(`/courses/${courseId}`);
    if (!response.data) return null;

    const course = response.data;
    return {
      ...course,
      imageUrl: typeof course.imageUrl === "string" ? resolveCdnUrl(course.imageUrl) : course.imageUrl,
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
  async getCourseFeedbacks(courseId: string): Promise<ICourseFeedbackResponse[]> {
    const response = await apiClient.get<ICourseFeedbackResponse[]>(
      `/courses/${courseId}/feedbacks`
    );
    return response.data || [];
  },
};
