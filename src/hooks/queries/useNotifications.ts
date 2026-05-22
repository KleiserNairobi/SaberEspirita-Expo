import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotificationsPage,
  hasUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/firebase/notificationService";
import { useAuthStore } from "@/stores/authStore";

export const NOTIFICATION_KEYS = {
  list: (userId: string) => ["notifications", userId] as const,
  hasUnread: (userId: string) => ["notificationsHasUnread", userId] as const,
};

export function useHasUnreadNotifications() {
  const { user, isGuest } = useAuthStore();

  return useQuery({
    queryKey: NOTIFICATION_KEYS.hasUnread(user?.uid || "guest"),
    queryFn: async () => {
      if (isGuest) return false;
      if (!user?.uid) return false;
      return hasUnreadNotifications({ userId: user.uid });
    },
    enabled: !!user?.uid && !isGuest,
    refetchOnMount: "always",
  });
}

export function useNotifications() {
  const { user, isGuest } = useAuthStore();

  return useInfiniteQuery({
    queryKey: NOTIFICATION_KEYS.list(user?.uid || "guest"),
    queryFn: async ({ pageParam }) => {
      if (isGuest) return { items: [], cursor: null };
      if (!user?.uid) return { items: [], cursor: null };
      return getNotificationsPage({
        userId: user.uid,
        pageSize: 30,
        cursor: pageParam ?? undefined,
      });
    },
    enabled: !!user?.uid && !isGuest,
    initialPageParam: null as unknown,
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (isGuest) return;
      if (!user?.uid) throw new Error("User not authenticated");
      await markNotificationRead({ userId: user.uid, notificationId });
    },
    onSuccess: async () => {
      if (!user?.uid) return;
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list(user.uid) });
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.hasUnread(user.uid) });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (isGuest) return 0;
      if (!user?.uid) throw new Error("User not authenticated");
      return markAllNotificationsRead({ userId: user.uid });
    },
    onSuccess: async () => {
      if (!user?.uid) return;
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.list(user.uid) });
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.hasUnread(user.uid) });
    },
  });
}
