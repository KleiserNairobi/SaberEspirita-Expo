import { ChatService } from "@/types/chat";
import { streamDeepSeekChat } from "../deepseek";
import { ChatType } from "../prompt";

/**
 * Serviço de chat científico (Sr. Allan)
 * Processa mensagens com foco em esclarecimentos doutrinários
 */
export const scientificChatService: ChatService = async (
  userMessage: string,
  onChunkReceived: (chunk: string) => void,
  onComplete: (fullResponse: string) => void
): Promise<void> => {
  console.log("🔵 scientificChatService: Processando mensagem");

  try {
    const history = [
      {
        role: "user",
        content: userMessage,
      } as const,
    ];

    const stream = await streamDeepSeekChat(history, ChatType.SCIENTIFIC);

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        onChunkReceived(content);
      }
    }

    onComplete(fullResponse);
  } catch (error) {
    console.error("❌ Erro na API DeepSeek (Scientific):", error);
    throw error;
  }
};
