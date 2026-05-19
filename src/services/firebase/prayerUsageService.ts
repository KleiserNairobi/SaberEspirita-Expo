import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";

function getUTCYearMonth(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Registra o uso de uma oração
 * @param prayerId ID da oração lida
 * @param userId ID do usuário ou "guest" se for convidado
 */
export async function logPrayerUsage(params: {
  prayerId: string;
  prayerTitle: string;
  userId: string;
}): Promise<void> {
  try {
    const logsRef = collection(db, "prayer_logs");
    const logData = {
      userId: params.userId,
      createdAt: serverTimestamp(),
      yearMonth: getUTCYearMonth(),
      processed: false,
      prayerId: params.prayerId,
      prayerTitle: params.prayerTitle,
      timestamp: serverTimestamp(),
    };

    await addDoc(logsRef, logData);
    console.log(
      `[PrayerService] Log registrado: ${params.prayerId} por ${params.userId}`
    );
  } catch (error) {
    console.warn("[PrayerService] Erro ao registrar log de oração:", error);
  }
}
