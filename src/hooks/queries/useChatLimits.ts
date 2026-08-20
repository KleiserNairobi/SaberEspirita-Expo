import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatType, chatApiService } from "@/services/api/chatApiService";
import { LocalChatLimitsService } from "@/services/local/localChatLimitsService";
import { useAuthStore } from "@/stores/authStore";

export function useChatLimits(chatType: ChatType = "EMOTIONAL") {
  const { user, isGuest } = useAuthStore();
  const normalizedType: ChatType =
    chatType === "doctrinal" || chatType === "scientific" || chatType === "SCIENTIFIC"
      ? "SCIENTIFIC"
      : "EMOTIONAL";

  return useQuery({
    queryKey: ["chatLimits", user?.uid || "guest", normalizedType],
    queryFn: async () => {
      if (isGuest) {
        return LocalChatLimitsService.checkCanSendMessage(normalizedType as any);
      }
      if (!user?.uid) return null;
      return chatApiService.getDailyLimits(normalizedType);
    },
    enabled: !!user?.uid || isGuest,
    staleTime: 30_000, // 30 segundos
    refetchOnMount: true,
  });
}

export function useIncrementChatUsage() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (chatType: ChatType) => {
      const normalizedType: ChatType =
        chatType === "doctrinal" || chatType === "scientific" || chatType === "SCIENTIFIC"
          ? "SCIENTIFIC"
          : "EMOTIONAL";

      if (isGuest) {
        await LocalChatLimitsService.incrementUsage(normalizedType as any);
        return;
      }
      if (!user?.uid) throw new Error("User not authenticated");
      await chatApiService.incrementUsage(normalizedType);
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
