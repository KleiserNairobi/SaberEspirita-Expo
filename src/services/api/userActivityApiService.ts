import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { ICertificate, IUserCourseProgress } from "@/types/course";

export const userActivityApiService = {
  /**
   * Obtém o progresso de todos os cursos inscritos pelo usuário.
   */
  async getCoursesProgress(): Promise<IUserCourseProgress[]> {
    const response = await apiClient.get<IUserCourseProgress[]>(
      "/user-activity/courses/progress"
    );
    return response.data || [];
  },

  /**
   * Obtém o progresso de um curso específico.
   */
  async getCourseProgress(courseId: string): Promise<IUserCourseProgress | null> {
    if (!courseId) return null;
    const response = await apiClient.get<IUserCourseProgress>(
      `/user-activity/courses/progress/${courseId}`
    );
    return response.data || null;
  },

  /**
   * Marca uma lição de um curso como concluída pelo aluno.
   */
  async completeLesson(
    courseId: string,
    lessonId: string
  ): Promise<IUserCourseProgress> {
    const response = await apiClient.post<IUserCourseProgress>(
      `/user-activity/courses/progress/${courseId}/lessons/${lessonId}/complete`
    );
    return response.data;
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
