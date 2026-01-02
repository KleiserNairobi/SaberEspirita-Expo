import { messages } from "@/assets/messages";

interface DailyThought {
  quote: string;
  author: string;
  backgroundImage: any;
}

// Imagens de fundo por dia da semana
const BACKGROUNDS = [
  require("@/assets/images/meditate/domingo.png"), // 0 - Domingo
  require("@/assets/images/meditate/segunda.png"), // 1 - Segunda
  require("@/assets/images/meditate/terca.png"), // 2 - Terça
  require("@/assets/images/meditate/quarta.png"), // 3 - Quarta
  require("@/assets/images/meditate/quinta.png"), // 4 - Quinta
  require("@/assets/images/meditate/sexta.png"), // 5 - Sexta
  require("@/assets/images/meditate/sabado.png"), // 6 - Sábado
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
export function getDailyThought(): DailyThought {
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
