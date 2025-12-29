import { ChatService } from "@/types/chat";
import { ChatType } from "../prompt";
import { emotionalChatService } from "./emotionalChatService";
import { scientificChatService } from "./scientificChatService";
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
        ? `Olá, meu amigo! 🕊️

Seja bem-vindo. Estou aqui para oferecer apoio emocional e consolo espiritual.

Como posso ajudar seu coração hoje?`
        : `Olá! 📚

Seja bem-vindo. Estou aqui para esclarecer suas dúvidas sobre a Doutrina Espírita.

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
        ? `Que a paz esteja com você, meu amigo. 🙏

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

  // Filtros específicos para chat emocional
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

  // Filtros específicos para chat científico
  if (chatType === ChatType.SCIENTIFIC) {
    if (intention.type === IntentionType.OFF_TOPIC) {
      return {
        blocked: true,
        response: `Perdão, mas minha especialidade é a Doutrina Espírita. 📚

Posso ajudá-lo com questões sobre:
- As obras básicas do Espiritismo
- Conceitos doutrinários
- Princípios espíritas
- Ensinamentos de Allan Kardec

Qual é sua dúvida doutrinária?`,
      };
    }

    if (intention.type === IntentionType.EMOTIONAL_SUPPORT) {
      return {
        blocked: true,
        response: `Percebo que você está buscando apoio emocional. 🕊️

Para questões de consolo e apoio espiritual, recomendo conversar com **O Guia**, nosso assistente especializado em apoio emocional.

Estou aqui para esclarecer **dúvidas doutrinárias**. Tem alguma pergunta sobre os ensinamentos espíritas?`,
      };
    }
  }

  return { blocked: false };
}
