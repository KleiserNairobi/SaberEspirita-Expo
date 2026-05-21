import {
  addDoc,
  collection,
  doc,
  getFirestore,
  increment,
  serverTimestamp,
  setDoc,
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

  /**
   * Incrementa o contador global de quizzes realizados
   * @param type 'general' (Quizzes Gerais) ou 'lesson' (Exercícios de Lições)
   * @param isGuest Se o usuário é convidado
   */
  async incrementQuizCount(
    type: "general" | "lesson" = "general",
    isGuest: boolean = false
  ) {
    try {
      const globalDocId = type === "general" ? "quizzes" : "lesson_quizzes";
      const dailyField =
        type === "general" ? "generalQuizAttempts" : "lessonQuizAttempts";
      const dailyGuestField =
        type === "general" ? "generalQuizAttempts_guest" : "lessonQuizAttempts_guest";
      const dailyUserField =
        type === "general" ? "generalQuizAttempts_user" : "lessonQuizAttempts_user";

      // 1. Atualizar Global Stats (Total acumulado)
      const globalStatsRef = doc(db, "global_stats", globalDocId);
      await setDoc(
        globalStatsRef,
        {
          totalAttempts: increment(1),
        },
        { merge: true }
      );

      // 2. Atualizar Daily Stats (Tendência diária)
      const today = new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .split(" ")[0];
      const dailyStatsRef = doc(db, "daily_stats", today);
      await setDoc(
        dailyStatsRef,
        {
          date: today,
          [dailyField]: increment(1),
          [dailyGuestField]: isGuest ? increment(1) : increment(0),
          [dailyUserField]: !isGuest ? increment(1) : increment(0),
          // Mantém o total combinado para retrocompatibilidade se necessário, ou removemos?
          // Vou manter quizAttempts como soma por enquanto para evitar quebras imediatas, mas o foco é separar.
          quizAttempts: increment(1),
        },
        { merge: true }
      );

      if (__DEV__) {
        console.log(`[StatsService] Quiz count incremented (${type}).`);
      }
    } catch (error) {
      console.error("[StatsService] Error incrementing quiz count:", error);
    }
  },

  /**
   * Incrementa o contador global de plays do player ambiente (Sintonia)
   * @param isGuest Se o usuário é convidado
   */
  async incrementAmbientPlayCount(isGuest: boolean = false) {
    try {
      // 1. Atualizar Global Stats
      const globalStatsRef = doc(db, "global_stats", "ambient_player");
      await setDoc(
        globalStatsRef,
        {
          totalPlays: increment(1),
        },
        { merge: true }
      );

      // 2. Atualizar Daily Stats
      const today = new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .split(" ")[0];
      const dailyStatsRef = doc(db, "daily_stats", today);
      await setDoc(
        dailyStatsRef,
        {
          date: today,
          ambientPlayerPlays: increment(1),
          ambientPlayerPlays_guest: isGuest ? increment(1) : increment(0),
          ambientPlayerPlays_user: !isGuest ? increment(1) : increment(0),
        },
        { merge: true }
      );

      if (__DEV__) {
        console.log(`[StatsService] Ambient play count incremented.`);
      }
    } catch (error) {
      console.error("[StatsService] Error incrementing ambient play count:", error);
    }
  },
};
