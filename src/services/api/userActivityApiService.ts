import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { ICertificate, IUserCourseProgress } from "@/types/course";
import * as Storage from "@/utils/Storage";

function parseArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function normalizeProgress(raw: any): IUserCourseProgress {
  if (!raw) return raw;
  return {
    ...raw,
    completedLessons: parseArray(raw.completedLessons),
  };
}

export const userActivityApiService = {
  /**
   * Obtém o progresso de todos os cursos inscritos pelo usuário.
   */
  async getCoursesProgress(): Promise<IUserCourseProgress[]> {
    if (!Storage.loadString("jwt_token")) return [];
    try {
      const response = await apiClient.get<any[]>(
        "/user-activity/courses/progress"
      );
      const list = response.data || [];
      return list.map(normalizeProgress);
    } catch {
      return [];
    }
  },

  /**
   * Obtém o progresso de um curso específico.
   */
  async getCourseProgress(courseId: string): Promise<IUserCourseProgress | null> {
    if (!courseId || !Storage.loadString("jwt_token")) return null;
    try {
      const response = await apiClient.get<any>(
        `/user-activity/courses/progress/${courseId}`
      );
      if (!response.data) return null;
      return normalizeProgress(response.data);
    } catch {
      return null;
    }
  },

  /**
   * Marca uma lição de um curso como concluída pelo aluno.
   */
  async completeLesson(
    courseId: string,
    lessonId: string
  ): Promise<IUserCourseProgress> {
    const response = await apiClient.post<any>(
      `/user-activity/courses/progress/${courseId}/lessons/${lessonId}/complete`
    );
    return normalizeProgress(response.data);
  },

  /**
   * Obtém a lista de certificados emitidos para o usuário.
   */
  async getCertificates(): Promise<ICertificate[]> {
    const response = await apiClient.get<ICertificate[]>(
      "/user-activity/courses/certificates"
    );
    return (response.data || []).map((cert) => ({
      ...cert,
      pdfUrl: resolveCdnUrl(cert.pdfUrl) || cert.pdfUrl,
    }));
  },

  /**
   * Gera o certificado de um curso concluído com sucesso.
   */
  async generateCertificate(courseId: string): Promise<ICertificate> {
    const response = await apiClient.post<ICertificate>(
      `/user-activity/courses/certificates/generate/${courseId}`
    );
    return {
      ...response.data,
      pdfUrl: resolveCdnUrl(response.data.pdfUrl) || response.data.pdfUrl,
    };
  },
};
