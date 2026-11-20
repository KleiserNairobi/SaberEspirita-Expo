import mockNL01 from "@/assets/mocks/lessons/NL-01.json";
import mockNL02 from "@/assets/mocks/lessons/NL-02.json";
import mockNL03 from "@/assets/mocks/lessons/NL-03.json";
import mockNL04 from "@/assets/mocks/lessons/NL-04.json";
import mockNL05 from "@/assets/mocks/lessons/NL-05.json";
import mockNL06 from "@/assets/mocks/lessons/NL-06.json";
import mockNL07 from "@/assets/mocks/lessons/NL-07.json";
import mockNL08 from "@/assets/mocks/lessons/NL-08.json";
import mockNL09 from "@/assets/mocks/lessons/NL-09.json";
import mockNL10 from "@/assets/mocks/lessons/NL-10.json";
import mockNL11 from "@/assets/mocks/lessons/NL-11.json";
import mockNL12 from "@/assets/mocks/lessons/NL-12.json";
import mockNL13 from "@/assets/mocks/lessons/NL-13.json";
import mockNL14 from "@/assets/mocks/lessons/NL-14.json";
import mockNL15 from "@/assets/mocks/lessons/NL-15.json";
import { ILesson, IReflectionQuestion, ISupplementaryMaterial } from "@/types/course";

import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";

const NOSSO_LAR_MOCK_LESSONS = [
  mockNL01,
  mockNL02,
  mockNL03,
  mockNL04,
  mockNL05,
  mockNL06,
  mockNL07,
  mockNL08,
  mockNL09,
  mockNL10,
  mockNL11,
  mockNL12,
  mockNL13,
  mockNL14,
  mockNL15,
];

function normalizeLesson(raw: any, fallbackOrder?: number): ILesson {
  const order = raw.order ?? raw.orderIndex ?? fallbackOrder ?? 1;
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
    status: raw.status ?? "PUBLISHED",
    reflectionQuestions: reflectionQuestions.length > 0 ? reflectionQuestions : undefined,
    forumPrompt: raw.forumPrompt || reflectionQuestions?.[0]?.question || null,
    forumFocusTag: raw.forumFocusTag || reflectionQuestions?.[0]?.focus || null,
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

      const rawImageUrl =
        slide.image && typeof slide.image.url === "string"
          ? slide.image.url.trim()
          : "";
      const normalizedImage = rawImageUrl
        ? {
            ...slide.image,
            url: resolveCdnUrl(rawImageUrl) || rawImageUrl,
          }
        : undefined;

      return {
        ...slide,
        slideType,
        content: slide.content || "",
        image: normalizedImage,
      };
    }),
  };
}

export const lessonApiService = {
  /**
   * Obtém todas as lições de um curso por courseId.
   */
  async getLessonsByCourseId(courseId: string): Promise<ILesson[]> {
    if (!courseId) return [];
    const cleanCourseId = courseId.trim().toLowerCase();
    if (cleanCourseId === "nosso-lar-estudo-guiado" || cleanCourseId.includes("nosso-lar")) {
      return NOSSO_LAR_MOCK_LESSONS.map((raw, index) => normalizeLesson(raw, index + 1));
    }
    const response = await apiClient.get<any[]>(`/courses/${courseId}/lessons`);
    return (response.data || []).map((raw, index) => normalizeLesson(raw, index + 1));
  },

  /**
   * Obtém a lição detalhada por lessonId (com slides JSONB e mídias).
   */
  async getLessonById(lessonId: string): Promise<ILesson | null> {
    if (!lessonId) return null;
    const cleanLessonId = lessonId.trim();
    const normalizedId = cleanLessonId.toUpperCase();

    const mockIndex = NOSSO_LAR_MOCK_LESSONS.findIndex(
      (item) => item.id.toUpperCase() === normalizedId
    );
    if (mockIndex >= 0) {
      return normalizeLesson(NOSSO_LAR_MOCK_LESSONS[mockIndex], mockIndex + 1);
    }

    if (normalizedId === "LESSON-NL-M1-A02") {
      return normalizeLesson(NOSSO_LAR_MOCK_LESSONS[1], 2);
    }
    if (
      cleanLessonId.toLowerCase() === "nosso-lar-estudo-guiado" ||
      normalizedId.startsWith("LESSON-NL")
    ) {
      return normalizeLesson(NOSSO_LAR_MOCK_LESSONS[0], 1);
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
