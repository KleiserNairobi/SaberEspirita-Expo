import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

import { auth } from "@/configs/firebase/firebase";
import { loadString, saveString } from "@/utils/Storage";

const db = getFirestore();

function getDateStr(date: Date = new Date()): string {
  return date.toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).split(" ")[0];
}

function getUTCYearMonth(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getOrCreateGuestId(): string {
  const key = "@guest_device_id";
  const existing = loadString(key);
  if (existing && existing.startsWith("guest_")) return existing;

  const next = `guest_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  saveString(key, next);
  return next;
}

export const StatsService = {
  /**
   * Registra uma visita diária nas estatísticas
   * @param isGuest Se o usuário é convidado
   */
  async logDailyVisit(isGuest: boolean) {
    try {
      const userId = isGuest ? getOrCreateGuestId() : auth.currentUser?.uid;
      if (!userId) return;

      const today = getDateStr();
      const lastKey = `@visit_last_logged:${userId}`;
      const last = loadString(lastKey);
      if (last === today) return;

      await addDoc(collection(db, "visit_logs"), {
        userId,
        isGuest,
        createdAt: serverTimestamp(),
        yearMonth: getUTCYearMonth(),
        processed: false,
      });

      saveString(lastKey, today);

      if (__DEV__) {
        console.log(`[StatsService] Visit logged. Guest: ${isGuest}`);
      }
    } catch (error) {
      console.error("[StatsService] Error logging visit:", error);
    }
  },

};
