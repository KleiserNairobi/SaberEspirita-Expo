import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { TruthOrFalseService } from "@/services/firebase/truthOrFalseService";
import { ITruthOrFalseStats } from "@/types/truthOrFalseStats";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";

export const TRUTH_OR_FALSE_KEYS = {
  all: ["truthOrFalse"] as const,
  stats: (userId: string) => ["truthOrFalse", "stats", userId] as const,
  today: (userId: string) => ["truthOrFalse", "today", userId] as const,
  history: (userId: string) => ["truthOrFalse", "history", userId] as const,
};

export interface TruthOrFalseHomeData {
  hasAnswered: boolean;
  todayResponse: IUserTruthOrFalseResponse | null;
  stats: ITruthOrFalseStats;
}

/**
 * Hook para buscar os dados principais da home do Verdade ou Mentira
 * (Respondeu hoje + Estatísticas do Usuário)
 */
export function useTruthOrFalseHomeData() {
  const { user } = useAuthStore();
  const userId = user?.uid || "guest";

  return useQuery({
    queryKey: TRUTH_OR_FALSE_KEYS.stats(userId),
    queryFn: async (): Promise<TruthOrFalseHomeData> => {
      const [todayResponse, stats] = await Promise.all([
        TruthOrFalseService.getTodayResponse(),
        TruthOrFalseService.getStats(),
      ]);

      return {
        hasAnswered: todayResponse !== null,
        todayResponse,
        stats,
      };
    },
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    enabled: true,
  });
}

/**
 * Hook para buscar o histórico de respostas
 */
export function useTruthOrFalseHistory(limitCount = 30) {
  const { user } = useAuthStore();
  const userId = user?.uid || "guest";

  return useQuery({
    queryKey: TRUTH_OR_FALSE_KEYS.history(userId),
    queryFn: () => TruthOrFalseService.getHistory(limitCount),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
  });
}

/**
 * Mutation para salvar a resposta do desafio do dia
 */
export function useSaveTruthOrFalseResponse() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.uid || "guest";

  return useMutation({
    mutationFn: (response: Omit<IUserTruthOrFalseResponse, "date">) =>
      TruthOrFalseService.saveResponse(response),
    onSuccess: () => {
      // Invalida os dados da home do Verdade ou Mentira
      queryClient.invalidateQueries({
        queryKey: TRUTH_OR_FALSE_KEYS.stats(userId),
      });
      // Invalida o histórico
      queryClient.invalidateQueries({
        queryKey: TRUTH_OR_FALSE_KEYS.history(userId),
      });
    },
  });
}
