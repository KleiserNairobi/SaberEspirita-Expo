import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizApiService } from "@/services/api/quizApiService";
import { IQuestionReportPayload, IQuizSubmitPayload } from "@/types/quiz";

// ==================== QUERY KEYS ====================

export const QUIZ_KEYS = {
  all: ["quiz"] as const,
  categories: () => [...QUIZ_KEYS.all, "categories"] as const,
  subcategories: (categoryId: string) =>
    [...QUIZ_KEYS.all, "subcategories", categoryId] as const,
  quiz: (subcategoryId: string) => [...QUIZ_KEYS.all, "quiz", subcategoryId] as const,
  userProgress: (userId: string) => [...QUIZ_KEYS.all, "progress", userId] as const,
  detailedStats: (userId: string) => [...QUIZ_KEYS.all, "detailed-stats", userId] as const,
  history: () => [...QUIZ_KEYS.all, "history"] as const,
};

// ==================== HOOKS ====================

/**
 * Hook para buscar todas as categorias de quizzes via API REST.
 */
export function useCategories() {
  return useQuery({
    queryKey: QUIZ_KEYS.categories(),
    queryFn: () => quizApiService.getCategories(),
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Hook para buscar subcategorias de uma categoria específica via API REST.
 */
export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.subcategories(categoryId),
    queryFn: () => quizApiService.getSubcategories(categoryId),
    enabled: !!categoryId,
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Hook para buscar um quiz específico por ID/subcategoria via API REST.
 */
export function useQuiz(quizId: string, enabled = true) {
  return useQuery({
    queryKey: QUIZ_KEYS.quiz(quizId),
    queryFn: () => quizApiService.getQuizById(quizId),
    enabled: !!quizId && enabled,
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Hook para buscar o progresso do usuário por categoria (Home de Fixe) via API REST.
 */
export function useUserQuizProgress(userId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.userProgress(userId),
    queryFn: () => quizApiService.getUserProgress(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Hook para buscar estatísticas detalhadas do usuário (Meu Desempenho) via API REST.
 */
export function useUserDetailedStats(userId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.detailedStats(userId),
    queryFn: () => quizApiService.getUserDetailedStats(userId),
    enabled: !!userId && userId !== "guest",
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Hook para buscar o histórico de quizzes concluídos do usuário via API REST.
 */
export function useQuizHistory() {
  return useQuery({
    queryKey: QUIZ_KEYS.history(),
    queryFn: () => quizApiService.getUserQuizHistory(),
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Hook de mutação para submeter o resultado de um quiz via API REST.
 * Atualiza sincronizadamente o histórico e o ranking/leaderboard do usuário.
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      payload,
    }: {
      quizId: string;
      payload: IQuizSubmitPayload;
    }) => quizApiService.submitQuiz(quizId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.history() });
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["user-scores"] });
    },
  });
}

/**
 * Hook de mutação para reportar erro em uma questão via API REST.
 */
export function useReportQuestion() {
  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: string;
      payload: IQuestionReportPayload;
    }) => quizApiService.reportQuestion(questionId, payload),
  });
}
