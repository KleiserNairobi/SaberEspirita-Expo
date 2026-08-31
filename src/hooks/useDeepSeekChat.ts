import { useState, useCallback } from "react";
import { Message, ChatMessage, UseChatReturn, ChatType } from "@/types/chat";
import {
  shouldBlockMessage,
} from "@/services/chat";
import { chatApiService } from "@/services/api/chatApiService";

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
export function useDeepSeekChat(chatType: ChatType | "emotional" | "scientific" = ChatType.EMOTIONAL): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Simula streaming palavra por palavra para respostas locais (saudações, despedidas) ou fallback
   */
  const simulateStreaming = useCallback(async (text: string = "", messageId: string) => {
    if (!text) return;
    const words = text.split(" ");
    let accumulated = "";

    for (const word of words) {
      accumulated += (accumulated ? " " : "") + word;

      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, text: accumulated } : msg))
      );

      await new Promise((resolve) => setTimeout(resolve, 15));
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

        // Converte o histórico anterior + nova mensagem para o formato da API
        const apiMessages = [
          ...toApiMessages(historySnapshot),
          { role: "user" as const, content: userMessage },
        ];

        // Invoca a API REST Spring Boot com suporte a streaming SSE via fetch
        let accumulatedText = "";
        try {
          await chatApiService.sendMessageStream(
            apiMessages,
            chatType as any,
            (chunk) => {
              accumulatedText += chunk;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsg.id ? { ...msg, text: accumulatedText } : msg
                )
              );
            }
          );
        } catch (streamErr) {
          // Se já recebemos a resposta pelo stream, NÃO executamos fallback síncrono
          if (accumulatedText.trim().length > 0) {
            return;
          }
          console.warn("Falha no chat stream SSE, executando fallback síncrono:", streamErr);
          const responseData = await chatApiService.sendMessage(apiMessages, chatType as any);
          const replyText = responseData.content || responseData.response || "";
          await simulateStreaming(replyText, assistantMsg.id);
        }
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
        // Garante que o loading sempre destrava, liberando o input imediatamente
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
