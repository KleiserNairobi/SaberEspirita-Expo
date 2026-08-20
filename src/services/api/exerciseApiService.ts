import apiClient from "./apiClient";
import {
  IExercise,
  IExerciseAttempt,
  IExerciseSubmissionResult,
  ISubmitExercisePayload,
} from "@/types/course";

export const exerciseApiService = {
  /**
   * Obtém todos os exercícios associados a uma aula por lessonId.
   */
  async getExercisesByLesson(lessonId: string): Promise<IExercise[]> {
    if (!lessonId) return [];
    const response = await apiClient.get<IExercise[]>(`/exercises/lesson/${lessonId}`);
    return response.data || [];
  },

  /**
   * Obtém todos os exercícios associados a um curso por courseId.
   */
  async getExercisesByCourse(courseId: string): Promise<IExercise[]> {
    if (!courseId) return [];
    const response = await apiClient.get<IExercise[]>(`/exercises/course/${courseId}`);
    return response.data || [];
  },

  /**
   * Obtém os detalhes de um exercício específico por exerciseId.
   */
  async getExerciseDetails(exerciseId: string): Promise<IExercise | null> {
    if (!exerciseId) return null;
    const response = await apiClient.get<IExercise>(`/exercises/${exerciseId}`);
    return response.data || null;
  },

  /**
   * Submete as respostas de um exercício para avaliação backend.
   */
  async submitExercise(
    exerciseId: string,
    payload: ISubmitExercisePayload
  ): Promise<IExerciseSubmissionResult> {
    const response = await apiClient.post<IExerciseSubmissionResult>(
      `/exercises/${exerciseId}/submit`,
      payload
    );
    return response.data;
  },

  /**
   * Obtém o histórico de tentativas do usuário para um determinado exercício.
   */
  async getExerciseAttempts(exerciseId: string): Promise<IExerciseAttempt[]> {
    if (!exerciseId) return [];
    const response = await apiClient.get<IExerciseAttempt[]>(
      `/exercises/${exerciseId}/attempts`
    );
    return response.data || [];
  },
};
