/**
 * Interface para as estatísticas do usuário no Verdade ou Mentira
 */
export interface ITruthOrFalseStats {
  totalResponses: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number;
  byDifficulty: {
    fácil: { total: number; correct: number };
    médio: { total: number; correct: number };
    difícil: { total: number; correct: number };
  };
}

/**
 * Retorna estatísticas padrão zeradas
 */
export function getDefaultStats(): ITruthOrFalseStats {
  return {
    totalResponses: 0,
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
}
