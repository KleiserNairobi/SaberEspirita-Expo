import { IPodcast } from "@/types/podcast";
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

export const PODCASTS_COLLECTION = "podcasts";

function getUTCYearMonth(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Converte um documento do Firestore para o tipo IPodcast, tratando Timestamps.
 */
function mapDocToPodcast(doc: any): IPodcast {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
  } as IPodcast;
}

export async function getPodcasts(): Promise<IPodcast[]> {
  try {
    const podcastsRef = collection(db, PODCASTS_COLLECTION);
    const q = query(podcastsRef, orderBy("title", "asc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDocToPodcast);
  } catch (error) {
    console.error("Erro ao buscar podcasts:", error);
    throw error;
  }
}

export async function getFeaturedPodcasts(): Promise<IPodcast[]> {
  try {
    const podcastsRef = collection(db, PODCASTS_COLLECTION);
    const q = query(podcastsRef, where("featured", "==", true), limit(5));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapDocToPodcast);
  } catch (error) {
    console.error("Erro ao buscar podcasts em destaque:", error);
    throw error;
  }
}

export async function getPodcastById(id: string): Promise<IPodcast | null> {
  try {
    const docRef = doc(db, PODCASTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return mapDocToPodcast(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar podcast com ID ${id}:`, error);
    throw error;
  }
}

/**
 * Registra o log de reprodução de um podcast.
 * Usado para métricas e analytics de engajamento.
 */
export async function logPodcastUsage(params: {
  itemId: string;
  itemTitle: string;
  userId: string;
}): Promise<void> {
  try {
    const logsRef = collection(db, "podcast_logs");
    await addDoc(logsRef, {
      userId: params.userId,
      createdAt: serverTimestamp(),
      yearMonth: getUTCYearMonth(),
      processed: false,
      itemId: params.itemId,
      itemTitle: params.itemTitle,
      contentType: "podcast",
      timestamp: serverTimestamp(),
    });

    if (__DEV__) {
      console.log(
        `[Analytics] Podcast log: ${params.itemId} by ${params.userId}`
      );
    }
  } catch (error) {
    console.error("Erro ao registrar uso do podcast:", error);
    // Erros de analytics não devem quebrar o fluxo do usuário
  }
}
