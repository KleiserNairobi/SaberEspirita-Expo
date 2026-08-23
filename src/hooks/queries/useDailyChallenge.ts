import { useQuery } from "@tanstack/react-query";

import { quizApiService } from "@/services/api/quizApiService";
import { IDailyChallengeStats, IQuiz, IQuizHistory } from "@/types/quiz";

/**
 * Filtra se um item de histórico é estritamente do Desafio Diário.
 */
function isDailyChallenge(item: IQuizHistory): boolean {
  if (!item) return false;
  const categoryId = item.categoryId?.toUpperCase() || "";
  const subcategoryId = item.subcategoryId?.toUpperCase() || "";
  return categoryId === "DAILY" || subcategoryId.startsWith("DAILY");
}

/**
 * Calcula sequências consecutivas (streak) baseadas estritamente nas datas dos desafios diários.
 */
function calculateDailyStreaks(dailyHistory: IQuizHistory[]) {
  if (!dailyHistory || dailyHistory.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Extrai datas únicas (YYYY-MM-DD) dos desafios diários concluídos
  const dates = Array.from(
    new Set(
      dailyHistory
        .map((h) => {
          if (h.subcategoryId && h.subcategoryId.startsWith("DAILY_")) {
            return h.subcategoryId.replace("DAILY_", "");
          }
          if (!h.completedAt) return null;
          return new Date(h.completedAt).toISOString().split("T")[0];
        })
        .filter((d): d is string => Boolean(d))
    )
  ).sort();

  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Calcula maior sequência (longestStreak)
  let longestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diffDays = Math.round(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays === 1) {
      currentRun++;
      if (currentRun > longestStreak) {
        longestStreak = currentRun;
      }
    } else if (diffDays > 1) {
      currentRun = 1;
    }
  }

  // Calcula sequência atual (currentStreak)
  const todayStr = new Date()
    .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
    .split(" ")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate
    .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
    .split(" ")[0];

  const lastDate = dates[dates.length - 1];
  let currentStreak = 0;

  if (lastDate === todayStr || lastDate === yesterdayStr) {
    currentStreak = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      const curr = new Date(dates[i + 1]);
      const prev = new Date(dates[i]);
      const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
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
  return useQuery({
    queryKey: ["dailyQuizStatus", userId],
    queryFn: async () => {
      const history = await quizApiService.getUserQuizHistory();
      const dailyHistory = history.filter(isDailyChallenge);
      const todayLocal = new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .split(" ")[0];

      return dailyHistory.some((h) => {
        if (h.subcategoryId === `DAILY_${todayLocal}`) return true;
        if (!h.completedAt) return false;
        const dateStr = new Date(h.completedAt)
          .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
          .split(" ")[0];
        return dateStr === todayLocal;
      });
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

/**
 * Hook para obter a sequência atual de desafios diários do usuário.
 */
export function useUserStreak(userId?: string) {
  return useQuery({
    queryKey: ["userStreak", userId],
    queryFn: async () => {
      const history = await quizApiService.getUserQuizHistory();
      const dailyHistory = history.filter(isDailyChallenge);
      const { currentStreak } = calculateDailyStreaks(dailyHistory);
      return currentStreak;
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}

/**
 * Hook para obter as estatísticas calculadas estritamente do Desafio Diário.
 */
export function useDailyChallengeStats(userId?: string) {
  return useQuery<IDailyChallengeStats>({
    queryKey: ["dailyChallengeStats", userId],
    queryFn: async () => {
      const history = await quizApiService.getUserQuizHistory();
      const dailyHistory = history.filter(isDailyChallenge);
      const { currentStreak, longestStreak } = calculateDailyStreaks(dailyHistory);

      const totalChallenges = dailyHistory.length;
      const bestAccuracy = dailyHistory.reduce(
        (max, h) => Math.max(max, h.percentage || h.score || 0),
        0
      );

      return {
        currentStreak,
        longestStreak,
        totalChallenges,
        bestAccuracy,
      };
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });
}
