import { IMeditation } from "@/types/meditate";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../configs/firebase/firebase";

export const MEDITATIONS_COLLECTION = "meditations";

function getUTCYearMonth(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Converte um documento do Firestore para o tipo IMeditation, tratando Timestamps
 */
function mapDocToMeditation(doc: any): IMeditation {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
  } as IMeditation;
}

export async function getMeditations(): Promise<IMeditation[]> {
  try {
    const meditationsRef = collection(db, MEDITATIONS_COLLECTION);
    const q = query(meditationsRef, orderBy("title", "asc"), limit(50));
    
    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        return cacheSnapshot.docs.map(mapDocToMeditation);
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const snapshot = await getDocsFromServer(q);
    return snapshot.docs.map(mapDocToMeditation);
  } catch (error) {
    console.error("Erro ao buscar meditações:", error);
    throw error;
  }
}

export async function getFeaturedMeditations(): Promise<IMeditation[]> {
  try {
    const meditationsRef = collection(db, MEDITATIONS_COLLECTION);
    const q = query(meditationsRef, where("featured", "==", true), limit(5));
    
    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        return cacheSnapshot.docs.map(mapDocToMeditation);
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const snapshot = await getDocsFromServer(q);
    return snapshot.docs.map(mapDocToMeditation);
  } catch (error) {
    console.error("Erro ao buscar meditações em destaque:", error);
    throw error;
  }
}

export async function getMeditationById(id: string): Promise<IMeditation | null> {
  try {
    const docRef = doc(db, MEDITATIONS_COLLECTION, id);
    
    try {
      const cacheSnap = await getDocFromCache(docRef);
      if (cacheSnap.exists()) {
        return mapDocToMeditation(cacheSnap);
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const docSnap = await getDocFromServer(docRef);
    if (docSnap.exists()) {
      return mapDocToMeditation(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar meditação com ID ${id}:`, error);
    throw error;
  }
}

/**
 * Registra o uso (log) de uma meditação/reflexão.
 * Opcional, usado para métricas de usuário.
 */
export async function logMeditationUsage(
  params: {
    itemId: string;
    itemTitle: string;
    userId: string;
    contentType: "reflection" | "guided_meditation";
  }
): Promise<void> {
  try {
    const logsRef = collection(db, "meditation_logs");
    await addDoc(logsRef, {
      userId: params.userId,
      createdAt: serverTimestamp(),
      yearMonth: getUTCYearMonth(),
      processed: false,
      itemId: params.itemId,
      itemTitle: params.itemTitle,
      contentType: params.contentType,
      type: params.contentType === "guided_meditation" ? "guided" : "reflection",
      timestamp: serverTimestamp(),
    });

    if (__DEV__) {
      console.log(
        `[Analytics] Meditation log: ${params.itemId} (${params.contentType}) by ${params.userId}`
      );
    }
  } catch (error) {
    console.error("Erro ao registrar uso da meditação:", error);
    // Erros de analytics não devem quebrar o fluxo do usuário
  }
}
