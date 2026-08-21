import apiClient from "./apiClient";
import { ChatMessage, ChatType } from "@/types/chat";
import * as Storage from "@/utils/Storage";

export { ChatType };

export interface ChatCompletionResponse {
  id?: string;
  response: string;
  content?: string;
  role?: "assistant";
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
    type: ChatType | string = ChatType.EMOTIONAL
  ): Promise<ChatCompletionResponse> {
    const typeStr = String(type || "").toLowerCase();
    const chatType = typeStr.includes("scientific") || typeStr.includes("doctrinal")
      ? "scientific"
      : "emotional";

    const response = await apiClient.post<any>(
      "/chat/completions",
      {
        chatType,
        messages,
      },
      {
        timeout: 120000, // 120s timeout estendido para IA
      }
    );

    const data = response.data || {};
    const text = data.content || data.response || "";
    return {
      ...data,
      content: text,
      response: text,
      role: "assistant",
    };
  },

  /**
   * Envia mensagens utilizando o endpoint de Streaming SSE (/chat/stream) via fetch com parser de eventos SSE.
   */
  async sendMessageStream(
    messages: ChatMessage[],
    type: ChatType | string = ChatType.EMOTIONAL,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const typeStr = String(type || "").toLowerCase();
    const chatType = typeStr.includes("scientific") || typeStr.includes("doctrinal")
      ? "scientific"
      : "emotional";

    const token = Storage.loadString("jwt_token") || Storage.loadString("refresh_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "text/event-stream, application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api/v1";

    const response = await fetch(`${API_URL}/chat/stream`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        chatType,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Erro no chat stream (${response.status}): ${errorText || response.statusText}`);
    }

    let fullText = "";
    let buffer = "";

    const processBuffer = (flush = false) => {
      const lines = buffer.split(/\r?\n/);
      if (!flush) {
        buffer = lines.pop() || "";
      } else {
        buffer = "";
      }

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data:")) {
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.content) {
              fullText += parsed.content;
              if (onChunk) onChunk(parsed.content);
            }
          } catch {
            // Ignora se não for JSON válido
          }
        }
      }
    };

    if (response.body && typeof (response.body as any).getReader === "function") {
      const reader = (response.body as any).getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        processBuffer(false);
      }
      processBuffer(true);
    } else {
      buffer = await response.text();
      processBuffer(true);
    }

    return fullText;
  },

  /**
   * Obtém as cotas e limites diários de mensagens de chat do usuário.
   */
  async getDailyLimits(type?: ChatType | string): Promise<ChatDailyLimitsResponse> {
    const response = await apiClient.get<any>("/chat/limits");
    const data = response.data;
    if (!data) {
      return {
        canSend: true,
        messagesSentToday: 0,
        dailyLimit: 10,
        remainingMessages: 10,
        remainingToday: 10,
        remainingMonth: 300,
      };
    }

    const typeStr = String(type || "").toLowerCase();
    const isScientific = typeStr.includes("scientific") || typeStr.includes("doctrinal");

    const messagesSentToday = isScientific
      ? (data.dailyScientificCount ?? 0)
      : (data.dailyEmotionalCount ?? 0);

    const dailyLimit = data.dailyMaxLimit ?? 10;

    const remaining = isScientific
      ? (data.remainingScientific ?? Math.max(0, dailyLimit - messagesSentToday))
      : (data.remainingEmotional ?? Math.max(0, dailyLimit - messagesSentToday));

    const canSend = remaining > 0;

    return {
      canSend,
      reason: canSend
        ? undefined
        : `Você atingiu o limite diário de ${dailyLimit} mensagens para este assistente.\nPara continuar conversando, retorne amanhã!`,
      messagesSentToday,
      dailyLimit,
      remainingMessages: remaining,
      remainingToday: remaining,
      remainingMonth: remaining * 30,
      resetsAt: data.lastResetAt,
    };
  },

  /**
   * Incrementa o contador de mensagens enviadas.
   * No backend Spring Boot, o incremento é realizado automaticamente ao processar o chat (/chat/completions).
   */
  async incrementUsage(type?: ChatType | string): Promise<void> {
    return Promise.resolve();
  },

  /**
   * Obtém as estatísticas consolidadas de uso dos assistentes pelo usuário.
   */
  async getUserStats(): Promise<ChatUserStatsResponse> {
    try {
      const response = await apiClient.get<ChatUserStatsResponse>("/chat/stats");
      if (response.data) return response.data;
    } catch (e) {
      // Fallback seguro se o endpoint /chat/stats não responder
    }
    const limits = await this.getDailyLimits();
    return {
      emotionalMessagesSent: limits.messagesSentToday,
      scientificMessagesSent: limits.messagesSentToday,
      totalMessagesSent: limits.messagesSentToday,
    };
  },
};
