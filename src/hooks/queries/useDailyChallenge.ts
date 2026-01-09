import { useQuery } from "@tanstack/react-query";
import {
  getDailyChallengeQuestions,
  getDailyChallengeStatus,
  getUserStreak,
} from "@/services/firebase/quizService";

export function useDailyChallenge() {
  return useQuery({
    queryKey: ["dailyQuiz"],
    queryFn: getDailyChallengeQuestions,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24h
    gcTime: 1000 * 60 * 60 * 24,
  });
}

export function useDailyChallengeStatus(userId?: string) {
  return useQuery({
    queryKey: ["dailyQuizStatus", userId],
    queryFn: () => getDailyChallengeStatus(userId!),
    enabled: !!userId,
  });
}

export function useUserStreak(userId?: string) {
  return useQuery({
    queryKey: ["userStreak", userId],
    queryFn: () => getUserStreak(userId!),
    enabled: !!userId,
  });
}
