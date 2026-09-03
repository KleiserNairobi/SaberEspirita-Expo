import { useQuery } from "@tanstack/react-query";
import { leaderboardApiService } from "@/services/api/leaderboardApiService";
import { useAuthStore } from "@/stores/authStore";
import { TimeFilter } from "@/types/leaderboard";

/**
 * Hook para buscar o ranking geral da comunidade via API REST.
 */
export function useLeaderboard(timeFilter: TimeFilter) {
  return useQuery({
    queryKey: ["leaderboard", timeFilter],
    queryFn: () => leaderboardApiService.getLeaderboard(timeFilter),
    staleTime: 1000 * 60 * 15, // 15 minutos (economiza requisições e mantém estabilidade)
    gcTime: 1000 * 60 * 60, // 1 hora
    refetchOnMount: true, // Garante que ao entrar no Placar veja dados frescos se houve mudança
  });
}

/**
 * Hook para buscar a pontuação e posição do usuário logado via API REST.
 */
export function useCurrentUserScore(timeFilter?: TimeFilter) {
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useQuery({
    queryKey: ["userScore", userId, timeFilter || "all-time"],
    queryFn: () => leaderboardApiService.getMyPosition(timeFilter),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true,
  });
}
