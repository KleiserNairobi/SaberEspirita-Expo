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
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 60, // 1 hora
    refetchOnMount: true,
  });
}

/**
 * Hook para buscar a pontuação e posição do usuário logado via API REST.
 */
export function useCurrentUserScore() {
  const { user } = useAuthStore();
  const userId = user?.uid || "";

  return useQuery({
    queryKey: ["userScore", userId],
    queryFn: () => leaderboardApiService.getMyPosition(),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 60,
    refetchOnMount: true,
  });
}
