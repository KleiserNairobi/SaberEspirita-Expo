import apiClient from "./apiClient";
import { ITruthOrFalseQuestion } from "@/types/truthOrFalse";
import { ITruthOrFalseStats } from "@/types/truthOrFalseStats";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";

export interface TruthOrFalseAnswerPayload {
  questionId: string;
  selectedAnswer: boolean;
}

export interface TruthOrFalseSubmitResult {
  score: number;
  totalQuestions: number;
  correctCount: number;
  earnedPoints: number;
}

export interface TruthOrFalseHomeData {
  hasAnswered: boolean;
  stats: ITruthOrFalseStats;
}

export const truthOrFalseApiService = {
  /**
   * Obtém o conjunto de questões do jogo Verdadeiro ou Falso.
   */
  async getQuestions(): Promise<ITruthOrFalseQuestion[]> {
    const response = await apiClient.get<ITruthOrFalseQuestion[]>(
      "/truth-or-false/questions"
    );
    return response.data || [];
  },

  /**
   * Submete o conjunto de respostas da rodada de Verdadeiro ou Falso.
   */
  async submitAnswers(
    answers: TruthOrFalseAnswerPayload[]
  ): Promise<TruthOrFalseSubmitResult> {
    const response = await apiClient.post<TruthOrFalseSubmitResult>(
      "/truth-or-false/submit",
      { answers }
    );
    return response.data;
  },

  /**
   * Obtém dados da Home do Verdadeiro ou Falso (estatísticas).
   */
  async getHomeData(): Promise<TruthOrFalseHomeData> {
    const response = await apiClient.get<any>(
      "/truth-or-false/home"
    );
    const rawData = response.data;
    const rawStats = rawData?.stats || {};
    return {
      hasAnswered: Boolean(rawData?.hasAnswered),
      stats: {
        totalResponses: rawStats.totalResponses ?? rawStats.totalAnswered ?? 0,
        correctAnswers: rawStats.correctAnswers ?? 0,
        currentStreak: rawStats.currentStreak ?? 0,
        longestStreak: rawStats.longestStreak ?? rawStats.bestStreak ?? 0,
        totalTimeSpent: rawStats.totalTimeSpent ?? 0,
        byDifficulty: rawStats.byDifficulty ?? {
          fácil: { total: 0, correct: 0 },
          médio: { total: 0, correct: 0 },
          difícil: { total: 0, correct: 0 },
        },
      },
    };
  },

  /**
   * Obtém o histórico de respostas do usuário.
   */
  async getHistory(limitCount = 30): Promise<IUserTruthOrFalseResponse[]> {
    const response = await apiClient.get<IUserTruthOrFalseResponse[]>(
      "/truth-or-false/history",
      { params: { limit: limitCount } }
    );
    return response.data || [];
  },

  /**
   * Salva a resposta do desafio do dia.
   */
  async saveResponse(
    payload: Omit<IUserTruthOrFalseResponse, "date">
  ): Promise<IUserTruthOrFalseResponse> {
    const dto = {
      questionId: payload.questionId,
      userAnswer: payload.userAnswer,
      timeSpent: payload.timeSpent || 0,
      saveToLibrary: payload.savedToLibrary || false,
    };
    const response = await apiClient.post<IUserTruthOrFalseResponse>(
      "/truth-or-false/response",
      dto
    );
    return response.data;
  },
};
