import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import { ILeaderboardUser, TimeFilter, TimeFilterEnum } from "@/types/leaderboard";

const USERS_SCORES_COLLECTION = "users_scores";

export async function getLeaderboard(period: TimeFilter): Promise<ILeaderboardUser[]> {
  try {
    const fieldMap: Record<string, string> = {
      [TimeFilterEnum.WEEK]: "totalThisWeek",
      [TimeFilterEnum.MONTH]: "totalThisMonth",
      [TimeFilterEnum.ALL]: "totalAllTime",
    };

    const field = fieldMap[period] || "totalAllTime";

    const q = query(
      collection(db, USERS_SCORES_COLLECTION),
      orderBy(field, "desc"),
      limit(200) // Increase buffer to account for stale blockers
    );

    const snapshot = await getDocs(q);
    const now = new Date();

    // Start of Week (Monday 00:00)
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
    const distanceToMonday = (day + 6) % 7;
    startOfWeek.setDate(now.getDate() - distanceToMonday);

    // Start of Month (1st 00:00)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const processedData = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let score = data[field] || 0;

      // Parse lastUpdated with fallback to updatedAt
      let lastUpdated = new Date(0);
      const rawDate = data.lastUpdated || data.updatedAt; // Fallback

      if (rawDate) {
        try {
          if (rawDate.toDate) {
            lastUpdated = rawDate.toDate();
          } else if (rawDate.seconds) {
            lastUpdated = new Date(rawDate.seconds * 1000);
          } else {
            lastUpdated = new Date(rawDate);
          }
        } catch (e) {
          lastUpdated = new Date(0);
        }
      }

      // Safety check for Invalid Date
      if (isNaN(lastUpdated.getTime())) {
        lastUpdated = new Date(0);
      }

      // Check for Staleness
      if (period === TimeFilterEnum.WEEK) {
        if (lastUpdated < startOfWeek) {
          score = 0;
        }
      } else if (period === TimeFilterEnum.MONTH) {
        if (lastUpdated < startOfMonth) {
          score = 0;
        }
      }

      return {
        userId: data.userId,
        userName: data.userName || "Usuário", // Fallback para evitar crash
        photoURL: data.photoURL || null,
        score: score,
        level: data.level || 0,
        // Keep raw data for tie-breaking or debug if needed
      };
    });

    // Filter out users with 0 score
    const activeUsers = processedData.filter((user) => user.score > 0);

    // Re-sort because we might have zeroed out some high scores
    activeUsers.sort((a, b) => b.score - a.score);

    // Assign positions and limit to 100
    return activeUsers.slice(0, 100).map((user, index) => ({
      ...user,
      position: index + 1,
    }));
  } catch (error) {
    console.error("Erro ao buscar leaderboard:", error);
    return [];
  }
}

export async function getUserScore(userId: string): Promise<ILeaderboardUser | null> {
  try {
    const docRef = doc(db, USERS_SCORES_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        userId: data.userId,
        userName: data.userName,
        photoURL: data.photoURL || undefined,
        score: data.totalAllTime || 0,
        totalAllTime: data.totalAllTime || 0,
        totalThisWeek: data.totalThisWeek || 0,
        totalThisMonth: data.totalThisMonth || 0,
        position: 0,
        level: String(data.level || 1),
      };
    }

    // Auto-healing: documento não existe, tentar criar
    console.log(
      "getUserScore: Documento users_scores não encontrado. Tentando autocura..."
    );

    // Buscar dados do usuário na coleção 'users'
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      const newScoreData = {
        userId: userId,
        userName: userData.userName || userData.displayName || "Usuário",
        email: userData.email,
        photoURL: userData.photoURL || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalAllTime: 0,
        totalThisWeek: 0,
        totalThisMonth: 0,
        level: 1,
      };

      // Criar documento scores
      await setDoc(docRef, newScoreData);
      console.log("getUserScore: Documento users_scores recriado com sucesso.");

      return {
        userId: userId,
        userName: newScoreData.userName,
        photoURL: newScoreData.photoURL || undefined,
        score: 0,
        totalAllTime: 0,
        totalThisWeek: 0,
        totalThisMonth: 0,
        position: 0,
        level: String(newScoreData.level),
      };
    }

    // Se nem o usuário existir (muito raro), retornar objeto zerado padrão
    return {
      userId: userId,
      userName: "Usuário",
      photoURL: undefined,
      score: 0,
      totalAllTime: 0,
      totalThisWeek: 0,
      totalThisMonth: 0,
      position: 0,
      level: "0",
    };
  } catch (error) {
    console.error("Erro ao buscar score do usuário:", error);
    // Em caso de erro, retornar objeto zerado para não quebrar a UI
    return {
      userId: userId,
      userName: "Usuário",
      photoURL: undefined,
      score: 0,
      totalAllTime: 0,
      totalThisWeek: 0,
      totalThisMonth: 0,
      position: 0,
      level: "0",
    };
  }
}
