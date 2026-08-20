import apiClient from "./apiClient";
import { NotificationItem } from "@/types/notifications";

export interface NotificationsResponse {
  items: NotificationItem[];
  nextPage?: number | null;
}

export const notificationApiService = {
  /**
   * Obtém as notificações do usuário autenticado (paginado).
   */
  async getNotifications(
    page: number = 1,
    limit: number = 30
  ): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>("/notifications", {
      params: { page, limit },
    });
    if (Array.isArray(response.data)) {
      return { items: response.data, nextPage: null };
    }
    return response.data || { items: [], nextPage: null };
  },

  /**
   * Marca uma notificação individual como lida.
   */
  async markAsRead(notificationId: string): Promise<void> {
    if (!notificationId) return;
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Marca todas as notificações do usuário como lidas.
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  },
};
