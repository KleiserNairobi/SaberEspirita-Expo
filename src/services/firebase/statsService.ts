import { doc, setDoc, increment, getFirestore } from "firebase/firestore";

const db = getFirestore();

export const StatsService = {
  /**
   * Registra uma visita diária nas estatísticas
   * @param isGuest Se o usuário é convidado
   */
  async logDailyVisit(isGuest: boolean) {
    try {
      const today = new Date()
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .split(" ")[0]; // YYYY-MM-DD
      const statsRef = doc(db, "daily_stats", today);

      await setDoc(
        statsRef,
        {
          date: today,
          totalVisits: increment(1),
          guestVisits: isGuest ? increment(1) : increment(0),
          userVisits: !isGuest ? increment(1) : increment(0),
        },
        { merge: true }
      );

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
   * Incrementa o contador global de meditações/reflexões realizadas
   * @param type 'reflection' ou 'guided'
   * @param isGuest Se o usuário é convidado
   */
  async incrementMeditationCount(
    type: "reflection" | "guided" = "guided",
    isGuest: boolean = false
  ) {
    try {
      const globalDocId = type === "reflection" ? "meditation" : "guided_meditations";
      const dailyField =
        type === "reflection" ? "reflectionSessions" : "guidedMeditationSessions";
      const dailyGuestField =
        type === "reflection"
          ? "reflectionSessions_guest"
          : "guidedMeditationSessions_guest";
      const dailyUserField =
        type === "reflection"
          ? "reflectionSessions_user"
          : "guidedMeditationSessions_user";

      // 1. Atualizar Global Stats
      const globalStatsRef = doc(db, "global_stats", globalDocId);
      await setDoc(
        globalStatsRef,
        {
          totalSessions: increment(1),
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
          [dailyField]: increment(1),
          [dailyGuestField]: isGuest ? increment(1) : increment(0),
          [dailyUserField]: !isGuest ? increment(1) : increment(0),
        },
        { merge: true }
      );

      if (__DEV__) {
        console.log(`[StatsService] Meditation count incremented (${type}).`);
      }
    } catch (error) {
      console.error("[StatsService] Error incrementing meditation count:", error);
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
