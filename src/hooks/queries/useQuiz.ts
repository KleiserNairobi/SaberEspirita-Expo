import { useQuery } from "@tanstack/react-query";
import {
  getQuiz,
  getCategories,
  getSubcategories,
  getUserProgress,
} from "@/services/firebase/quizService";

// ==================== QUERY KEYS ====================

export const QUIZ_KEYS = {
  all: ["quiz"] as const,
  categories: () => [...QUIZ_KEYS.all, "categories"] as const,
  subcategories: (categoryId: string) =>
    [...QUIZ_KEYS.all, "subcategories", categoryId] as const,
  quiz: (subcategoryId: string) => [...QUIZ_KEYS.all, "quiz", subcategoryId] as const,
  userProgress: (userId: string) => [...QUIZ_KEYS.all, "progress", userId] as const,
};

// ==================== HOOKS ====================

/**
 * Hook para buscar todas as categorias
 */
export function useCategories() {
  return useQuery({
    queryKey: QUIZ_KEYS.categories(),
    queryFn: () => getCategories(),
  });
}

/**
 * Hook para buscar subcategorias de uma categoria
 */
export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.subcategories(categoryId),
    queryFn: () => getSubcategories(categoryId),
    enabled: !!categoryId,
  });
}

/**
 * Hook para buscar um quiz específico
 */
export function useQuiz(subcategoryId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.quiz(subcategoryId),
    queryFn: () => getQuiz(subcategoryId),
    enabled: !!subcategoryId,
  });
}

/**
 * Hook para buscar progresso do usuário
 */
export function useUserQuizProgress(userId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.userProgress(userId),
    queryFn: () => getUserProgress(userId),
    enabled: !!userId,
  });
}
