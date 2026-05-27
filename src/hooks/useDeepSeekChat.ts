import { useState, useCallback } from "react";
import { Message, ChatMessage, UseChatReturn } from "@/types/chat";
import {
  detectIntention,
  IntentionType,
  getChatService,
  shouldBlockMessage,
} from "@/services/chat";
import { ChatType } from "@/services/prompt";

/**
 * Converte o array de mensagens da UI (Message[]) para o formato da API (ChatMessage[]).
 * Exclui mensagens de erro e a mensagem vazia do assistente que ainda está sendo streamada.
 */
function toApiMessages(messages: Message[]): ChatMessage[] {
  return messages
    .filter((m) => !m.isError && m.text.trim() !== "")
    .map((m) => ({
      role: m.isUser ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));
}

/**
 * Hook principal para gerenciar chat com DeepSeek
 */
export function useDeepSeekChat(chatType: ChatType = ChatType.EMOTIONAL): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Simula streaming palavra por palavra para respostas locais (saudações, despedidas)
   */
  const simulateStreaming = useCallback(async (text: string, messageId: string) => {
    const words = text.split(" ");
    let accumulated = "";

    for (const word of words) {
      accumulated += (accumulated ? " " : "") + word;

      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, text: accumulated } : msg))
      );

      await new Promise((resolve) => setTimeout(resolve, 40));
    }
  }, []);

  /**
   * Envia mensagem do usuário
   */
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      setError(null);
      setIsLoading(true);

      // Adiciona mensagem do usuário
      const userMsg: Message = {
        id: Date.now().toString(),
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
      };

      // Captura o histórico atual ANTES de adicionar a nova mensagem do usuário
      // para passar ao service apenas as mensagens já concluídas
      let historySnapshot: Message[] = [];
      setMessages((prev) => {
        historySnapshot = prev;
        return [...prev, userMsg];
      });

      try {
        // Verifica bloqueios (saudações, despedidas, off-topic, etc.)
        const blockCheck = shouldBlockMessage(userMessage, chatType);
        if (blockCheck.blocked && blockCheck.response) {
          const blockMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: "",
            isUser: false,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, blockMsg]);
          await simulateStreaming(blockCheck.response, blockMsg.id);
          return;
        }

        // Cria mensagem do assistente (vazia inicialmente para mostrar streaming)
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Converte histórico anterior para formato da API
        const apiHistory = toApiMessages(historySnapshot);

        // Chama serviço de chat (via Cloud Function proxy — sem streaming SSE)
        const chatService = getChatService(chatType);

        await chatService(
          userMessage,
          apiHistory,
          // onChunkReceived — não utilizado com o proxy (resposta chega completa)
          (_chunk: string) => {},
          // onComplete — recebe a resposta completa e simula digitação client-side
          async (fullResponse: string) => {
            await simulateStreaming(fullResponse, assistantMsg.id);
          }
        );
      } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
        setError("Desculpe, ocorreu um erro. Tente novamente.");

        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
          isUser: false,
          timestamp: new Date(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        // Garante que o loading sempre destrava, mesmo se o stream for interrompido
        setIsLoading(false);
      }
    },
    [chatType, simulateStreaming]
  );

  /**
   * Limpa histórico de chat
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
