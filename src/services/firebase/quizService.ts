import { db } from "@/configs/firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { IQuiz, IQuizHistory, ICategory, ISubcategory } from "@/types/quiz";

// ==================== CATEGORIAS ====================

/**
 * Buscar todas as categorias
 */
export async function getCategories(): Promise<ICategory[]> {
  // Por enquanto, retornar dados mockados
  // TODO: Implementar busca no Firestore quando coleção estiver criada
  return MOCK_CATEGORIES;
}

// ==================== SUBCATEGORIAS ====================

/**
 * Buscar subcategorias por categoria
 */
export async function getSubcategories(categoryId: string): Promise<ISubcategory[]> {
  // TODO: Implementar busca no Firestore
  // const subcategoriesRef = collection(db, 'subcategories');
  // const q = query(subcategoriesRef, where('categoryId', '==', categoryId));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ISubcategory));

  return MOCK_SUBCATEGORIES.filter((sub) => sub.categoryId === categoryId);
}

// ==================== QUIZZES ====================

/**
 * Buscar quiz por subcategoria
 */
export async function getQuiz(subcategoryId: string): Promise<IQuiz> {
  const quizRef = doc(db, "quizzes", subcategoryId);
  const quizSnap = await getDoc(quizRef);

  if (!quizSnap.exists()) {
    throw new Error("Quiz não encontrado");
  }

  return { id: quizSnap.id, ...quizSnap.data() } as IQuiz;
}

// ==================== PROGRESSO DO USUÁRIO ====================

/**
 * Salvar subcategoria como concluída
 */
export async function saveUserCompletedSubcategories(
  userId: string,
  categoryId: string,
  subcategoryId: string
): Promise<void> {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    [`completedSubcategories.${categoryId}`]: arrayUnion(subcategoryId),
  });
}

/**
 * Adicionar quiz ao histórico do usuário
 */
export async function addUserHistory(
  history: IQuizHistory,
  userName: string
): Promise<void> {
  const historyRef = doc(collection(db, "users_history"));

  await setDoc(historyRef, {
    ...history,
    userName,
    completedAt: Timestamp.fromDate(history.completedAt),
  });
}

/**
 * Buscar progresso do usuário (subcategorias concluídas)
 */
export async function getUserProgress(userId: string): Promise<Record<string, string[]>> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return {};
  }

  const userData = userSnap.data();
  return userData.completedSubcategories || {};
}

// ==================== DADOS MOCKADOS ====================

const MOCK_CATEGORIES: ICategory[] = [
  {
    id: "conceitos",
    name: "Conceitos",
    description: "Teste seus conhecimentos sobre os ensinamentos do Espiritismo",
    questionCount: 1077,
    icon: "BookOpen",
    gradientColors: ["#8B5CF6", "#6366F1"],
  },
  {
    id: "diversos",
    name: "Diversos",
    description: "Questões variadas sobre o Espiritismo",
    questionCount: 132,
    icon: "Sparkles",
    gradientColors: ["#F59E0B", "#EF4444"],
  },
  {
    id: "espiritos",
    name: "Espíritos",
    description: "Conhecimentos sobre o mundo espiritual",
    questionCount: 187,
    icon: "Ghost",
    gradientColors: ["#10B981", "#06B6D4"],
  },
  {
    id: "filmes",
    name: "Filmes",
    description: "Questões sobre filmes espíritas",
    questionCount: 148,
    icon: "Film",
    gradientColors: ["#EC4899", "#8B5CF6"],
  },
  {
    id: "livros",
    name: "Livros",
    description: "Conhecimentos sobre obras espíritas",
    questionCount: 107,
    icon: "Library",
    gradientColors: ["#3B82F6", "#8B5CF6"],
  },
  {
    id: "personagens",
    name: "Personagens",
    description: "Questões sobre personalidades do Espiritismo",
    questionCount: 626,
    icon: "Users",
    gradientColors: ["#F59E0B", "#F97316"],
  },
];

const MOCK_SUBCATEGORIES: ISubcategory[] = [
  {
    id: "manifestacoes-hydesville",
    categoryId: "conceitos",
    name: "As Manifestações em Hydesville",
    description: "A Origem dos Fenômenos Espíritas",
    questionCount: 10,
  },
  {
    id: "impacto-fenomenos",
    categoryId: "conceitos",
    name: "Impacto e Lições dos Fenômenos",
    description: "Hydesville e Seu Impacto no Espiritismo",
    questionCount: 9,
  },
];
