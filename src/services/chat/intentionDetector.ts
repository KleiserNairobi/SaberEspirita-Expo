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
 * Detecta a intenção da mensagem do usuário usando palavras-chave simples.
 * É otimizado para uso com o "Guia", personagem de apoio emocional e espiritual.
 */
export const detectIntention = (userMessage: string): IntentionResult => {
  const message = userMessage.toLowerCase().trim();

  // Palavras-chave para apoio emocional
  const emotionalKeywords = [
    "triste",
    "tristeza",
    "ansioso",
    "ansiedade",
    "deprimido",
    "depressão",
    "medo",
    "assustado",
    "preocupado",
    "preocupação",
    "angustiado",
    "angústia",
    "sofrimento",
    "sofrer",
    "dor",
    "machucado",
    "machucada",
    "chateado",
    "chateada",
    "desanimado",
    "desânimo",
    "frustrado",
    "frustração",
    "raiva",
    "nervoso",
    "solidão",
    "sozinho",
    "sozinha",
    "vazio",
    "vazia",
    "perdido",
    "perdida",
    "confuso",
    "confusa",
    "inseguro",
    "insegura",
    "culpa",
    "culpado",
    "culpada",
    "decepção",
    "decepcionado",
    "arrependido",
    "arrependimento",
    "morte",
    "morreu",
    "luto",
    "perda",
    "falecimento",
    "saudade",
    "trauma",
    "traumático",
    "estressado",
    "estresse",
    "cansado",
    "cansaço",
    "esgotado",
    "esgotamento",
    "alívio",
    "conforto",
    "consolo",
    "ajuda emocional",
    "apoio emocional",
    "coração",
    "sentimento",
    "sentir",
    "emoção",
    "alma",
    "espírito",
    "interior",
    "suicídio",
  ];

  // Palavras-chave para questões doutrinárias
  const doctrinalKeywords = [
    "doutrina",
    "espiritismo",
    "kardec",
    "allan kardec",
    "livro dos espíritos",
    "evangelho",
    "reencarnação",
    "carma",
    "lei de causa e efeito",
    "perispírito",
    "mediunidade",
    "medium",
    "desencarnado",
    "encarnado",
    "plano espiritual",
    "umbral",
    "colônia espiritual",
    "obsessão",
    "passe",
    "fluidoterapia",
    "centro espírita",
    "casa espírita",
    "oração",
    "prece",
    "evangelho no lar",
    "estudo sistematizado",
    "espírito",
    "alma",
    "deus",
    "jesus",
    "evangelho segundo o espiritismo",
    "o céu e o inferno",
    "a gênese",
    "o livro dos médiuns",
    "jesus cristo",
    "mensagem dos espíritos",
    "comunicação espiritual",
    "vida após a morte",
    "mundo espiritual",
    "lei divina",
    "ética espírita",
    "moral espírita",
    "bíblia",
  ];

  // Palavras-chave de saudação
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
    "como vai",
    "tudo bem",
    "tudo bom",
    "saudações",
    "querido",
    "querida",
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

  // Palavras-chave de temas fora do escopo
  const offTopicKeywords = [
    "engenharia",
    "matemática",
    "programação",
    "física",
    "química",
    "política",
    "economia",
    "negócio",
    "investimento",
    "futebol",
    "filme",
    "música",
    "arte",
    "tecnologia",
    "celular",
    "computador",
    "carro",
    "viagem",
    "trabalho",
    "emprego",
    "ciência",
    "moda",
    "beleza",
    "receita",
    "compra",
    "venda",
    "notícia",
    "jornal",
    "culinária",
    "imóvel",
    "fórmula",
  ];

  // Contagem de matches
  let emotionalMatches = 0;
  let doctrinalMatches = 0;
  let greetingMatches = 0;
  let offTopicMatches = 0;
  let endConversationMatches = 0;

  emotionalKeywords.forEach((k) => message.includes(k) && emotionalMatches++);
  doctrinalKeywords.forEach((k) => message.includes(k) && doctrinalMatches++);
  greetingKeywords.forEach((k) => message.includes(k) && greetingMatches++);
  offTopicKeywords.forEach((k) => message.includes(k) && offTopicMatches++);
  endConversationKeywords.forEach((k) => message.includes(k) && endConversationMatches++);

  // Análise e decisão
  const totalMatches = emotionalMatches + doctrinalMatches + offTopicMatches;

  // Detecção de encerramento
  if (endConversationMatches > 0) {
    return {
      type: IntentionType.END_CONVERSATION,
      confidence: 1,
      shouldRespond: true,
    };
  }

  // Detecção de saudação isolada (início de conversa)
  if (greetingMatches > 0 && totalMatches === 0) {
    return {
      type: IntentionType.GREETING,
      confidence: 0.9,
      shouldRespond: true,
    };
  }

  // Fora do escopo
  if (offTopicMatches > emotionalMatches && offTopicMatches > doctrinalMatches) {
    return {
      type: IntentionType.OFF_TOPIC,
      confidence: offTopicMatches / (offTopicMatches + 1),
      shouldRespond: false,
    };
  }

  // Questão doutrinária - PRIORIDADE ALTA
  // Reduzido threshold de 2 para 1 para capturar mais perguntas doutrinárias
  if (doctrinalMatches > 0) {
    // Se tem palavras doutrinárias, é doutrinária (mesmo que tenha palavras emocionais)
    return {
      type: IntentionType.DOCTRINAL_QUESTION,
      confidence: doctrinalMatches / (doctrinalMatches + 1),
      shouldRespond: false,
      redirectTo: "allan",
    };
  }

  // Apoio emocional - apenas se NÃO tiver palavras doutrinárias
  if (emotionalMatches > 0) {
    return {
      type: IntentionType.EMOTIONAL_SUPPORT,
      confidence: emotionalMatches / (emotionalMatches + 1),
      shouldRespond: true,
      redirectTo: "emotional",
    };
  }

  // Caso desconhecido - assume doutrinária se tiver ponto de interrogação
  if (
    message.includes("?") ||
    message.includes("qual") ||
    message.includes("como") ||
    message.includes("por que") ||
    message.includes("porque")
  ) {
    return {
      type: IntentionType.DOCTRINAL_QUESTION,
      confidence: 0.5,
      shouldRespond: false,
      redirectTo: "allan",
    };
  }

  // Padrão: desconhecido
  return {
    type: IntentionType.UNKNOWN,
    confidence: 0.3,
    shouldRespond: true,
  };
};
