import { IMeditation } from "@/types/meditate";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../configs/firebase/firebase";

export const MEDITATIONS_COLLECTION = "meditations";

export async function getMeditations(): Promise<IMeditation[]> {
  try {
    const meditationsRef = collection(db, MEDITATIONS_COLLECTION);
    const q = query(meditationsRef, orderBy("title", "asc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<IMeditation, "id">),
      id: doc.id,
    }));
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

    return snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<IMeditation, "id">),
      id: doc.id,
    }));
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
      return {
        ...(docSnap.data() as Omit<IMeditation, "id">),
        id: docSnap.id,
      };
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar meditação com ID ${id}:`, error);
    throw error;
  }
}
