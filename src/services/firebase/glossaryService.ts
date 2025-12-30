import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { IGlossaryTerm, GlossaryCategory } from "@/types/glossary";

/**
 * Busca todos os termos do glossário
 */
export async function getAllGlossaryTerms(): Promise<IGlossaryTerm[]> {
  const glossaryRef = collection(db, "glossary");
  const snapshot = await getDocs(glossaryRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as IGlossaryTerm[];
}

/**
 * Busca um termo específico por ID
 */
export async function getGlossaryTermById(id: string): Promise<IGlossaryTerm | null> {
  const termDoc = await getDoc(doc(db, "glossary", id));

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
 * Busca termos por categoria
 */
export async function getGlossaryTermsByCategory(
  category: GlossaryCategory
): Promise<IGlossaryTerm[]> {
  const glossaryRef = collection(db, "glossary");
  const categoryQuery = query(glossaryRef, where("category", "==", category));
  const snapshot = await getDocs(categoryQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as IGlossaryTerm[];
}
