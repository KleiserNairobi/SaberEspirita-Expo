/**
 * Tipos e interfaces para o sistema de chat
 */

/**
 * Mensagem individual exibida na UI
 */
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

/**
 * Mensagem formatada para a API DeepSeek
 */
export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

/**
 * Tipos de intenção detectados nas mensagens do usuário
 */
export enum IntentionType {
  EMOTIONAL_SUPPORT = "emotional_support",
  DOCTRINAL_QUESTION = "doctrinal_question",
  OFF_TOPIC = "off_topic",
  GREETING = "greeting",
  END_CONVERSATION = "end_conversation",
  UNKNOWN = "unknown",
}

/**
 * Resultado da detecção de intenção
 */
export interface IntentionResult {
  type: IntentionType;
  confidence: number;
}

/**
 * Função de serviço de chat
 */
export type ChatService = (
  userMessage: string,
  onChunkReceived: (chunk: string) => void,
  onComplete: (fullResponse: string) => void
) => Promise<void>;

/**
 * Retorno do hook useDeepSeekChat
 */
export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

/**
 * Props para a interface de chat
 */
export interface ChatInterfaceProps extends UseChatReturn {
  title: string;
  subtitle: string;
  headerColor?: string;
}

/**
 * Modelo de IA usado pela DeepSeek
 */
export const DEEPSEEK_MODEL = "deepseek-chat";
