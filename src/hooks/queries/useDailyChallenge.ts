import { useQuery } from "@tanstack/react-query";
import {
  getDailyChallengeQuestions,
  getDailyChallengeStatus,
  getUserStreak,
  getDailyChallengeStats,
} from "@/services/firebase/quizService";

export function useDailyChallenge(enabled = true) {
  const today = new Date()
    .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
    .split(" ")[0]; // YYYY-MM-DD

  return useQuery({
    queryKey: ["dailyQuiz", today],
    queryFn: getDailyChallengeQuestions,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24h
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    enabled,
  });
}

export function useDailyChallengeStatus(userId?: string) {
  return useQuery({
    queryKey: ["dailyQuizStatus", userId],
    queryFn: () => getDailyChallengeStatus(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 60 * 24, // 24h
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnMount: false,
  });
}

export function useUserStreak(userId?: string) {
  return useQuery({
    queryKey: ["userStreak", userId],
    queryFn: () => getUserStreak(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 60 * 24, // 24h
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnMount: false,
  });
}

export function useDailyChallengeStats(userId?: string) {
  return useQuery({
    queryKey: ["dailyChallengeStats", userId],
    queryFn: () => getDailyChallengeStats(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 60 * 24, // 24h
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnMount: false,
  });
}
