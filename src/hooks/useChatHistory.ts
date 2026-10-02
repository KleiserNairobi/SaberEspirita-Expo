import { useState, useCallback } from "react";
import { chatApiService } from "@/services/api/chatApiService";
import {
  ChatConversationSummary,
  ChatConversationDetail,
  ChatType,
  Message,
} from "@/types/chat";

export interface ConversationGroup {
  title: string;
  data: ChatConversationSummary[];
}

/**
 * Agrupa as conversas por proximidade temporal (Hoje, Ontem, Esta Semana, Anteriores).
 */
export function groupConversationsByDate(
  conversations: ChatConversationSummary[]
): ConversationGroup[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOf7Days = startOfToday - 6 * 86400000;

  const today: ChatConversationSummary[] = [];
  const yesterday: ChatConversationSummary[] = [];
  const thisWeek: ChatConversationSummary[] = [];
  const older: ChatConversationSummary[] = [];

  for (const item of conversations) {
    const itemDate = new Date(item.updatedAt || item.createdAt).getTime();
    if (itemDate >= startOfToday) {
      today.push(item);
    } else if (itemDate >= startOfYesterday) {
      yesterday.push(item);
    } else if (itemDate >= startOf7Days) {
      thisWeek.push(item);
    } else {
      older.push(item);
    }
  }

  const groups: ConversationGroup[] = [];
  if (today.length > 0) groups.push({ title: "Hoje", data: today });
  if (yesterday.length > 0) groups.push({ title: "Ontem", data: yesterday });
  if (thisWeek.length > 0) groups.push({ title: "Esta Semana", data: thisWeek });
  if (older.length > 0) groups.push({ title: "Anteriores", data: older });

  return groups;
}

/**
 * Converte mensagens salvas do backend para a interface Message utilizada na UI do chat.
 */
export function mapSavedMessagesToUiMessages(detail: ChatConversationDetail): Message[] {
  if (!detail.messages || detail.messages.length === 0) {
    return [];
  }
  return detail.messages.map((m) => ({
    id: m.id,
    text: m.content,
    isUser: m.role === "user",
    timestamp: new Date(m.createdAt),
  }));
}

export function useChatHistory(chatType: ChatType | string = ChatType.EMOTIONAL) {
  const [conversations, setConversations] = useState<ChatConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatApiService.getConversations(chatType);
      setConversations(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Falha ao carregar histórico";
      setError(msg);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  }, [chatType]);

  const loadConversation = useCallback(async (id: string): Promise<ChatConversationDetail | null> => {
    try {
      const detail = await chatApiService.getConversationDetail(id);
      return detail;
    } catch (err: any) {
      console.error("useChatHistory: Erro ao carregar detalhes da conversa:", err);
      return null;
    }
  }, []);

  const renameConversation = useCallback(
    async (id: string, newTitle: string): Promise<boolean> => {
      try {
        const updated = await chatApiService.updateConversationTitle(id, newTitle);
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title: updated.title, updatedAt: updated.updatedAt } : c))
        );
        return true;
      } catch (err: any) {
        console.error("useChatHistory: Erro ao renomear conversa:", err);
        return false;
      }
    },
    []
  );

  const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
    try {
      await chatApiService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err: any) {
      console.error("useChatHistory: Erro ao excluir conversa:", err);
      return false;
    }
  }, []);

  const grouped = groupConversationsByDate(conversations);

  return {
    conversations,
    groupedConversations: grouped,
    loading,
    hasFetched,
    error,
    fetchConversations,
    loadConversation,
    renameConversation,
    deleteConversation,
  };
}
