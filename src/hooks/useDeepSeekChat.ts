import { useState, useCallback } from "react";
import { Message, UseChatReturn } from "@/types/chat";
import {
  detectIntention,
  IntentionType,
  getChatService,
  shouldBlockMessage,
} from "@/services/chat";
import { ChatType } from "@/services/prompt";

/**
 * Hook principal para gerenciar chat com DeepSeek
 */
export function useDeepSeekChat(chatType: ChatType = ChatType.EMOTIONAL): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Simula streaming palavra por palavra para respostas locais
   */
  const simulateStreaming = useCallback(async (text: string, messageId: string) => {
    const words = text.split(" ");
    let accumulated = "";

    for (const word of words) {
      accumulated += (accumulated ? " " : "") + word;

      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, text: accumulated } : msg))
      );

      // Delay entre palavras (30-50ms)
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

      setMessages((prev) => [...prev, userMsg]);

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
          setIsLoading(false);
          return;
        }

        // Cria mensagem do assistente (vazia inicialmente)
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Chama serviço de chat com streaming
        const chatService = getChatService(chatType);

        await chatService(
          userMessage,
          // onChunkReceived
          (chunk: string) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsg.id ? { ...msg, text: msg.text + chunk } : msg
              )
            );
          },
          // onComplete
          (fullResponse: string) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsg.id ? { ...msg, text: fullResponse } : msg
              )
            );
            setIsLoading(false);
          }
        );
      } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
        setError("Desculpe, ocorreu um erro. Tente novamente.");

        // Adiciona mensagem de erro
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
          isUser: false,
          timestamp: new Date(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMsg]);
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
