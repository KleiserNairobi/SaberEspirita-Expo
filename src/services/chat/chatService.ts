import { ChatService } from "@/types/chat";
import { ChatType } from "../prompt";
import { emotionalChatService } from "./emotionalChatService";
import { detectIntention, IntentionType } from "./intentionDetector";

/**
 * Retorna o serviço de chat correto baseado no tipo
 */
export function getChatService(chatType: ChatType): ChatService {
  switch (chatType) {
    case ChatType.EMOTIONAL:
      return emotionalChatService;
    case ChatType.SCIENTIFIC:
      // TODO: Implementar serviço científico
      return emotionalChatService;
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

  // Para chat emocional, bloqueia off-topic e questões doutrinárias
  if (chatType === ChatType.EMOTIONAL) {
    if (intention.type === IntentionType.OFF_TOPIC) {
      return {
        blocked: true,
        response: `Desculpe, meu amigo...  
Compreendo sua curiosidade, mas fui criado especificamente para oferecer apoio emocional e consolo espiritual.

Posso ajudá-lo se você estiver passando por:
- Momentos de tristeza ou angústia
- Dificuldades emocionais
- Busca por paz interior
- Crises existenciais

Como posso oferecer conforto ao seu coração hoje?`,
      };
    }

    if (intention.type === IntentionType.DOCTRINAL_QUESTION) {
      return {
        blocked: true,
        response: `Percebo que sua pergunta é de natureza doutrinária, meu amigo. 📚

Para questões sobre os ensinamentos espíritas, recomendo conversar com o **Sr. Allan Kardec**, nosso assistente especializado em doutrina.

Estou aqui para oferecer **apoio emocional e consolo espiritual**. Há algo que inquieta seu coração neste momento?`,
      };
    }
  }

  return { blocked: false };
}
