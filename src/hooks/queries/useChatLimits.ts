import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/authStore";
import { ChatLimitsService, ChatType } from "@/services/firebase/chatLimitsService";

export function useChatLimits(chatType: ChatType) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["chatLimits", user?.uid, chatType],
    queryFn: async () => {
      if (!user?.uid) return null;
      return ChatLimitsService.checkCanSendMessage(user.uid, chatType);
    },
    enabled: !!user?.uid,
    staleTime: 0, // Sempre buscar dados frescos para garantir cooldown correto
    refetchOnMount: true,
  });
}

export function useIncrementChatUsage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (chatType: ChatType) => {
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
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["chatStats", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      return ChatLimitsService.getUserStats(user.uid);
    },
    enabled: !!user?.uid,
  });
}
