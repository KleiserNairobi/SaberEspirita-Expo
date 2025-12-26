import { deepSeekClient } from "./config";
import { ChatType, getSystemPrompt } from "../prompt";
import { ChatMessage, DEEPSEEK_MODEL } from "@/types/chat";

/**
 * Faz streaming de resposta do DeepSeek
 */
export async function streamDeepSeekChat(
  history: ChatMessage[],
  chatType: ChatType = ChatType.EMOTIONAL
): Promise<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
  // Carrega o prompt de sistema
  const systemPrompt = getSystemPrompt(chatType);

  // Prepara mensagens: [system, ...history]
  const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }, ...history];

  // Configura parâmetros baseado no tipo de chat
  const temperature = chatType === ChatType.EMOTIONAL ? 0.7 : 0.3;
  const maxTokens = chatType === ChatType.EMOTIONAL ? 800 : 1200;

  // Chama API com streaming
  const stream = await deepSeekClient.chat.completions.create({
    model: DEEPSEEK_MODEL,
    messages: messages as any,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  return stream;
}

/**
 * Obtém resposta completa (sem streaming) - fallback
 */
export async function getDeepSeekCompletion(
  history: ChatMessage[],
  chatType: ChatType = ChatType.EMOTIONAL
): Promise<string> {
  const systemPrompt = getSystemPrompt(chatType);

  const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }, ...history];

  const temperature = chatType === ChatType.EMOTIONAL ? 0.7 : 0.3;
  const maxTokens = chatType === ChatType.EMOTIONAL ? 800 : 1200;

  const response = await deepSeekClient.chat.completions.create({
    model: DEEPSEEK_MODEL,
    messages: messages as any,
    temperature,
    max_tokens: maxTokens,
    stream: false,
  });

  return response.choices[0]?.message?.content || "";
}
