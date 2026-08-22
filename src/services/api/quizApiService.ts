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

import apiClient from "./apiClient";

function parseSingleAlternative(item: any): string {
  if (item === null || item === undefined) return "";
  if (typeof item === "string") return item.trim();
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (typeof item === "object") {
    const text =
      item.text ??
      item.label ??
      item.option ??
      item.content ??
      item.title ??
      item.value ??
      item.description ??
      item.statement ??
      item.resposta;

    if (text !== undefined && text !== null) {
      return parseSingleAlternative(text);
    }

    const vals = Object.values(item).filter((v) => typeof v === "string");
    if (vals.length > 0) return String(vals[0]).trim();
  }
  return String(item).trim();
}

function parseAlternatives(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(parseSingleAlternative).filter((s) => s.length > 0);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseAlternatives(parsed);
      } catch {
        // Fallthrough
      }
    }
    if (trimmed.includes(";") || trimmed.includes(",")) {
      const sep = trimmed.includes(";") ? ";" : ",";
      return trimmed
        .split(sep)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return [trimmed];
  }
  if (typeof raw === "object" && raw !== null) {
    const values = Object.values(raw);
    if (values.length > 0) {
      return values.map(parseSingleAlternative).filter((s) => s.length > 0);
    }
  }
  return [];
}

export function extractQuestionAlternatives(q: any): string[] {
  if (!q) return [];
  if (typeof q === "string") {
    try {
      const parsed = JSON.parse(q);
      return extractQuestionAlternatives(parsed);
    } catch {
      return [];
    }
  }

  const candidates = [
    q.alternativesJson,
    q.alternatives_json,
    q.alternatives,
    q.options,
    q.choices,
    q.answers,
    q.alternativas,
    q.respostas,
    q.items,
    q.optionList,
    q.alternativeList,
    q.options_list,
    q.alternatives_list,
    q.answer_options,
    q.question_options,
    q.data?.alternativesJson,
    q.data?.alternatives,
    q.data?.options,
    q.payload?.alternativesJson,
    q.payload?.alternatives,
    q.payload?.options,
    q.attributes?.alternativesJson,
    q.attributes?.alternatives,
    q.attributes?.options,
  ];

  for (const candidate of candidates) {
    const result = parseAlternatives(candidate);
    if (result.length > 0) {
      return result;
    }
  }

  return [];
}

export function normalizeQuestion(q: any): any {
  if (!q) {
    return {
      title: "",
      alternatives: [],
      correct: 0,
      explanation: "",
    };
  }

  const alternatives = extractQuestionAlternatives(q);

  const correct =
    typeof q?.correct === "number"
      ? q.correct
      : typeof q?.correctIndex === "number"
      ? q.correctIndex
      : typeof q?.correctAnswerIndex === "number"
      ? q.correctAnswerIndex
      : typeof q?.correct_index === "number"
      ? q.correct_index
      : typeof q?.answerIndex === "number"
      ? q.answerIndex
      : 0;

  return {
    ...q,
    title: q?.title || q?.question || q?.questionText || q?.prompt || "",
    alternatives,
    correct,
    explanation: q?.explanation || "",
  };
}

export function normalizeQuiz(raw: any): IQuiz | null {
  if (!raw) return null;

  // Se raw for embrulhado em data ou quiz
  const target = raw.data || raw.quiz || raw;

  const rawQuestions = Array.isArray(target)
    ? target
    : Array.isArray(target.questions)
    ? target.questions
    : Array.isArray(target.items)
    ? target.items
    : Array.isArray(target.exercicios)
    ? target.exercicios
    : Array.isArray(target.questionsList)
    ? target.questionsList
    : [];

  return {
    ...target,
    questions: rawQuestions.map(normalizeQuestion),
  };
}

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
    return (response.data || []).map((q) => normalizeQuiz(q)!);
  },

  /**
   * Obtém um quiz específico por quizId ou subcategoryId.
   */
  async getQuizById(quizId: string): Promise<IQuiz | null> {
    if (!quizId) return null;
    const response = await apiClient.get<IQuiz>(`/quizzes/${quizId}`);
    return normalizeQuiz(response.data);
  },

  /**
   * Obtém o quiz diário para o dia atual.
   */
  async getDailyQuiz(): Promise<IQuiz | null> {
    const response = await apiClient.get<IQuiz>("/quizzes/daily");
    return normalizeQuiz(response.data);
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
    const response =
      await apiClient.get<Record<string, string[]>>("/quizzes/progress/me");
    return response.data || {};
  },

  /**
   * Obtém as estatísticas detalhadas de desempenho do usuário.
   */
  async getUserDetailedStats(_userId?: string): Promise<IUserDetailedStats> {
    const response = await apiClient.get<IUserDetailedStats>("/quizzes/stats/me");
    return (
      response.data || {
        totalQuestions: 0,
        accuracyRate: 0,
        activeDays: 0,
        bestScore: 0,
        categoriesProgress: [],
      }
    );
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
