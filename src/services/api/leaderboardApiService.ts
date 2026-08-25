import apiClient from "./apiClient";
import { resolveCdnUrl } from "./courseApiService";
import { ILeaderboardUser, TimeFilter } from "@/types/leaderboard";

export const leaderboardApiService = {
  /**
   * Obtém o ranking semanal da comunidade.
   */
  async getWeeklyRanking(): Promise<ILeaderboardUser[]> {
    try {
      const response = await apiClient.get<ILeaderboardUser[]>("/leaderboard/weekly");
      return (response.data || []).map((user: any) => ({
        ...user,
        photoURL: resolveCdnUrl(user.photoURL || user.photoUrl),
      }));
    } catch (error) {
      console.warn("leaderboardApiService: Erro ao buscar ranking semanal:", error);
      return [];
    }
  },

  /**
   * Obtém o ranking mensal da comunidade.
   */
  async getMonthlyRanking(): Promise<ILeaderboardUser[]> {
    try {
      const response = await apiClient.get<ILeaderboardUser[]>("/leaderboard/monthly");
      return (response.data || []).map((user: any) => ({
        ...user,
        photoURL: resolveCdnUrl(user.photoURL || user.photoUrl),
      }));
    } catch (error) {
      console.warn("leaderboardApiService: Erro ao buscar ranking mensal:", error);
      return [];
    }
  },

  /**
   * Obtém o ranking geral (all-time) da comunidade.
   */
  async getAllTimeRanking(): Promise<ILeaderboardUser[]> {
    try {
      const response = await apiClient.get<ILeaderboardUser[]>("/leaderboard/all-time");
      return (response.data || []).map((user: any) => ({
        ...user,
        photoURL: resolveCdnUrl(user.photoURL || user.photoUrl),
      }));
    } catch (error) {
      console.warn("leaderboardApiService: Erro ao buscar ranking geral:", error);
      return [];
    }
  },

  /**
   * Obtém o ranking filtrado pelo período (weekly, monthly ou all-time).
   */
  async getLeaderboard(timeFilter: TimeFilter): Promise<ILeaderboardUser[]> {
    const endpoint =
      timeFilter === "week"
        ? "/leaderboard/weekly"
        : timeFilter === "month"
        ? "/leaderboard/monthly"
        : "/leaderboard/all-time";

    try {
      const response = await apiClient.get<ILeaderboardUser[]>(endpoint);
      return (response.data || []).map((user: any) => ({
        ...user,
        photoURL: resolveCdnUrl(user.photoURL || user.photoUrl),
      }));
    } catch (error) {
      console.warn(`leaderboardApiService: Erro ao buscar ranking (${timeFilter}):`, error);
      return [];
    }
  },

  /**
   * Obtém a posição e dados de pontuação do usuário autenticado no ranking.
   */
  async getMyPosition(): Promise<ILeaderboardUser | null> {
    try {
      const response = await apiClient.get<ILeaderboardUser>("/leaderboard/me");
      if (!response.data) return null;
      const rawUser: any = response.data;
      return {
        ...rawUser,
        photoURL: resolveCdnUrl(rawUser.photoURL || rawUser.photoUrl),
      };
    } catch (error) {
      console.warn("leaderboardApiService: Erro ao buscar posição do usuário:", error);
      return null;
    }
  },
};
