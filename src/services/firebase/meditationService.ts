import { IMeditation } from "@/types/meditate";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../configs/firebase/firebase";

export const MEDITATIONS_COLLECTION = "meditations";

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
    const q = query(meditationsRef, orderBy("title", "asc"));
    const snapshot = await getDocs(q);

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
    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDocToMeditation);
  } catch (error) {
    console.error("Erro ao buscar meditações em destaque:", error);
    throw error;
  }
}

export async function getMeditationById(id: string): Promise<IMeditation | null> {
  try {
    const docRef = doc(db, MEDITATIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

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
      yearMonth: new Date().toISOString().slice(0, 7),
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
