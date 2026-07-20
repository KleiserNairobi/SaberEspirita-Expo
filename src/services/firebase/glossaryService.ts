import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { IGlossaryTerm, GlossaryCategory } from "@/types/glossary";

/**
 * Busca todos os termos do glossário com estratégia Cache-First
 */
export async function getAllGlossaryTerms(): Promise<IGlossaryTerm[]> {
  const glossaryRef = collection(db, "glossary");

  try {
    const cacheSnapshot = await getDocsFromCache(glossaryRef);
    if (!cacheSnapshot.empty) {
      return cacheSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as IGlossaryTerm[];
    }
  } catch {
    // Ignora erro de cache e busca do servidor
  }

  const snapshot = await getDocsFromServer(glossaryRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as IGlossaryTerm[];
}

/**
 * Busca um termo específico por ID com estratégia Cache-First
 */
export async function getGlossaryTermById(id: string): Promise<IGlossaryTerm | null> {
  const termRef = doc(db, "glossary", id);

  try {
    const cacheDoc = await getDocFromCache(termRef);
    if (cacheDoc.exists()) {
      return {
        id: cacheDoc.id,
        ...cacheDoc.data(),
        createdAt: cacheDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: cacheDoc.data().updatedAt?.toDate() || new Date(),
      } as IGlossaryTerm;
    }
  } catch {
    // Ignora erro de cache e busca do servidor
  }

  const termDoc = await getDocFromServer(termRef);

  if (!termDoc.exists()) {
    return null;
  }

  return {
    id: termDoc.id,
    ...termDoc.data(),
    createdAt: termDoc.data().createdAt?.toDate() || new Date(),
    updatedAt: termDoc.data().updatedAt?.toDate() || new Date(),
  } as IGlossaryTerm;
}

/**
 * Busca termos por categoria com estratégia Cache-First
 */
export async function getGlossaryTermsByCategory(
  category: GlossaryCategory
): Promise<IGlossaryTerm[]> {
  const glossaryRef = collection(db, "glossary");
  const categoryQuery = query(glossaryRef, where("category", "==", category));

  try {
    const cacheSnapshot = await getDocsFromCache(categoryQuery);
    if (!cacheSnapshot.empty) {
      return cacheSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as IGlossaryTerm[];
    }
  } catch {
    // Ignora erro de cache e busca do servidor
  }

  const snapshot = await getDocsFromServer(categoryQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as IGlossaryTerm[];
}

function getUTCYearMonth(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Registra a visualização de um termo do glossário
 * @param termId ID do termo visualizado
 * @param userId ID do usuário ou "guest"
 */
export async function logGlossaryView(params: {
  termId: string;
  termLabel: string;
  userId: string;
  origin: "menu" | "lesson";
  lessonId?: string;
}): Promise<void> {
  try {
    const logsRef = collection(db, "glossary_logs");
    const logData = {
      userId: params.userId,
      createdAt: serverTimestamp(),
      yearMonth: getUTCYearMonth(),
      processed: false,
      termId: params.termId,
      termLabel: params.termLabel,
      origin: params.origin,
      ...(params.lessonId ? { lessonId: params.lessonId } : {}),
      action: "view",
      timestamp: serverTimestamp(),
    };

    await addDoc(logsRef, logData);
    if (__DEV__) {
      console.log(
        `[GlossaryService] Log registrado: ${params.termId} por ${params.userId}`
      );
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[GlossaryService] Erro ao registrar log:", error);
    }
  }
}
