import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { db } from "@/configs/firebase/firebase";
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
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (isGuest || !user?.uid) {
      setHasUnread(false);
      return;
    }

    const ref = collection(db, `users/${user.uid}/notifications`);
    const q = query(ref, where("readAt", "==", null), limit(1));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setHasUnread(!snap.empty);
      },
      (error) => {
        console.error("[useHasUnreadNotifications] onSnapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, isGuest]);

  return { data: hasUnread, isLoading: false };
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
