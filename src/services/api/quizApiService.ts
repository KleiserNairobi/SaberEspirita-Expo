import apiClient from "./apiClient";
import {
  ICategory,
  IQuestionReportPayload,
  IQuiz,
  IQuizHistory,
  IQuizSubmitPayload,
  IQuizSubmitResult,
  ISubcategory,
  IUserDetailedStats,
} from "@/types/quiz";

export const quizApiService = {
  /**
   * Obtém todas as categorias de quizzes.
   */
  async getCategories(): Promise<ICategory[]> {
    const response = await apiClient.get<ICategory[]>("/quizzes/categories");
    return response.data || [];
  },

  /**
   * Obtém subcategorias de uma categoria específica.
   */
  async getSubcategories(categoryId: string): Promise<ISubcategory[]> {
    if (!categoryId) return [];
    const response = await apiClient.get<ISubcategory[]>(
      `/quizzes/categories/${categoryId}/subcategories`
    );
    return response.data || [];
  },

  /**
   * Obtém todos os quizzes de uma categoria.
   */
  async getQuizzesByCategory(categoryId: string): Promise<IQuiz[]> {
    if (!categoryId) return [];
    const response = await apiClient.get<IQuiz[]>(`/quizzes/category/${categoryId}`);
    return response.data || [];
  },

  /**
   * Obtém um quiz específico por quizId ou subcategoryId.
   */
  async getQuizById(quizId: string): Promise<IQuiz | null> {
    if (!quizId) return null;
    const response = await apiClient.get<IQuiz>(`/quizzes/${quizId}`);
    return response.data || null;
  },

  /**
   * Submete as respostas de um quiz para processamento e atualização de pontuação.
   */
  async submitQuiz(
    quizId: string,
    payload: IQuizSubmitPayload
  ): Promise<IQuizSubmitResult> {
    const response = await apiClient.post<IQuizSubmitResult>(
      `/quizzes/${quizId}/submit`,
      payload
    );
    return response.data;
  },

  /**
   * Obtém o histórico completo de quizzes resolvidos pelo usuário autenticado.
   */
  async getUserQuizHistory(): Promise<IQuizHistory[]> {
    const response = await apiClient.get<IQuizHistory[]>("/quizzes/history/me");
    return response.data || [];
  },

  /**
   * Obtém o mapa de subcategorias concluídas pelo usuário agrupadas por categoria.
   */
  async getUserProgress(_userId?: string): Promise<Record<string, string[]>> {
    const response = await apiClient.get<Record<string, string[]>>("/quizzes/progress/me");
    return response.data || {};
  },

  /**
   * Obtém as estatísticas detalhadas de desempenho do usuário.
   */
  async getUserDetailedStats(_userId?: string): Promise<IUserDetailedStats> {
    const response = await apiClient.get<IUserDetailedStats>("/quizzes/stats/me");
    return response.data || {
      totalQuestions: 0,
      accuracyRate: 0,
      activeDays: 0,
      bestScore: 0,
      categoriesProgress: [],
    };
  },

  /**
   * Envia um reporte de incorreção ou sugestão de melhoria para uma questão.
   */
  async reportQuestion(
    questionId: string,
    payload: IQuestionReportPayload
  ): Promise<void> {
    await apiClient.post(`/quizzes/questions/${questionId}/report`, payload);
  },
};
