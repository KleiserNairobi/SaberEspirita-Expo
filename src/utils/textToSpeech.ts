import * as Speech from "expo-speech";

/**
 * Narra um texto usando Text-to-Speech
 */
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
 * @param text Texto a ser narrado
 * @param voiceIdentifier ID da voz opcional (ex: identificador único da voz)
 */
export async function speakText(text: string, voiceIdentifier?: string): Promise<void> {
  try {
    const options: Speech.SpeechOptions = {
      language: "pt-BR",
      pitch: 1.0,
      rate: 0.9,
    };

    if (voiceIdentifier) {
      options.voice = voiceIdentifier;
    }

    await Speech.speak(text, options);
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
