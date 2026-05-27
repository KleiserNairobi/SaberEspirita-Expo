import { ChatService } from "@/types/chat";
import { callDeepSeekProxy } from "../deepseek/proxy";
import { ChatType, getSystemPrompt } from "../prompt";

/**
 * Serviço de chat emocional (O Guia)
 *
 * Chama a Cloud Function deepseekProxy para manter a API Key segura no servidor.
 * O system prompt da persona "Guia" é injetado como primeira mensagem do array,
 * garantindo que o modelo responda sempre dentro do contexto espírita emocional.
 */
export const emotionalChatService: ChatService = async (
  userMessage,
  history,
  _onChunkReceived,
  onComplete
) => {
  // System prompt emocional (persona O Guia) — DEVE ser a primeira mensagem
  const systemPrompt = getSystemPrompt(ChatType.EMOTIONAL);

  // Monta: [system, ...histórico de turnos anteriores, nova mensagem do usuário]
  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history,
    { role: "user" as const, content: userMessage },
  ];

  // Chama o proxy seguro no servidor (API Key protegida na Cloud Function)
  const content = await callDeepSeekProxy(messages, ChatType.EMOTIONAL);

  // Entrega resposta completa — simulateStreaming no hook cria o efeito de digitação
  onComplete(content);
};
