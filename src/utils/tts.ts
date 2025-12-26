import * as Speech from "expo-speech";

/**
 * Narra um texto usando Text-to-Speech
 */
export async function speakText(text: string): Promise<void> {
  try {
    await Speech.speak(text, {
      language: "pt-BR",
      pitch: 1.0,
      rate: 0.9,
    });
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
