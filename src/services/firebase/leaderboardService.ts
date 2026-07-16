import { collection, limit, orderBy, query } from "firebase/firestore";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { ILeaderboardUser, TimeFilter, TimeFilterEnum } from "@/types/leaderboard";

const USERS_SCORES_COLLECTION = "users_scores";

interface ILeaderboardCache {
  data: ILeaderboardUser[];
  timestamp: number;
}

const leaderboardCache: Record<string, ILeaderboardCache> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos em milissegundos

export async function getLeaderboard(period: TimeFilter): Promise<ILeaderboardUser[]> {
  try {
    const nowMs = Date.now();
    const cached = leaderboardCache[period];

    if (cached && nowMs - cached.timestamp < CACHE_TTL_MS) {
      console.log(`[Leaderboard] Retornando dados do cache para o período: ${period}`);
      return cached.data;
    }

    const fieldMap: Record<string, string> = {
      [TimeFilterEnum.WEEK]: "totalThisWeek",
      [TimeFilterEnum.MONTH]: "totalThisMonth",
      [TimeFilterEnum.ALL]: "totalAllTime",
    };

    const field = fieldMap[period] || "totalAllTime";

    const q = query(
      collection(db, USERS_SCORES_COLLECTION),
      orderBy(field, "desc"),
      limit(100) // Otimizado de 200 para 100 (contadores antigos limpos pelo backend)
    );

    const snapshot = await getDocs(q);
    const now = new Date();

    // Início da semana (Domingo às 00:00)
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - startOfWeek.getDay());

    // Início do mês (Dia 1º às 00:00)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const processedData = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let score = data[field] || 0;

      // Analisa lastUpdated com fallback para updatedAt
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

      // Verificação de segurança para data inválida
      if (isNaN(lastUpdated.getTime())) {
        lastUpdated = new Date(0);
      }

      // Verifica se as pontuações são de períodos anteriores (camada extra de segurança)
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
      };
    });

    // Filtra usuários com pontuação maior que 0
    const activeUsers = processedData.filter((user) => user.score > 0);

    // Reordena porque podemos ter zerado algumas pontuações que estavam obsoletas
    activeUsers.sort((a, b) => b.score - a.score);

    // Atribui as posições no ranking e limita em até 100 usuários
    const result = activeUsers.slice(0, 100).map((user, index) => ({
      ...user,
      position: index + 1,
    }));

    // Salvar resultado no cache em memória
    leaderboardCache[period] = {
      data: result,
      timestamp: Date.now(),
    };

    return result;
  } catch (error) {
    console.error("Erro ao buscar leaderboard:", error);
    // Fallback: se a consulta falhar, tenta retornar o cache anterior mesmo que expirado
    if (leaderboardCache[period]) {
      console.log(
        `[Leaderboard] Retornando cache anterior para ${period} como fallback após falha.`
      );
      return leaderboardCache[period].data;
    }
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

    // Autocura: se o documento de scores não existe, tenta criar a partir do perfil
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

      // Criar documento de pontuações
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
