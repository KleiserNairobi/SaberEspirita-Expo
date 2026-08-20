import apiClient from "./apiClient";
import { ChatMessage, ChatType } from "@/types/chat";

export { ChatType };

export interface ChatCompletionResponse {
  id?: string;
  response: string;
  role: "assistant";
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ChatDailyLimitsResponse {
  canSend: boolean;
  reason?: string;
  messagesSentToday: number;
  dailyLimit: number;
  remainingMessages: number;
  remainingToday?: number;
  remainingMonth?: number;
  resetsAt?: string;
}

export interface ChatUserStatsResponse {
  emotionalMessagesSent: number;
  scientificMessagesSent: number;
  totalMessagesSent: number;
}

export const chatApiService = {
  /**
   * Envia o histórico de mensagens para completar a resposta via IA (DeepSeek).
   * Timeout estendido para 120 segundos (120000ms).
   */
  async sendMessage(
    messages: ChatMessage[],
    type: ChatType = ChatType.EMOTIONAL
  ): Promise<ChatCompletionResponse> {
    const response = await apiClient.post<ChatCompletionResponse>(
      "/chat/completions",
      {
        type: type === ChatType.SCIENTIFIC ? "SCIENTIFIC" : "EMOTIONAL",
        messages,
      },
      {
        timeout: 120000, // 120s timeout estendido para IA
      }
    );
    return response.data;
  },

  /**
   * Obtém as cotas e limites diários de mensagens de chat do usuário.
   */
  async getDailyLimits(type?: ChatType): Promise<ChatDailyLimitsResponse> {
    const response = await apiClient.get<ChatDailyLimitsResponse>("/chat/limits", {
      params: { type },
    });
    const data = response.data;
    if (!data) {
      return {
        canSend: true,
        messagesSentToday: 0,
        dailyLimit: 20,
        remainingMessages: 20,
        remainingToday: 20,
        remainingMonth: 600,
      };
    }
    return {
      ...data,
      remainingToday: data.remainingToday ?? data.remainingMessages ?? 20,
      remainingMonth: data.remainingMonth ?? 600,
    };
  },

  /**
   * Incrementa o contador de mensagens enviadas.
   */
  async incrementUsage(type: ChatType): Promise<void> {
    await apiClient.post("/chat/limits/increment", { type });
  },

  /**
   * Obtém as estatísticas consolidadas de uso dos assistentes pelo usuário.
   */
  async getUserStats(): Promise<ChatUserStatsResponse> {
    const response = await apiClient.get<ChatUserStatsResponse>("/chat/stats");
    return (
      response.data || {
        emotionalMessagesSent: 0,
        scientificMessagesSent: 0,
        totalMessagesSent: 0,
      }
    );
  },
};
