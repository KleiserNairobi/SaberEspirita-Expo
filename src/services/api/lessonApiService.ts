import { ILesson, IReflectionQuestion, ISupplementaryMaterial } from "@/types/course";

import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";

function normalizeLesson(raw: any): ILesson {
  const order = raw.order ?? raw.orderIndex ?? 1;
  const rawReflections =
    raw.reflectionQuestions ||
    raw.reflections ||
    raw.reflection_questions ||
    raw.questions ||
    [];

  const reflectionQuestions: IReflectionQuestion[] = Array.isArray(rawReflections)
    ? rawReflections.map((r: any, idx: number) => ({
        id: r.id || `rq_${idx}`,
        question: r.question || r.text || "",
        focus: r.focus || r.tag || r.category || "Reflexão",
        orderIndex: r.orderIndex ?? r.order ?? idx,
      }))
    : [];

  return {
    ...raw,
    order,
    reflectionQuestions: reflectionQuestions.length > 0 ? reflectionQuestions : undefined,
    videoUrl: resolveCdnUrl(raw.videoUrl),
    audioUrl: resolveCdnUrl(raw.audioUrl),
    slides: (raw.slides || []).map((slide: any) => {
      const slideType =
        slide.slideType ||
        slide.type ||
        slide.label ||
        slide.tag ||
        slide.slide_type ||
        slide.category ||
        undefined;

      return {
        ...slide,
        slideType,
        content: slide.content || "",
      };
    }),
  };
}

import mockCursoNossoLar from "@/assets/mocks/lessons/CursoNossoLar.json";
import mockCursoNossoLarAula2 from "@/assets/mocks/lessons/CursoNossoLarAula2.json";

export const lessonApiService = {
  /**
   * Obtém todas as lições de um curso por courseId.
   */
  async getLessonsByCourseId(courseId: string): Promise<ILesson[]> {
    if (!courseId) return [];
    const cleanCourseId = courseId.trim().toLowerCase();
    if (cleanCourseId === "nosso-lar-estudo-guiado" || cleanCourseId.includes("nosso-lar")) {
      return [
        normalizeLesson(mockCursoNossoLar),
        normalizeLesson(mockCursoNossoLarAula2),
      ];
    }
    const response = await apiClient.get<any[]>(`/courses/${courseId}/lessons`);
    return (response.data || []).map(normalizeLesson);
  },

  /**
   * Obtém a lição detalhada por lessonId (com slides JSONB e mídias).
   */
  async getLessonById(lessonId: string): Promise<ILesson | null> {
    if (!lessonId) return null;
    const cleanLessonId = lessonId.trim();
    if (cleanLessonId === "LESSON-NL-M1-A02") {
      return normalizeLesson(mockCursoNossoLarAula2);
    }
    if (
      cleanLessonId === "LESSON-NL-M1-A01" ||
      cleanLessonId === "nosso-lar-estudo-guiado" ||
      cleanLessonId.includes("NL")
    ) {
      return normalizeLesson(mockCursoNossoLar);
    }
    const response = await apiClient.get<any>(`/lessons/${lessonId}`);
    if (!response.data) return null;
    const lesson = normalizeLesson(response.data);

    // Fallback: se não veio reflections no payload principal, busca do endpoint dedicado
    if (!lesson.reflectionQuestions || lesson.reflectionQuestions.length === 0) {
      try {
        const reflections = await lessonApiService.getLessonReflections(lessonId);
        if (reflections && reflections.length > 0) {
          lesson.reflectionQuestions = reflections;
        }
      } catch (err) {
        console.warn(`Erro ao buscar perguntas de reflexão para ${lessonId}:`, err);
      }
    }

    return lesson;
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
