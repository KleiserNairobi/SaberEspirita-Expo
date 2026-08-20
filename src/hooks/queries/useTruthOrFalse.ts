import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TruthOrFalseAnswerPayload,
  truthOrFalseApiService,
} from "@/services/api/truthOrFalseApiService";
import { useAuthStore } from "@/stores/authStore";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";

export const TRUTH_OR_FALSE_KEYS = {
  all: ["truthOrFalse"] as const,
  stats: (userId: string) => ["truthOrFalse", "stats", userId] as const,
  today: (userId: string) => ["truthOrFalse", "today", userId] as const,
  history: (userId: string) => ["truthOrFalse", "history", userId] as const,
  questions: () => ["truthOrFalse", "questions"] as const,
};

/**
 * Hook para buscar os dados principais da home do Verdade ou Mentira.
 */
export function useTruthOrFalseHomeData() {
  const { user } = useAuthStore();
  const userId = user?.uid || "guest";

  return useQuery({
    queryKey: TRUTH_OR_FALSE_KEYS.stats(userId),
    queryFn: () => truthOrFalseApiService.getHomeData(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    enabled: true,
  });
}

/**
 * Hook para buscar o histórico de respostas.
 */
export function useTruthOrFalseHistory(limitCount = 30) {
  const { user } = useAuthStore();
  const userId = user?.uid || "guest";

  return useQuery({
    queryKey: TRUTH_OR_FALSE_KEYS.history(userId),
    queryFn: () => truthOrFalseApiService.getHistory(limitCount),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
  });
}

/**
 * Mutation para salvar a resposta do desafio do dia.
 */
export function useSaveTruthOrFalseResponse() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.uid || "guest";

  return useMutation({
    mutationFn: (payload: Omit<IUserTruthOrFalseResponse, "date">) =>
      truthOrFalseApiService.saveResponse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TRUTH_OR_FALSE_KEYS.stats(userId),
      });
      queryClient.invalidateQueries({
        queryKey: TRUTH_OR_FALSE_KEYS.history(userId),
      });
    },
  });
}

/**
 * Hook para buscar as questões do jogo Verdadeiro ou Falso via API REST.
 */
export function useTruthOrFalseQuestions() {
  return useQuery({
    queryKey: TRUTH_OR_FALSE_KEYS.questions(),
    queryFn: () => truthOrFalseApiService.getQuestions(),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}

/**
 * Mutation para submeter respostas da rodada de Verdadeiro ou Falso via API REST.
 */
export function useSubmitTruthOrFalse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answers: TruthOrFalseAnswerPayload[]) =>
      truthOrFalseApiService.submitAnswers(answers),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TRUTH_OR_FALSE_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["leaderboard"],
      });
    },
  });
}
