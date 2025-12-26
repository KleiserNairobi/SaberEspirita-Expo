import emotionalChatPrompt from "./chatEmotional";

/**
 * Tipos de chat disponíveis
 */
export enum ChatType {
  EMOTIONAL = "emotional",
  SCIENTIFIC = "scientific",
}

/**
 * Carrega prompt de sistema baseado no tipo de chat
 */
export function getSystemPrompt(chatType: ChatType): string {
  switch (chatType) {
    case ChatType.EMOTIONAL:
      return emotionalChatPrompt;
    case ChatType.SCIENTIFIC:
      // TODO: Implementar prompt científico no futuro
      return "Você é um assistente científico especializado em Espiritismo.";
    default:
      return emotionalChatPrompt;
  }
}
