import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import { StatsService } from "./statsService";

export async function logAmbientPlay(
  userId: string,
  trackTitle: string,
  trackId: string
): Promise<void> {
  try {
    const logsRef = collection(db, "ambient_player_logs");
    const logData = {
      userId,
      trackTitle,
      trackId,
      action: "play",
      timestamp: serverTimestamp(),
    };
    await addDoc(logsRef, logData);

    // Atualiza estatísticas globais e diárias
    await StatsService.incrementAmbientPlayCount();
    if (__DEV__) {
      console.log(`[Analytics] Ambient Play logged: ${trackTitle}`);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[Analytics] Failed to log ambient play:", error);
    }
  }
}
