import apiClient from "./apiClient";

export interface LogEventPayload {
  eventName: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface GlobalStatsResponse {
  totalStudents: number;
  totalCoursesCompleted: number;
  totalLessonsCompleted: number;
  totalQuizzesSolved: number;
  totalPrayersCompleted: number;
}

export const statsApiService = {
  /**
   * Envia um evento de auditoria ou telemetria para o servidor REST.
   */
  async logEvent(eventData: LogEventPayload): Promise<void> {
    try {
      await apiClient.post("/logs/event", {
        logType: eventData.eventName || eventData.category || "visit",
        userId: null,
        payload: JSON.stringify(eventData),
      });
    } catch {
      // Ignora falhas de envio de telemetria em background
    }
  },

  /**
   * Obtém as estatísticas globais consolidadas da plataforma.
   */
  async getGlobalStats(): Promise<GlobalStatsResponse> {
    const response = await apiClient.get<GlobalStatsResponse>("/stats/global");
    return response.data || {
      totalStudents: 0,
      totalCoursesCompleted: 0,
      totalLessonsCompleted: 0,
      totalQuizzesSolved: 0,
      totalPrayersCompleted: 0,
    };
  },

  /**
   * Obtém as estatísticas diárias recentes registradas no aplicativo.
   */
  async getDailyStats(): Promise<Record<string, unknown>[]> {
    const response = await apiClient.get<Record<string, unknown>[] >("/stats/daily");
    return response.data || [];
  },
};
