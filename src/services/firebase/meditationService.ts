import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";

/**
 * Registra o uso de uma reflexão/meditação
 * @param reflectionId ID da reflexão lida
 * @param userId ID do usuário ou "guest" se for convidado
 */
export async function logMeditationUsage(
  reflectionId: string,
  userId: string
): Promise<void> {
  try {
    const logsRef = collection(db, "meditation_logs");
    const logData = {
      reflectionId,
      userId,
      action: "read",
      timestamp: serverTimestamp(),
    };

    await addDoc(logsRef, logData);
    console.log(`[MeditationService] Log registrado: ${reflectionId} por ${userId}`);
  } catch (error) {
    console.warn("[MeditationService] Erro ao registrar log:", error);
  }
}
