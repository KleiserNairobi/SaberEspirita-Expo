import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatType, chatApiService } from "@/services/api/chatApiService";
import { LocalChatLimitsService } from "@/services/local/localChatLimitsService";
import { useAuthStore } from "@/stores/authStore";

export function useChatLimits(chatType: string = "EMOTIONAL") {
  const { user, isGuest } = useAuthStore();
  const normalizedType =
    String(chatType).toLowerCase().includes("scientific") || String(chatType).toLowerCase().includes("doctrinal")
      ? "SCIENTIFIC"
      : "EMOTIONAL";

  return useQuery({
    queryKey: ["chatLimits", user?.uid || "guest", normalizedType],
    queryFn: async () => {
      if (isGuest) {
        return LocalChatLimitsService.checkCanSendMessage(normalizedType as any);
      }
      if (!user?.uid) return null;
      return chatApiService.getDailyLimits(normalizedType as any);
    },
    enabled: !!user?.uid || isGuest,
    staleTime: 60_000,          // 1 minuto
    refetchOnWindowFocus: false, // evita refetch quando teclado dispensa ao rolar (keyboardDismissMode)
  });
}

export function useIncrementChatUsage() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (chatType: string) => {
      const normalizedType =
        String(chatType).toLowerCase().includes("scientific") || String(chatType).toLowerCase().includes("doctrinal")
          ? "SCIENTIFIC"
          : "EMOTIONAL";

      if (isGuest) {
        await LocalChatLimitsService.incrementUsage(normalizedType as any);
        return;
      }
      if (!user?.uid) throw new Error("User not authenticated");
      await chatApiService.incrementUsage(normalizedType as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatLimits"] });
      queryClient.invalidateQueries({ queryKey: ["chatStats"] });
    },
  });
}

export function useChatStats() {
  const { user, isGuest } = useAuthStore();

  return useQuery({
    queryKey: ["chatStats", user?.uid || "guest"],
    queryFn: async () => {
      if (isGuest) {
        return LocalChatLimitsService.getUserStats();
      }
      if (!user?.uid) return null;
      return chatApiService.getUserStats();
    },
    enabled: !!user?.uid || isGuest,
  });
}
