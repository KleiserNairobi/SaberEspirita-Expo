import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";

/**
 * Registra o uso de uma oração
 * @param prayerId ID da oração lida
 * @param userId ID do usuário ou "guest" se for convidado
 */
export async function logPrayerUsage(prayerId: string, userId: string): Promise<void> {
  try {
    const logsRef = collection(db, "prayer_logs");
    const logData = {
      prayerId,
      userId,
      createdAt: serverTimestamp(),
    };

    await addDoc(logsRef, logData);
    console.log(`[PrayerService] Log registrado: ${prayerId} por ${userId}`);
  } catch (error) {
    console.warn("[PrayerService] Erro ao registrar log de oração:", error);
  }
}
