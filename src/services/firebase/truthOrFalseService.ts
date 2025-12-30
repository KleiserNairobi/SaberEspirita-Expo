import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import { loadString, saveString, remove, clear } from "@/utils/Storage";
import { useAuthStore } from "@/stores/authStore";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";
import { ITruthOrFalseStats, getDefaultStats } from "@/types/truthOrFalseStats";
import { calculateStats, getTodayString } from "@/utils/truthOrFalseUtils";

// Chaves de armazenamento
const KEYS = {
  STATS: "truthOrFalse_stats",
  STATS_TIME: "truthOrFalse_stats_time",
  MIGRATED: "truthOrFalse_migrated",
  responsePrefix: (date: string) => `truthOrFalse_${date}`,
};

// Tempo de cache para estatísticas (1 hora)
const STATS_CACHE_DURATION = 3600000;

/**
 * Service para gerenciar dados do Verdade ou Mentira
 * Implementa arquitetura híbrida: Firestore (primário) + MMKV (cache)
 */
export class TruthOrFalseService {
  /**
   * Verifica se o usuário já respondeu ao desafio de hoje
   */
  static async hasRespondedToday(): Promise<boolean> {
    const response = await this.getTodayResponse();
    return response !== null;
  }

  /**
   * Obtém a resposta do usuário para o desafio de hoje
   * Busca do cache local primeiro, depois do Firestore
   */
  static async getTodayResponse(): Promise<IUserTruthOrFalseResponse | null> {
    const today = getTodayString();
    const userId = useAuthStore.getState().user?.uid;

    if (!userId) return null;

    try {
      // 1. Tentar cache local primeiro (rápido)
      const cached = loadString(KEYS.responsePrefix(today));
      if (cached) {
        return JSON.parse(cached);
      }

      // 2. Buscar no Firestore
      const docRef = doc(
        db,
        "users",
        userId,
        "truthOrFalseResponses",
        `${userId}_${today}`
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as IUserTruthOrFalseResponse;
        // Cachear localmente
        saveString(KEYS.responsePrefix(today), JSON.stringify(data));
        return data;
      }
    } catch (error) {
      console.error("Erro ao buscar resposta de hoje:", error);
    }

    return null;
  }

  /**
   * Salva a resposta do usuário
   * Salva localmente (MMKV) E no Firestore
   */
  static async saveResponse(
    response: Omit<IUserTruthOrFalseResponse, "date">
  ): Promise<boolean> {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) {
      console.error("Usuário não autenticado");
      return false;
    }

    const today = getTodayString();
    const fullResponse: IUserTruthOrFalseResponse = {
      ...response,
      date: today,
    };

    try {
      // 1. Salvar no MMKV (cache local - instantâneo)
      saveString(KEYS.responsePrefix(today), JSON.stringify(fullResponse));

      // 2. Sincronizar com Firestore (background)
      const docRef = doc(db, "users", userId, "truthOrFalseResponses", response.id);
      await setDoc(docRef, fullResponse);

      // 3. Invalidar cache de estatísticas
      remove(KEYS.STATS);
      remove(KEYS.STATS_TIME);

      return true;
    } catch (error) {
      console.error("Erro ao salvar resposta:", error);
      // Mesmo com erro no Firestore, mantém no cache local
      return true; // Retorna true porque salvou localmente
    }
  }

  /**
   * Obtém o histórico de respostas do usuário
   * Com paginação opcional
   */
  static async getHistory(limitCount = 30): Promise<IUserTruthOrFalseResponse[]> {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return [];

    try {
      const responsesRef = collection(db, "users", userId, "truthOrFalseResponses");
      const q = query(responsesRef, orderBy("date", "desc"), limit(limitCount));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IUserTruthOrFalseResponse[];
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return [];
    }
  }

  /**
   * Obtém todas as respostas do usuário
   */
  static async getAllResponses(): Promise<IUserTruthOrFalseResponse[]> {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return [];

    try {
      const responsesRef = collection(db, "users", userId, "truthOrFalseResponses");
      const snapshot = await getDocs(responsesRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IUserTruthOrFalseResponse[];
    } catch (error) {
      console.error("Erro ao buscar todas as respostas:", error);
      return [];
    }
  }

  /**
   * Obtém as estatísticas do usuário
   * Usa cache local com validade de 1 hora
   */
  static async getStats(): Promise<ITruthOrFalseStats> {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return getDefaultStats();

    try {
      // Verificar cache local primeiro
      const cachedStats = loadString(KEYS.STATS);
      const cachedTimeStr = loadString(KEYS.STATS_TIME);
      const cachedTime = cachedTimeStr ? parseInt(cachedTimeStr, 10) : null;
      const now = Date.now();

      // Cache válido por 1 hora
      if (cachedStats && cachedTime && now - cachedTime < STATS_CACHE_DURATION) {
        return JSON.parse(cachedStats);
      }

      // Buscar todas as respostas e calcular
      const responses = await this.getAllResponses();
      const stats = calculateStats(responses);

      // Cachear resultado
      saveString(KEYS.STATS, JSON.stringify(stats));
      saveString(KEYS.STATS_TIME, now.toString());

      return stats;
    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error);
      return getDefaultStats();
    }
  }

  /**
   * Obtém a sequência atual de respostas corretas
   */
  static async getCurrentStreak(): Promise<number> {
    const stats = await this.getStats();
    return stats.currentStreak;
  }

  /**
   * Marca uma pergunta como salva na biblioteca do usuário
   */
  static async markAsSaved(questionId: string): Promise<boolean> {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return false;

    try {
      // Buscar todas as respostas para encontrar a pergunta
      const responses = await this.getAllResponses();
      const response = responses.find((r) => r.questionId === questionId);

      if (!response) return false;

      // Atualizar no Firestore
      const docRef = doc(db, "users", userId, "truthOrFalseResponses", response.id);
      await updateDoc(docRef, { savedToLibrary: true });

      // Atualizar cache local
      const updatedResponse = { ...response, savedToLibrary: true };
      saveString(KEYS.responsePrefix(response.date), JSON.stringify(updatedResponse));

      return true;
    } catch (error) {
      console.error("Erro ao marcar como salvo:", error);
      return false;
    }
  }

  /**
   * Obtém perguntas salvas para revisão
   */
  static async getSavedQuestions(): Promise<IUserTruthOrFalseResponse[]> {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) return [];

    try {
      const responsesRef = collection(db, "users", userId, "truthOrFalseResponses");
      const q = query(
        responsesRef,
        where("savedToLibrary", "==", true),
        orderBy("date", "desc")
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IUserTruthOrFalseResponse[];
    } catch (error) {
      console.error("Erro ao buscar perguntas salvas:", error);
      return [];
    }
  }

  /**
   * Limpa todos os dados do usuário (cache local)
   * Útil para logout ou reset
   */
  static clearLocalCache(): void {
    clear();
  }
}
