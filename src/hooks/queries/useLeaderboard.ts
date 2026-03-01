import { useQuery } from "@tanstack/react-query";
import { getLeaderboard, getUserScore } from "@/services/firebase/leaderboardService";
import { TimeFilter, ILeaderboardUser } from "@/types/leaderboard";
import { useAuthStore } from "@/stores/authStore";

export function useLeaderboard(timeFilter: TimeFilter) {
  return useQuery({
    queryKey: ["leaderboard", timeFilter],
    queryFn: () => getLeaderboard(timeFilter),
    staleTime: 1000 * 30, // 30 segundos de cache para melhorar consistência
  });
}

export function useCurrentUserScore() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["userScore", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      return getUserScore(user.uid);
    },
    enabled: !!user?.uid,
  });
}
