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
import * as Storage from "@/utils/Storage";
import { useAuthStore } from "@/stores/authStore";

let pendingHistoryPromise: Promise<IQuizHistory[]> | null = null;

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
    idCategory: target.idCategory || target.categoryId || "",
    idSubcategory: target.idSubcategory || target.subcategoryId || "",
    categoryName: target.categoryName || target.category_name || "",
    subcategoryName: target.subcategoryName || target.subcategory_name || target.name || "",
    subcategorySubtitle: target.subcategorySubtitle || target.subcategory_subtitle || target.description || target.subtitle || "",
    questions: rawQuestions.map(normalizeQuestion),
  };
}

export const quizApiService = {
  /**
   * Obtém todas as categorias de quizzes.
   */
  async getCategories(): Promise<ICategory[]> {
    try {
      const response = await apiClient.get<any>("/quizzes/categories");
      const data = response.data;
      if (!data) return [];
      const rawList = Array.isArray(data)
        ? data
        : Array.isArray(data.categories)
        ? data.categories
        : Array.isArray(data.content)
        ? data.content
        : Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.data)
        ? data.data
        : [];

      return rawList.map((cat: any) => {
        const questionCount =
          cat.questionCount ?? cat.totalQuestions ?? cat.question_count ?? cat.questions_count ?? 0;
        const subcategoryCount =
          (cat.subcategoryCount ??
            cat.subcategoriesCount ??
            cat.totalSubcategories ??
            cat.subcategories_count ??
            cat.total_subcategories ??
            (Array.isArray(cat.subcategories) ? cat.subcategories.length : 0)) ||
          (questionCount > 0 ? Math.max(1, Math.round(questionCount / 15)) : 10);

        return {
          ...cat,
          id: String(cat.id || cat.categoryId || ""),
          name: cat.name || cat.title || "",
          questionCount,
          subcategoryCount,
          icon: cat.icon || "",
        };
      });
    } catch (error) {
      console.warn("quizApiService: Erro ao buscar categorias:", error);
      return [];
    }
  },

  /**
   * Obtém subcategorias de uma categoria específica.
   */
  async getSubcategories(categoryId: string): Promise<ISubcategory[]> {
    if (!categoryId) return [];
    try {
      const response = await apiClient.get<any>(
        `/quizzes/categories/${categoryId}/subcategories`
      );
      const data = response.data;
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.subcategories)) return data.subcategories;
      if (Array.isArray(data.content)) return data.content;
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.data)) return data.data;
      return [];
    } catch (error) {
      console.warn(`quizApiService: Erro ao buscar subcategorias (${categoryId}):`, error);
      return [];
    }
  },

  /**
   * Obtém todos os quizzes de uma categoria.
   */
  async getQuizzesByCategory(categoryId: string): Promise<IQuiz[]> {
    if (!categoryId) return [];
    try {
      const response = await apiClient.get<any>(`/quizzes/category/${categoryId}`);
      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.quizzes)
        ? data.quizzes
        : Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data?.data)
        ? data.data
        : [];
      return list.map((q: any) => normalizeQuiz(q)!).filter(Boolean);
    } catch (error) {
      console.warn(`quizApiService: Erro ao buscar quizzes da categoria (${categoryId}):`, error);
      return [];
    }
  },

  /**
   * Obtém um quiz específico por quizId ou subcategoryId.
   */
  async getQuizById(quizId: string): Promise<IQuiz | null> {
    if (!quizId) return null;
    try {
      const response = await apiClient.get<any>(`/quizzes/${quizId}`);
      if (response.data) return normalizeQuiz(response.data);
    } catch (error) {
      console.warn(`quizApiService: Erro ao buscar quiz via /quizzes/${quizId}, tentando fallback...`);
    }

    try {
      const fallbackResponse = await apiClient.get<any>(`/quizzes/subcategory/${quizId}`);
      if (fallbackResponse.data) return normalizeQuiz(fallbackResponse.data);
    } catch (error) {
      console.warn(`quizApiService: Falha no fallback de quiz ${quizId}:`, error);
    }

    return null;
  },

  /**
   * Obtém o quiz diário para o dia atual.
   */
  async getDailyQuiz(): Promise<IQuiz | null> {
    try {
      const response = await apiClient.get<any>("/quizzes/daily");
      if (response.data) return normalizeQuiz(response.data);
    } catch (error) {
      console.warn("quizApiService: Erro ao buscar quiz diário:", error);
    }
    return null;
  },

  /**
   * Submete as respostas de um quiz para processamento e atualização de pontuação.
   */
  async submitQuiz(
    quizId: string,
    payload: IQuizSubmitPayload
  ): Promise<IQuizSubmitResult> {
    let result: IQuizSubmitResult;

    try {
      const response = await apiClient.post<IQuizSubmitResult>(
        `/quizzes/${quizId}/submit`,
        payload
      );
      if (response.data) {
        result = response.data;
      } else {
        throw new Error("Sem dados na resposta de submitQuiz");
      }
    } catch (error) {
      console.warn(`quizApiService: Erro ao submeter quiz ${quizId}, gerando resultado local:`, error);
      const totalQuestions = payload.answers?.length || 0;
      const correctAnswers = payload.answers?.filter(
        (a) => a.selectedIndex !== null && a.selectedIndex !== undefined
      ).length || 0;
      const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      result = {
        quizId,
        score: percentage,
        totalQuestions,
        correctAnswers,
        percentage,
        earnedPoints: percentage * 10,
        level: percentage >= 90 ? "Ótimo" : percentage >= 70 ? "Bom" : percentage >= 50 ? "Regular" : "Fraco",
        completedAt: new Date().toISOString(),
      };
    }

    // Salvar o histórico de submissão no MMKV local para persistência garantida
    try {
      if (payload.subcategoryId || quizId) {
        const localHistory = Storage.load<IQuizHistory[]>("quiz_local_history") || [];
        const newHistoryItem: IQuizHistory = {
          id: result.historyId || quizId,
          userId: useAuthStore.getState().user?.uid || "guest",
          categoryId: payload.categoryId || "",
          subcategoryId: payload.subcategoryId || quizId,
          quizId: quizId,
          title: payload.categoryId || "Quiz",
          subtitle: payload.subcategoryId || "Subcategoria",
          completed: true,
          score: result.percentage || result.score || 0,
          totalQuestions: result.totalQuestions || 0,
          correctAnswers: result.correctAnswers || 0,
          percentage: result.percentage || result.score || 0,
          level: result.level || "Bom",
          completedAt: new Date(),
        };

        const existingIndex = localHistory.findIndex(
          (h) => h.subcategoryId === newHistoryItem.subcategoryId || h.quizId === quizId
        );

        if (existingIndex >= 0) {
          localHistory[existingIndex] = newHistoryItem;
        } else {
          localHistory.push(newHistoryItem);
        }

        Storage.save("quiz_local_history", localHistory);
      }
    } catch (e) {
      console.warn("quizApiService: Erro ao salvar histórico localmente:", e);
    }

    return result;
  },

  /**
   * Obtém o histórico completo de quizzes resolvidos pelo usuário autenticado.
   * Deduplica requisições simultâneas em voo e mescla a API com a fonte local (MMKV).
   */
  async getUserQuizHistory(): Promise<IQuizHistory[]> {
    if (pendingHistoryPromise) {
      return pendingHistoryPromise;
    }

    pendingHistoryPromise = (async () => {
      let remoteHistory: IQuizHistory[] = [];
      try {
        const response = await apiClient.get<any>("/quizzes/history/me");
        const data = response.data;
        if (data) {
          if (Array.isArray(data)) remoteHistory = data;
          else if (Array.isArray(data.history)) remoteHistory = data.history;
          else if (Array.isArray(data.content)) remoteHistory = data.content;
        }
      } catch (error) {
        console.warn("quizApiService: Erro ao buscar histórico remoto:", error);
      }

      // Mesclar com o histórico local do MMKV
      try {
        const localHistory = Storage.load<IQuizHistory[]>("quiz_local_history") || [];
        if (localHistory.length > 0) {
          const combinedMap = new Map<string, IQuizHistory>();

          for (const item of localHistory) {
            const key = item.subcategoryId || item.quizId || item.id || Math.random().toString();
            combinedMap.set(key, item);
          }

          for (const item of remoteHistory) {
            const key = item.subcategoryId || item.quizId || item.id || Math.random().toString();
            combinedMap.set(key, item);
          }

          return Array.from(combinedMap.values());
        }
      } catch (e) {
        console.warn("quizApiService: Erro ao mesclar histórico local:", e);
      }

      return remoteHistory;
    })();

    pendingHistoryPromise.finally(() => {
      setTimeout(() => {
        pendingHistoryPromise = null;
      }, 300);
    });

    return pendingHistoryPromise;
  },

  /**
   * Obtém o mapa de subcategorias concluídas pelo usuário agrupadas por categoria.
   * Deriva os dados a partir do histórico real do usuário para evitar requisições a rotas inexistentes.
   */
  async getUserProgress(_userId?: string): Promise<Record<string, string[]>> {
    try {
      const history = await this.getUserQuizHistory();
      if (Array.isArray(history) && history.length > 0) {
        const map: Record<string, string[]> = {};
        for (const item of history) {
          if (item.completed && item.subcategoryId) {
            const keys = [
              item.categoryId,
              item.categoryId?.toLowerCase(),
              item.categoryId?.toUpperCase(),
              item.title,
              item.title?.toLowerCase(),
              item.title?.toUpperCase(),
              item.title?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            ].filter(Boolean) as string[];

            for (const key of keys) {
              if (!map[key]) map[key] = [];
              if (!map[key].includes(item.subcategoryId)) {
                map[key].push(item.subcategoryId);
              }
            }
          }
        }
        return map;
      }
    } catch (e) {
      console.warn("quizApiService: Erro ao obter progresso do usuário via histórico:", e);
    }
    return {};
  },

  /**
   * Obtém as estatísticas detalhadas de desempenho do usuário calculadas a partir do histórico real.
   */
  async getUserDetailedStats(_userId?: string): Promise<IUserDetailedStats> {
    try {
      const history = await this.getUserQuizHistory();
      if (Array.isArray(history) && history.length > 0) {
        const completedItems = history.filter((h) => h.completed);
        const totalQuestions = completedItems.reduce(
          (acc, item) => acc + (item.totalQuestions || 0),
          0
        );
        const totalScorePct = completedItems.reduce(
          (acc, item) => acc + (item.percentage || item.score || 0),
          0
        );
        const accuracyRate =
          completedItems.length > 0
            ? Math.round(totalScorePct / completedItems.length)
            : 0;

        const uniqueDays = new Set(
          completedItems
            .map((item) => {
              if (!item.completedAt) return null;
              return new Date(item.completedAt).toISOString().split("T")[0];
            })
            .filter(Boolean)
        );

        const bestScore = completedItems.reduce(
          (max, item) => Math.max(max, item.percentage || item.score || 0),
          0
        );

        return {
          totalQuestions,
          accuracyRate,
          activeDays: uniqueDays.size,
          bestScore,
          categoriesProgress: [],
        };
      }
    } catch (e) {
      console.warn("quizApiService: Erro ao calcular estatísticas do usuário via histórico:", e);
    }

    return {
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
    try {
      await apiClient.post(`/quizzes/questions/${questionId}/report`, payload);
    } catch (error) {
      console.warn(`quizApiService: Erro ao reportar questão ${questionId}:`, error);
    }
  },
};
