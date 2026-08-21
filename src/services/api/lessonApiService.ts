import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { ILesson, IReflectionQuestion, ISupplementaryMaterial } from "@/types/course";

function normalizeLesson(raw: any): ILesson {
  const order = raw.order ?? raw.orderIndex ?? 1;
  return {
    ...raw,
    order,
    videoUrl: resolveCdnUrl(raw.videoUrl),
    audioUrl: resolveCdnUrl(raw.audioUrl),
    slides: (raw.slides || []).map((slide: any) => ({
      ...slide,
      content: slide.content || "",
    })),
  };
}

export const lessonApiService = {
  /**
   * Obtém todas as lições de um curso por courseId.
   */
  async getLessonsByCourseId(courseId: string): Promise<ILesson[]> {
    if (!courseId) return [];
    const response = await apiClient.get<any[]>(`/courses/${courseId}/lessons`);
    return (response.data || []).map(normalizeLesson);
  },

  /**
   * Obtém a lição detalhada por lessonId (com slides JSONB e mídias).
   */
  async getLessonById(lessonId: string): Promise<ILesson | null> {
    if (!lessonId) return null;
    const response = await apiClient.get<any>(`/lessons/${lessonId}`);
    if (!response.data) return null;
    return normalizeLesson(response.data);
  },

  /**
   * Obtém os materiais complementares de uma lição.
   */
  async getLessonMaterials(lessonId: string): Promise<ISupplementaryMaterial[]> {
    if (!lessonId) return [];
    const response = await apiClient.get<ISupplementaryMaterial[]>(
      `/lessons/${lessonId}/materials`
    );
    return (response.data || []).map((material) => ({
      ...material,
      url: resolveCdnUrl(material.url),
      fileUrl: resolveCdnUrl(material.fileUrl),
    }));
  },

  /**
   * Obtém as perguntas de reflexão de uma lição.
   */
  async getLessonReflections(lessonId: string): Promise<IReflectionQuestion[]> {
    if (!lessonId) return [];
    const response = await apiClient.get<IReflectionQuestion[]>(
      `/lessons/${lessonId}/reflections`
    );
    return response.data || [];
  },
};
