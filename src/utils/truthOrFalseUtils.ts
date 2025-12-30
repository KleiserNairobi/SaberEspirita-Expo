import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";
import { ITruthOrFalseStats, getDefaultStats } from "@/types/truthOrFalseStats";

/**
 * Calcula as estatísticas do usuário a partir de suas respostas
 */
export function calculateStats(
  responses: IUserTruthOrFalseResponse[]
): ITruthOrFalseStats {
  if (responses.length === 0) {
    return getDefaultStats();
  }

  const stats: ITruthOrFalseStats = {
    totalResponses: responses.length,
    correctAnswers: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTimeSpent: 0,
    byDifficulty: {
      fácil: { total: 0, correct: 0 },
      médio: { total: 0, correct: 0 },
      difícil: { total: 0, correct: 0 },
    },
  };

  // Ordenar por data (mais recente primeiro)
  const sortedResponses = [...responses].sort((a, b) => b.date.localeCompare(a.date));

  // Calcular acertos totais e tempo gasto
  responses.forEach((response) => {
    if (response.isCorrect) {
      stats.correctAnswers++;
    }
    stats.totalTimeSpent += response.timeSpent;
  });

  // Calcular streak atual
  stats.currentStreak = calculateCurrentStreak(sortedResponses);
  stats.longestStreak = calculateLongestStreak(sortedResponses);

  return stats;
}

/**
 * Calcula a sequência atual de dias consecutivos
 */
export function calculateCurrentStreak(
  sortedResponses: IUserTruthOrFalseResponse[]
): number {
  if (sortedResponses.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  for (const response of sortedResponses) {
    const responseDate = new Date(response.date);
    responseDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - responseDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      // Respondeu hoje ou no dia esperado
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diffDays === 1) {
      // Respondeu ontem
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Quebrou a sequência
      break;
    }
  }

  return streak;
}

/**
 * Calcula a maior sequência de dias consecutivos já alcançada
 */
export function calculateLongestStreak(
  sortedResponses: IUserTruthOrFalseResponse[]
): number {
  if (sortedResponses.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 1;

  for (let i = 0; i < sortedResponses.length - 1; i++) {
    const currentDate = new Date(sortedResponses[i].date);
    const nextDate = new Date(sortedResponses[i + 1].date);

    const diffDays = Math.floor(
      (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Dias consecutivos
      currentStreak++;
    } else {
      // Quebrou a sequência
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 1;
    }
  }

  return Math.max(longestStreak, currentStreak);
}

/**
 * Obtém a data atual no formato string (YYYY-MM-DD)
 */
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Calcula o dia do ano (1-365/366)
 */
export function getDayOfYear(): number {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear;
}
