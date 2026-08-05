import { useQuery } from "@tanstack/react-query";
import {
  getQuiz,
  getCategories,
  getSubcategories,
  getUserProgress,
  getUserDetailedStats,
} from "@/services/firebase/quizService";

// ==================== QUERY KEYS ====================

export const QUIZ_KEYS = {
  all: ["quiz"] as const,
  categories: () => [...QUIZ_KEYS.all, "categories"] as const,
  subcategories: (categoryId: string) =>
    [...QUIZ_KEYS.all, "subcategories", categoryId] as const,
  quiz: (subcategoryId: string) => [...QUIZ_KEYS.all, "quiz", subcategoryId] as const,
  userProgress: (userId: string) => [...QUIZ_KEYS.all, "progress", userId] as const,
  detailedStats: (userId: string) => [...QUIZ_KEYS.all, "detailed-stats", userId] as const,
};

// ==================== HOOKS ====================

/**
 * Hook para buscar todas as categorias de quizzes.
 * 
 * 🛑 Otimização de Custos (Firestore Reads):
 * - Dados estáticos da aplicação (revisados raramente via Admin).
 * - Cache-First via MMKV no quizService + staleTime de 24 horas. Zero custo de leitura após aquecimento.
 */
export function useCategories() {
  return useQuery({
    queryKey: QUIZ_KEYS.categories(),
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias em memória
    refetchOnMount: false,
  });
}

/**
 * Hook para buscar subcategorias de uma categoria específica.
 * 
 * 🛑 Otimização de Custos (Firestore Reads):
 * - Conteúdo estático mantido por 24 horas no cache.
 */
export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.subcategories(categoryId),
    queryFn: () => getSubcategories(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias em memória
    refetchOnMount: false,
  });
}

/**
 * Hook para buscar um quiz específico por subcategoria.
 * 
 * 🛑 Otimização de Custos (Firestore Reads):
 * - Perguntas do quiz mantidas em memória por 1 hora.
 */
export function useQuiz(subcategoryId: string, enabled = true) {
  return useQuery({
    queryKey: QUIZ_KEYS.quiz(subcategoryId),
    queryFn: () => getQuiz(subcategoryId),
    enabled: !!subcategoryId && enabled,
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas em memória
    refetchOnMount: false,
  });
}

/**
 * Hook para buscar o progresso do usuário por categoria (Home de Fixe).
 * 
 * 🛑 Estratégia de Otimização de Custos & Sincronização:
 * - Sincronizado com `useUserDetailedStats` (5 min em prod, 0 em dev).
 * - refetchOnMount: true para re-sincronizar barras de progresso da home ao retornar de um quiz.
 * - Invalidação automática disparada ao salvar resultado em StandardQuiz / DailyQuiz.
 */
export function useUserQuizProgress(userId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.userProgress(userId),
    queryFn: () => getUserProgress(userId),
    enabled: !!userId,
    staleTime: __DEV__ ? 0 : 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true,
  });
}

/**
 * Hook para buscar estatísticas detalhadas do usuário (Meu Desempenho).
 * 
 * 🛑 Estratégia de Otimização de Custos & Sincronização:
 * - Sincronizado com `useUserQuizProgress` (5 min em prod, 0 em dev).
 * - refetchOnMount: true para garantir sincronia imediata ao abrir a tela de estatísticas.
 * - Invalidação automática disparada conjuntamente com `userProgress`.
 */
export function useUserDetailedStats(userId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.detailedStats(userId),
    queryFn: () => getUserDetailedStats(userId),
    enabled: !!userId && userId !== "guest",
    staleTime: __DEV__ ? 0 : 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true,
  });
}
