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
  const [sessionActive, setSessionActive] = useState(false);

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
        // Detecta intenção
        const intention = detectIntention(userMessage);

        // Verifica se é encerramento
        if (intention.type === IntentionType.END_CONVERSATION) {
          const farewellMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: "",
            isUser: false,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, farewellMsg]);

          const farewell = `Que a paz te acompanhe, meu amigo. 🌿  
Estarei aqui quando o coração desejar conversar novamente.`;

          await simulateStreaming(farewell, farewellMsg.id);
          setSessionActive(false);
          setIsLoading(false);
          return;
        }

        // Verifica se é saudação inicial
        if (intention.type === IntentionType.GREETING && !sessionActive) {
          const greetingMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: "",
            isUser: false,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, greetingMsg]);

          const greeting = `Olá, meu amigo. 🌿  
Vejo que há algo inquietando seu coração...  
Se desejar, posso ser uma presença de calma e luz neste momento.`;

          await simulateStreaming(greeting, greetingMsg.id);
          setSessionActive(true);
          setIsLoading(false);
          return;
        }

        // Verifica bloqueios
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
    [chatType, sessionActive, simulateStreaming]
  );

  /**
   * Limpa histórico de chat
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionActive(false);
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
