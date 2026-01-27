export enum IntentionType {
  EMOTIONAL_SUPPORT = "emotional_support",
  DOCTRINAL_QUESTION = "doctrinal_question",
  OFF_TOPIC = "off_topic",
  GREETING = "greeting",
  END_CONVERSATION = "end_conversation",
  UNKNOWN = "unknown",
}

export interface IntentionResult {
  type: IntentionType;
  confidence: number;
  shouldRespond: boolean;
  redirectTo?: "allan" | "emotional";
}

/**
 * Detecta a intenção da mensagem do usuário.
 * SIMPLIFICADO: A maior parte da lógica semântica foi delegada ao Prompt do LLM.
 * Mantemos apenas detecção de Saudação e Encerramento para economizar créditos em mensagens triviais.
 */
export const detectIntention = (userMessage: string): IntentionResult => {
  const message = userMessage.toLowerCase().trim();

  // Palavras-chave de saudação (apenas se a mensagem for curta)
  const greetingKeywords = [
    "olá",
    "ola",
    "oi",
    "hey",
    "e aí",
    "eai",
    "bom dia",
    "boa tarde",
    "boa noite",
    "saudações",
  ];

  // Palavras-chave de encerramento
  const endConversationKeywords = [
    "encerrar",
    "finalizar",
    "chega",
    "por hoje é só",
    "obrigado",
    "obrigada",
    "valeu",
    "não desejo mais nada",
    "não preciso mais",
    "pode parar",
    "pode descansar",
    "até logo",
    "até mais",
    "tchau",
    "encerrar conversa",
    "finalizar conversa",
    "sair",
    "adeus",
    "bye",
  ];

  // Verificação de Encerramento (Prioridade Alta - Economia)
  const isEndConversation = endConversationKeywords.some((keyword) => {
    // Verifica palavra exata ou frase muito curta contendo a palavra
    return (
      message === keyword ||
      (message.includes(keyword) && message.length < keyword.length + 10)
    );
  });

  if (isEndConversation) {
    return {
      type: IntentionType.END_CONVERSATION,
      confidence: 1,
      shouldRespond: true,
    };
  }

  // Verificação de Saudação (Apenas mensagens curtas/isoladas)
  // Se o usuário diz "Oi, estou triste", isso NÃO é apenas saudação, deve ir pro LLM.
  // Se diz apenas "Oi", economizamos o call.
  const isGreeting = greetingKeywords.includes(message);

  if (isGreeting) {
    return {
      type: IntentionType.GREETING,
      confidence: 0.9,
      shouldRespond: true,
    };
  }

  // DEFAULT: Não foi possível determinar a intenção exata (ex: "Sim", "Não", "Quem foi Chico Xavier?").
  // Retornamos UNKNOWN para que o ChatService NÃO bloqueie a mensagem.
  // O LLM específico de cada chat (Guia ou Sr. Allan) decidirá como lidar com o conteúdo.
  return {
    type: IntentionType.UNKNOWN,
    confidence: 1,
    shouldRespond: true,
  };
};
