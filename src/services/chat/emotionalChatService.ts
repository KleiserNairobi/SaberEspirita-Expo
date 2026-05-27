import { ChatService } from "@/types/chat";
import { callDeepSeekProxy } from "../deepseek/proxy";
import { ChatType } from "../prompt";

/**
 * Serviço de chat emocional (Guia)
 *
 * Chama a Cloud Function deepseekProxy para manter a API Key segura no servidor.
 * O resultado é retornado como resposta completa (sem streaming SSE),
 * pois Cloud Functions não suportam SSE nativo.
 * O efeito de digitação é gerado client-side pelo simulateStreaming no useDeepSeekChat.
 */
export const emotionalChatService: ChatService = async (
  userMessage,
  history,
  onChunkReceived,
  onComplete
) => {
  // Monta as mensagens com histórico completo: [...turnos anteriores, nova mensagem]
  const messages = [
    ...history,
    { role: "user" as const, content: userMessage },
  ];

  // Chama o proxy seguro no servidor (API Key protegida na Cloud Function)
  const content = await callDeepSeekProxy(messages, ChatType.EMOTIONAL);

  // Entrega a resposta completa de uma vez
  // O hook useDeepSeekChat usa simulateStreaming para criar o efeito de digitação
  onComplete(content);
};
