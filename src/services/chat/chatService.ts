import { ChatService } from "@/types/chat";
import { ChatType } from "../prompt";
import { emotionalChatService, scientificChatService } from "./chatServiceFactory";
import { detectIntention, IntentionType } from "./intentionDetector";

/**
 * Retorna o serviço de chat correto baseado no tipo
 */
export function getChatService(chatType: ChatType): ChatService {
  switch (chatType) {
    case ChatType.EMOTIONAL:
      return emotionalChatService;
    case ChatType.SCIENTIFIC:
      return scientificChatService;
    default:
      return emotionalChatService;
  }
}

/**
 * Verifica se uma mensagem deve ser bloqueada
 * Retorna resposta pré-definida se bloqueada
 */
export function shouldBlockMessage(
  message: string,
  chatType: ChatType
): { blocked: boolean; response?: string } {
  const intention = detectIntention(message);

  // Filtros comuns para ambos os chats
  // Bloqueia saudações simples (sem conteúdo adicional)
  if (intention.type === IntentionType.GREETING) {
    const greetingResponse =
      chatType === ChatType.EMOTIONAL
        ? `Olá, amigo(a)! 🕊️

Seja muito bem-vindo(a). Estou aqui para oferecer apoio emocional e consolo espiritual.

Como posso ajudar seu coração hoje?`
        : `Olá! 📚

Seja muito bem-vindo(a). Estou aqui para esclarecer suas dúvidas sobre a Doutrina Espírita.

Qual é sua pergunta?`;

    return {
      blocked: true,
      response: greetingResponse,
    };
  }

  // Bloqueia mensagens de despedida/agradecimento
  if (intention.type === IntentionType.END_CONVERSATION) {
    const farewellResponse =
      chatType === ChatType.EMOTIONAL
        ? `Que a paz esteja com você, amigo(a). 🙏

Estarei aqui sempre que precisar de apoio e consolo.

Até breve!`
        : `Foi um prazer esclarecer suas dúvidas! 📚

Que a luz do conhecimento ilumine seu caminho.

Até a próxima!`;

    return {
      blocked: true,
      response: farewellResponse,
    };
  }

  return { blocked: false };
}
