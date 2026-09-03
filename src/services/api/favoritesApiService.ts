import apiClient from "./apiClient";

export const favoritesApiService = {
  /**
   * Obtém os IDs de todas as orações favoritadas pelo usuário.
   */
  async getFavoritePrayers(): Promise<string[]> {
    const response = await apiClient.get<any[]>("/favorites/prayers");
    const data = response.data || [];
    return data.map((item) => (typeof item === "string" ? item : item?.id)).filter(Boolean);
  },

  /**
   * Alterna a marcação de favorito para uma oração.
   */
  async togglePrayerFavorite(prayerId: string): Promise<boolean> {
    const response = await apiClient.post<{ isFavorite: boolean }>(
      `/favorites/prayers/${prayerId}/toggle`
    );
    return !!response.data?.isFavorite;
  },

  /**
   * Obtém os IDs de todas as reflexões favoritadas pelo usuário.
   */
  async getFavoriteReflections(): Promise<string[]> {
    const response = await apiClient.get<any[]>("/favorites/reflections");
    const data = response.data || [];
    return data.map((item) => (typeof item === "string" ? item : item?.id)).filter(Boolean);
  },

  /**
   * Alterna a marcação de favorito para uma reflexão.
   */
  async toggleReflectionFavorite(reflectionId: string): Promise<boolean> {
    const response = await apiClient.post<{ isFavorite: boolean }>(
      `/favorites/reflections/${reflectionId}/toggle`
    );
    return !!response.data?.isFavorite;
  },
};
