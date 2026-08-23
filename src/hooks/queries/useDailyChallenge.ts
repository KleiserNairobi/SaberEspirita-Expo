import { useQuery } from "@tanstack/react-query";

import { quizApiService } from "@/services/api/quizApiService";
import { IDailyChallengeStats, IQuiz } from "@/types/quiz";

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

export function useDailyChallengeStatus(userId?: string) {
  return useQuery({
    queryKey: ["dailyQuizStatus", userId],
    queryFn: async () => {
      const history = await quizApiService.getUserQuizHistory();
      const today = new Date().toISOString().split("T")[0];
      return history.some((h) => h.completedAt && String(h.completedAt).startsWith(today));
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

export function useUserStreak(userId?: string) {
  return useQuery({
    queryKey: ["userStreak", userId],
    queryFn: async () => {
      const stats = await quizApiService.getUserDetailedStats();
      return stats.activeDays || 0;
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

export function useDailyChallengeStats(userId?: string) {
  return useQuery<IDailyChallengeStats>({
    queryKey: ["dailyChallengeStats", userId],
    queryFn: async () => {
      const stats = await quizApiService.getUserDetailedStats();
      return {
        currentStreak: stats.activeDays || 0,
        longestStreak: stats.activeDays || 0,
        totalChallenges: stats.totalQuestions || 0,
        bestAccuracy: stats.accuracyRate || 0,
      };
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}
