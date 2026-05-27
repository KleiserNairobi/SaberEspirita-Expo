import { ChatService } from "@/types/chat";
import { callDeepSeekProxy } from "../deepseek/proxy";
import { ChatType, getSystemPrompt } from "../prompt";

/**
 * Cria um serviço de chat genérico baseado no tipo de chat.
 * Injeta o system prompt correspondente como primeira mensagem do histórico.
 */
export function createChatService(chatType: ChatType): ChatService {
  return async (userMessage, history, _onChunkReceived, onComplete) => {
    // 1. Obtém o system prompt correspondente ao tipo de chat
    const systemPrompt = getSystemPrompt(chatType);

    // 2. Monta o histórico de mensagens incluindo o prompt de sistema, o histórico de turnos e a nova mensagem do usuário
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history,
      { role: "user" as const, content: userMessage },
    ];

    // 3. Executa a chamada via Cloud Function Proxy segura
    const content = await callDeepSeekProxy(messages, chatType);

    // 4. Retorna a resposta completa (o hook useDeepSeekChat lidará com a simulação do streaming)
    onComplete(content);
  };
}

// Instâncias prontas para uso
export const emotionalChatService = createChatService(ChatType.EMOTIONAL);
export const scientificChatService = createChatService(ChatType.SCIENTIFIC);
