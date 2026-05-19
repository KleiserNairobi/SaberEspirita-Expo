// Tipos para o módulo FIXE (Quizzes)
// Baseado no projeto CLI: SaberEspirita-Cli/src/models/Quizes.ts

export interface IQuiz {
  id: string;
  idCategory: string;
  idSubcategory: string;
  questions: IQuestion[];
}

export interface IDailyChallengeStats {
  currentStreak: number;   // sequência atual de dias consecutivos
  longestStreak: number;   // maior sequência já alcançada
  totalChallenges: number; // total de desafios concluídos
  bestAccuracy: number;    // maior % de acerto em um único desafio (0-100)
}

/**
 * Interface que representa o progresso do usuário em uma categoria específica
 */
export interface ICategoryProgress {
  categoryId: string;
  categoryName: string;
  totalQuestionsAnswered: number;
  completionPercentage: number; // Porcentagem de subcategorias concluídas (0-100)
  icon: string; // Nome do ícone da Lucide
}

/**
 * Interface que consolida todas as estatísticas de desempenho do usuário
 */
export interface IUserDetailedStats {
  totalQuestions: number;
  accuracyRate: number; // Porcentagem geral de acertos (0-100)
  activeDays: number; // Quantidade de dias únicos com atividade
  bestScore: number; // Melhor pontuação obtida em um quiz
  categoriesProgress: ICategoryProgress[];
}

export interface IQuestion {
  title: string; // Texto da pergunta
  alternatives: string[]; // Array de alternativas
  correct: number; // Índice da alternativa correta (0-based)
  explanation?: string; // Explicação doutrinária opcional
  originCategory?: string; // Para desafios diários: Categoria de origem
  originSubcategory?: string; // Para desafios diários: Nome da subcategoria de origem
  originSubcategorySubtitle?: string; // Para desafios diários: Subtítulo/descrição da subcategoria de origem
}

// Resposta do usuário (baseado em IUserAnswer do CLI)
export interface IQuizAnswer {
  question: string;
  alternatives: string[];
  correctAnswerIndex: number;
  selectedAnswerIndex: number | null; // null se pulou a questão
  explanation?: string;
}

// Histórico de quiz do usuário
export interface IQuizHistory {
  id?: string;
  userId: string;
  categoryId: string;
  subcategoryId: string;
  quizId: string;
  title: string; // Nome da categoria
  subtitle: string; // Nome da subcategoria
  completed: boolean;
  score: number; // Percentual (0-100)
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  level: "Ótimo" | "Bom" | "Regular" | "Fraco";
  completedAt: Date;
}

// Categoria de quiz
export interface ICategory {
  id: string;
  name: string;
  description?: string;
  questionCount: number;
  subcategoryCount?: number; // Total de subcategorias (do Firestore)
  icon: string; // Nome do ícone Lucide
}

// Subcategoria de quiz
export interface ISubcategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  questionCount: number;
  completed?: boolean; // Se o usuário já completou
}
