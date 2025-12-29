import emotionalChatPrompt from "./chatEmotional";
import scientificChatPrompt from "./chatScientific";

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
      return scientificChatPrompt;
    default:
      return emotionalChatPrompt;
  }
}
