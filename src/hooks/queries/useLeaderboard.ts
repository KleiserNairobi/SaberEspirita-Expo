import { useQuery } from "@tanstack/react-query";
import { getLeaderboard, getUserScore } from "@/services/firebase/leaderboardService";
import { TimeFilter, ILeaderboardUser } from "@/types/leaderboard";
import { useAuthStore } from "@/stores/authStore";

/**
 * Hook para busca do ranking geral do leaderboard (Placar).
 * 
 * 🛑 Estratégia de Otimização de Custos (Firestore Reads):
 * - staleTime: 15 minutos em produção para conter consultas custosas no Firestore.
 * - gcTime / refetchOnMount em __DEV__: 0s / true para permitir testes de alteração de nome/pontuação sem esperar expiração do cache.
 */
export function useLeaderboard(timeFilter: TimeFilter) {
  return useQuery({
    queryKey: ["leaderboard", timeFilter],
    queryFn: () => getLeaderboard(timeFilter),
    staleTime: __DEV__ ? 0 : 1000 * 60 * 15,
    gcTime: __DEV__ ? 0 : 1000 * 60 * 60,
    refetchOnMount: __DEV__ ? true : false,
  });
}

/**
 * Hook para buscar a pontuação individual do usuário logado (Pontos na Home de Fixe).
 * 
 * 🛑 Estratégia de Otimização de Custos & Sincronização:
 * - staleTime: 5 minutos em produção (0 em dev para feedback imediato ao resolver quizzes).
 * - refetchOnMount: true para garantir sincronização do placar ao retornar à tela principal.
 */
export function useCurrentUserScore() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["userScore", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      return getUserScore(user.uid);
    },
    enabled: !!user?.uid,
    staleTime: __DEV__ ? 0 : 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true,
  });
}
