import { useQuery } from "@tanstack/react-query";

import { quizApiService } from "@/services/api/quizApiService";
import { IDailyChallengeStats, IQuiz } from "@/types/quiz";

export interface IDailyChallengeHomeData {
  isCompletedToday: boolean;
  stats: IDailyChallengeStats;
}

/**
 * Hook consolidado para a Home do Desafio Diário (retorna status + estatísticas em 1 única query/chamada).
 */
export function useDailyChallengeHome(userId?: string) {
  return useQuery<IDailyChallengeHomeData>({
    queryKey: ["dailyChallengeHome", userId],
    queryFn: async () => {
      if (!userId || userId === "guest") {
        return {
          isCompletedToday: false,
          stats: {
            currentStreak: 0,
            longestStreak: 0,
            totalChallenges: 0,
            bestAccuracy: 0,
          },
        };
      }
      const res = await quizApiService.getDailyChallengeStats();
      return {
        isCompletedToday: res.isCompletedToday,
        stats: {
          currentStreak: res.currentStreak,
          longestStreak: res.longestStreak,
          totalChallenges: res.totalChallenges,
          bestAccuracy: res.bestAccuracy,
        },
      };
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

/**
 * Hook para obter o quiz do desafio diário.
 */
export function useDailyChallenge(enabled = true) {
  const today = new Date()
    .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
    .split(" ")[0]; // YYYY-MM-DD

  return useQuery<IQuiz | null>({
    queryKey: ["dailyQuiz", today],
    queryFn: () => quizApiService.getDailyQuiz(),
    staleTime: 1000 * 60 * 60 * 24, // Cache por 24h
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    enabled,
  });
}

/**
 * Hook para obter o status de conclusão do desafio diário de hoje.
 */
export function useDailyChallengeStatus(userId?: string) {
  const { data } = useDailyChallengeHome(userId);
  return { data: data?.isCompletedToday ?? false };
}

/**
 * Hook para obter a sequência atual de desafios diários do usuário.
 */
export function useUserStreak(userId?: string) {
  const { data } = useDailyChallengeHome(userId);
  return { data: data?.stats.currentStreak ?? 0 };
}

/**
 * Hook para obter as estatísticas do Desafio Diário.
 */
export function useDailyChallengeStats(userId?: string) {
  const query = useDailyChallengeHome(userId);
  return {
    ...query,
    data: query.data?.stats,
  };
}
