import { httpsCallable } from "firebase/functions";
import { functions } from "@/configs/firebase/firebase";
import { ChatMessage } from "@/types/chat";
import { ChatType } from "../prompt";

interface DeepSeekProxyRequest {
  messages: ChatMessage[];
  chatType: ChatType;
}

interface DeepSeekProxyResponse {
  content: string;
}

/**
 * Chama a Cloud Function deepseekProxy e retorna a resposta completa.
 * Substitui a chamada direta à API DeepSeek para proteger a chave de API no servidor.
 *
 * A função está em us-central1 e requer autenticação Firebase.
 */
export async function callDeepSeekProxy(
  messages: ChatMessage[],
  chatType: ChatType
): Promise<string> {
  const proxyFn = httpsCallable<DeepSeekProxyRequest, DeepSeekProxyResponse>(
    functions,
    "deepseekProxy"
  );

  const result = await proxyFn({ messages, chatType });
  return result.data.content;
}
