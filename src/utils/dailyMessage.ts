import { messages } from "@/assets/messages";

interface DailyMessage {
  quote: string;
  author: string;
  backgroundImage: any;
}

// Imagens de fundo por dia da semana
const BACKGROUNDS = [
  require("@/assets/images/meditate/sunday.jpg"), // 0 - Domingo
  require("@/assets/images/meditate/sunday.jpg"), // 1 - Segunda (placeholder)
  require("@/assets/images/meditate/sunday.jpg"), // 2 - Terça (placeholder)
  require("@/assets/images/meditate/sunday.jpg"), // 3 - Quarta (placeholder)
  require("@/assets/images/meditate/sunday.jpg"), // 4 - Quinta (placeholder)
  require("@/assets/images/meditate/sunday.jpg"), // 5 - Sexta (placeholder)
  require("@/assets/images/meditate/sunday.jpg"), // 6 - Sábado (placeholder)
];

/**
 * Calcula o dia do ano (1-365/366)
 */
function getDayOfYear(): number {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear;
}

/**
 * Extrai citação e autor de uma mensagem no formato:
 * "Citação completa. (Autor)"
 */
function parseMessage(msg: string): { quote: string; author: string } {
  const match = msg.match(/^(.+)\s+\(([^)]+)\)$/);
  if (match) {
    return {
      quote: match[1].trim(),
      author: match[2].trim(),
    };
  }
  // Fallback se não encontrar o padrão
  return {
    quote: msg,
    author: "",
  };
}

/**
 * Retorna a mensagem do dia com imagem de fundo
 */
export function getDailyMessage(): DailyMessage {
  const dayOfYear = getDayOfYear();
  const dayOfWeek = new Date().getDay(); // 0-6 (domingo = 0)

  // Seleciona mensagem baseada no dia do ano
  const messageIndex = dayOfYear % messages.length;
  const rawMessage = messages[messageIndex];

  // Parse da mensagem
  const { quote, author } = parseMessage(rawMessage);

  // Seleciona imagem baseada no dia da semana
  const backgroundImage = BACKGROUNDS[dayOfWeek];

  return {
    quote,
    author,
    backgroundImage,
  };
}
