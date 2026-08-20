import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApiService } from "@/services/api/notificationApiService";
import { useAuthStore } from "@/stores/authStore";

export const NOTIFICATION_KEYS = {
  list: (userId: string) => ["notifications", userId] as const,
  hasUnread: (userId: string) => ["notificationsHasUnread", userId] as const,
};

/**
 * Hook para verificar se o usuário possui notificações não lidas.
 */
export function useHasUnreadNotifications() {
  const { user, isGuest } = useAuthStore();
  const userId = user?.uid || "guest";

  return useQuery({
    queryKey: NOTIFICATION_KEYS.hasUnread(userId),
    queryFn: async () => {
      if (isGuest || !user?.uid) return false;
      const res = await notificationApiService.getNotifications(1, 10);
      return res.items.some((n) => !n.readAt);
    },
    enabled: !!user?.uid && !isGuest,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 60, // 1 hora
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook para listar notificações com paginação (Infinite Scroll).
 */
export function useNotifications() {
  const { user, isGuest } = useAuthStore();
  const userId = user?.uid || "guest";

  return useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.list(userId),
    queryFn: async ({ pageParam = 1 }) => {
      if (isGuest || !user?.uid) {
        return { items: [], nextPage: null };
      }
      return notificationApiService.getNotifications(pageParam as number, 30);
    },
    enabled: !!user?.uid && !isGuest,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    gcTime: 1000 * 60 * 60, // 1 hora em memória
    refetchOnMount: false,
  });
}

/**
 * Hook de mutação para marcar uma notificação como lida via API REST.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.uid || "guest";

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApiService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list(userId) });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.hasUnread(userId) });
    },
  });
}

/**
 * Hook de mutação para marcar todas as notificações do usuário como lidas.
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.uid || "guest";

  return useMutation({
    mutationFn: () => notificationApiService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list(userId) });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.hasUnread(userId) });
    },
  });
}
