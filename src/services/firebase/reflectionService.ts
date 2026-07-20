import {
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
  where,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { IReflection } from "@/types/reflection";

/**
 * Converte os dados do Firestore para o tipo IReflection,
 * tratando a conversão de Timestamp para Date se necessário.
 */
function mapDocToReflection(doc: any): IReflection {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
  } as IReflection;
}

/**
 * Busca todas as reflexões do Firestore
 */
export async function getAllReflections(): Promise<IReflection[]> {
  try {
    const q = query(
      collection(db, "reflections"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        return cacheSnapshot.docs.map(mapDocToReflection);
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const snapshot = await getDocsFromServer(q);
    return snapshot.docs.map(mapDocToReflection);
  } catch (error) {
    console.error("Erro ao buscar reflexões:", error);
    return [];
  }
}

/**
 * Busca apenas reflexões em destaque
 */
export async function getFeaturedReflections(): Promise<IReflection[]> {
  try {
    const q = query(
      collection(db, "reflections"),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    try {
      const cacheSnapshot = await getDocsFromCache(q);
      if (!cacheSnapshot.empty) {
        return cacheSnapshot.docs.map(mapDocToReflection);
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const snapshot = await getDocsFromServer(q);
    return snapshot.docs.map(mapDocToReflection);
  } catch (error) {
    console.error("Erro ao buscar reflexões em destaque:", error);
    return [];
  }
}

/**
 * Busca uma reflexão específica por ID
 */
export async function getReflectionById(id: string): Promise<IReflection | null> {
  try {
    const docRef = doc(db, "reflections", id);

    try {
      const cacheSnap = await getDocFromCache(docRef);
      if (cacheSnap.exists()) {
        return mapDocToReflection(cacheSnap);
      }
    } catch {
      // Ignora erro de cache e busca do servidor
    }

    const docSnap = await getDocFromServer(docRef);

    if (docSnap.exists()) {
      return mapDocToReflection(docSnap);
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar reflexão:", error);
    return null;
  }
}

