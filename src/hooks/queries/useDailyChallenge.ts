import { useQuery } from "@tanstack/react-query";

import { quizApiService } from "@/services/api/quizApiService";
import { IDailyChallengeStats, IQuiz } from "@/types/quiz";

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
 * Hook para obter o status de conclusão do desafio diário de hoje via endpoint dedicado.
 */
export function useDailyChallengeStatus(userId?: string) {
  return useQuery({
    queryKey: ["dailyQuizStatus", userId],
    queryFn: async () => {
      if (!userId || userId === "guest") return false;
      const res = await quizApiService.getDailyChallengeStats();
      return res.isCompletedToday;
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

/**
 * Hook para obter a sequência atual de desafios diários do usuário via endpoint dedicado.
 */
export function useUserStreak(userId?: string) {
  return useQuery({
    queryKey: ["userStreak", userId],
    queryFn: async () => {
      if (!userId || userId === "guest") return 0;
      const res = await quizApiService.getDailyChallengeStats();
      return res.currentStreak;
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

/**
 * Hook para obter as estatísticas do Desafio Diário via endpoint dedicado REST (/quizzes/daily/stats).
 */
export function useDailyChallengeStats(userId?: string) {
  return useQuery<IDailyChallengeStats>({
    queryKey: ["dailyChallengeStats", userId],
    queryFn: async () => {
      if (!userId || userId === "guest") {
        return {
          currentStreak: 0,
          longestStreak: 0,
          totalChallenges: 0,
          bestAccuracy: 0,
        };
      }
      const res = await quizApiService.getDailyChallengeStats();
      return {
        currentStreak: res.currentStreak,
        longestStreak: res.longestStreak,
        totalChallenges: res.totalChallenges,
        bestAccuracy: res.bestAccuracy,
      };
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}
