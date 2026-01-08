// Tipos para o módulo FIXE (Quizzes)
// Baseado no projeto CLI: SaberEspirita-Cli/src/models/Quizes.ts

export interface IQuiz {
  id: string;
  idCategory: string;
  idSubcategory: string;
  questions: IQuestion[];
}

export interface IQuestion {
  title: string; // Texto da pergunta
  alternatives: string[]; // Array de alternativas
  correct: number; // Índice da alternativa correta (0-based)
  explanation?: string; // Explicação doutrinária opcional
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
  icon: string; // Nome do ícone Lucide
  gradientColors: [string, string]; // Cores do gradiente
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
