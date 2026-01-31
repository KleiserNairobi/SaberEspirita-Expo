import * as Speech from "expo-speech";

/**
 * Remove formatação markdown de um texto para narração limpa
 * @param text Texto com markdown
 * @returns Texto limpo sem formatação
 */
export function stripMarkdown(text: string): string {
  return (
    text
      // Remove negrito: **texto**
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      // Remove itálico: *texto* (apenas se não for parte de **)
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1")
      // Remove links: [texto](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove headers: # Título
      .replace(/^#{1,6}\s+/gm, "")
      // Remove listas: - item ou * item
      .replace(/^[-*]\s+/gm, "")
      // Remove código inline: `código`
      .replace(/`([^`]+)`/g, "$1")
      // Remove quebras de linha duplas e substitui por pausa
      .replace(/\n{2,}/g, ". ")
      // Remove quebras de linha simples
      .replace(/\n/g, " ")
      // Remove espaços múltiplos
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

/**
 * Lista as vozes disponíveis no dispositivo
 */
export async function getAvailableVoices() {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    console.log(
      "Vozes disponíveis:",
      voices.filter((v) => v.language.includes("pt"))
    ); // Filtra apenas PT para facilitar
    return voices;
  } catch (error) {
    console.error("Erro ao listar vozes:", error);
    return [];
  }
}

/**
 * Narra um texto usando Text-to-Speech
 * ✅ Remove automaticamente formatação markdown para narração limpa
 * @param text Texto a ser narrado (pode conter markdown)
 * @param voiceIdentifier ID da voz opcional (ex: identificador único da voz)
 */
export async function speakText(text: string, voiceIdentifier?: string): Promise<void> {
  try {
    // ✅ Remove markdown automaticamente antes de narrar
    const cleanText = stripMarkdown(text);

    const options: Speech.SpeechOptions = {
      language: "pt-BR",
      pitch: 1.0,
      rate: 0.9,
    };

    if (voiceIdentifier) {
      options.voice = voiceIdentifier;
    }

    await Speech.speak(cleanText, options);
  } catch (error) {
    console.error("Erro ao narrar texto:", error);
    throw error;
  }
}

/**
 * Para a narração atual
 */
export async function stopSpeaking(): Promise<void> {
  try {
    await Speech.stop();
  } catch (error) {
    console.error("Erro ao parar narração:", error);
    throw error;
  }
}

/**
 * Verifica se está narrando
 */
export async function isSpeaking(): Promise<boolean> {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error("Erro ao verificar narração:", error);
    return false;
  }
}
