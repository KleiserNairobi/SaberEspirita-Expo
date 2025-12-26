import { ChatService } from "@/types/chat";
import { streamDeepSeekChat } from "../deepseek";
import { ChatType } from "../prompt";

/**
 * Serviço de chat emocional
 * Prepara histórico e chama API DeepSeek com streaming
 */
export const emotionalChatService: ChatService = async (
  userMessage,
  onChunkReceived,
  onComplete
) => {
  try {
    // Prepara histórico (apenas mensagem do usuário por enquanto)
    const history = [{ role: "user" as const, content: userMessage }];

    // Chama DeepSeek com streaming
    const stream = await streamDeepSeekChat(history, ChatType.EMOTIONAL);

    let fullResponse = "";

    // Processa chunks
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        onChunkReceived(content);
      }
    }

    onComplete(fullResponse);
  } catch (error) {
    console.error("Erro no emotionalChatService:", error);
    throw error;
  }
};
