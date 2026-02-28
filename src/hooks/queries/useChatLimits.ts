import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ChatLimitsService, ChatType } from "@/services/firebase/chatLimitsService";
import { LocalChatLimitsService } from "@/services/local/localChatLimitsService";
import { useAuthStore } from "@/stores/authStore";

export function useChatLimits(chatType: ChatType) {
  const { user, isGuest } = useAuthStore();

  return useQuery({
    queryKey: ["chatLimits", user?.uid || "guest", chatType],
    queryFn: async () => {
      if (isGuest) {
        return LocalChatLimitsService.checkCanSendMessage(chatType);
      }
      if (!user?.uid) return null;
      return ChatLimitsService.checkCanSendMessage(user.uid, chatType);
    },
    enabled: !!user?.uid || isGuest,
    staleTime: 0, // Sempre buscar dados frescos para garantir cooldown correto
    refetchOnMount: true,
  });
}

export function useIncrementChatUsage() {
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuthStore();

  return useMutation({
    mutationFn: async (chatType: ChatType) => {
      if (isGuest) {
        await LocalChatLimitsService.incrementUsage(chatType);
        return;
      }
      if (!user?.uid) throw new Error("User not authenticated");
      await ChatLimitsService.incrementUsage(user.uid, chatType);
    },
    onSuccess: () => {
      // Invalidar queries para atualizar UI
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
      return ChatLimitsService.getUserStats(user.uid);
    },
    enabled: !!user?.uid || isGuest,
  });
}
