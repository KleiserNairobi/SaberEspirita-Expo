import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";

function getUTCYearMonth(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Registra o uso do Chat Científico (Sr. Allan)
 * @param userId ID do usuário
 * @param messageLength Tamanho da mensagem enviada
 */
export async function logScientificChat(
  userId: string,
  messageLength: number,
  params?: { origin?: "direct" | "lesson" | "glossary"; lessonId?: string }
): Promise<void> {
  try {
    const logsRef = collection(db, "scientific_chat_logs");
    const logData = {
      userId,
      messageLength,
      origin: params?.origin || "direct",
      ...(params?.lessonId ? { lessonId: params.lessonId } : {}),
      createdAt: serverTimestamp(),
      yearMonth: getUTCYearMonth(),
      processed: false,
      action: "message_sent",
    };
    await addDoc(logsRef, logData);
    if (__DEV__) {
      console.log(`[ChatAnalytics] SciChat log: ${userId}, len ${messageLength}`);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[ChatAnalytics] Erro ao logar SciChat:", error);
    }
  }
}

/**
 * Registra o uso do Chat Emocional (Converse com o Guia)
 * @param userId ID do usuário
 * @param messageLength Tamanho da mensagem enviada
 */
export async function logEmotionalChat(
  userId: string,
  messageLength: number,
  params?: { origin?: "medite" | "ore" }
): Promise<void> {
  try {
    const logsRef = collection(db, "emotional_chat_logs");
    const logData = {
      userId,
      messageLength,
      origin: params?.origin || "ore",
      createdAt: serverTimestamp(),
      yearMonth: getUTCYearMonth(),
      processed: false,
      action: "message_sent",
    };
    await addDoc(logsRef, logData);
    if (__DEV__) {
      console.log(
        `[ChatAnalytics] EmotionalChat log: ${userId}, len ${messageLength}`
      );
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[ChatAnalytics] Erro ao logar EmotionalChat:", error);
    }
  }
}
