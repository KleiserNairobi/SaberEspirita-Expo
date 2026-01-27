import { db } from "@/configs/firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { ICategory, ISubcategory, IQuiz, IQuizHistory } from "@/types/quiz";

// Mapeamento de ícones (mesmo do CLI, adaptado para Lucide)
const iconMapping: Record<string, string> = {
  CONCEITOS: "BookOpen",
  PERSONAGENS: "Users",
  LIVROS: "Library",
  FILMES: "Film",
  ESPIRITOS: "User",
  DIVERSOS: "Sparkles",
};

// ==================== CATEGORIAS ====================

export async function getCategories(): Promise<ICategory[]> {
  try {
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    const categoriesData: ICategory[] = categoriesSnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const titleUpper = (data.title?.toUpperCase() || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return {
        id: docSnap.id,
        name: data.title || "",
        description: data.description || "",
        questionCount: data.quizCount || 0,
        subcategoryCount: data.subcategoryCount || 0,
        icon: iconMapping[titleUpper] || "HelpCircle",
      };
    });
    return categoriesData;
  } catch (error) {
    console.log("Erro ao obter categorias:", error);
    return [];
  }
}

// ==================== SUBCATEGORIAS ====================

export async function getSubcategories(idCategory: string): Promise<ISubcategory[]> {
  try {
    const subcategoriesRef = collection(db, "subcategories");
    const q = query(subcategoriesRef, where("idCategory", "==", idCategory));
    const subcategoriesSnapshot = await getDocs(q);

    const subcategoriesData: ISubcategory[] = subcategoriesSnapshot.docs.map(
      (docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          categoryId: data.idCategory,
          name: data.title || "",
          description: data.subtitle || "",
          questionCount: data.quizCount || 0,
        };
      }
    );
    return subcategoriesData;
  } catch (error) {
    console.log("Erro ao obter subcategorias:", error);
    return [];
  }
}

// ==================== QUIZZES ====================

// ✅ NOVA: Busca por ID exato (genérico)
export async function getQuizById(quizId: string): Promise<IQuiz | null> {
  try {
    const quizDoc = await getDoc(doc(db, "quizes", quizId));
    if (quizDoc.exists()) {
      const quizData = quizDoc.data() as IQuiz;
      return quizData;
    } else {
      console.log(`Quiz não encontrado pelo ID: ${quizId}`);
      return null;
    }
  } catch (error) {
    console.log(`Erro ao obter quiz pelo ID: ${quizId}`, error);
    return null;
  }
}

export async function getQuiz(idSubcategory: string): Promise<IQuiz | null> {
  try {
    return await getQuizById(`QUIZ-${idSubcategory}`);
  } catch (error) {
    console.log(`Erro ao obter quiz para subcategoria: ${idSubcategory}`, error);
    return null;
  }
}

// ==================== PROGRESSO DO USUÁRIO ====================

export async function getUserCompletedSubcategories(
  userId: string,
  categoryId?: string
): Promise<{
  userId: string;
  completedSubcategories: Record<string, string[]>;
  totalCompleted?: number;
}> {
  try {
    const userDoc = await getDoc(doc(db, "users_completed_subcategories", userId));

    const defaultResponse = {
      userId,
      completedSubcategories: {},
    };

    if (!userDoc.exists()) {
      return defaultResponse;
    }

    const userData = userDoc.data();
    if (!userData) {
      return defaultResponse;
    }

    const allData = {
      userId,
      completedSubcategories: userData.completedSubcategories || {},
      totalCompleted: userData.totalCompleted || 0,
    };

    if (categoryId) {
      return {
        userId,
        completedSubcategories: {
          [categoryId]: allData.completedSubcategories[categoryId] || [],
        },
        totalCompleted: allData.completedSubcategories[categoryId]?.length || 0,
      };
    }

    return allData;
  } catch (error) {
    console.error("Erro ao obter subcategorias concluídas:", error);
    return {
      userId,
      completedSubcategories: {},
      totalCompleted: 0,
    };
  }
}

export async function saveUserCompletedSubcategories(
  userId: string,
  categoryId: string,
  subcategoryId: string
): Promise<void> {
  try {
    const userDocRef = doc(db, "users_completed_subcategories", userId);
    const userDoc = await getDoc(userDocRef);
    const data = userDoc.data();

    if (data?.completedSubcategories) {
      if (data.completedSubcategories[categoryId]) {
        await updateDoc(userDocRef, {
          [`completedSubcategories.${categoryId}`]: arrayUnion(subcategoryId),
        });
      } else {
        await updateDoc(userDocRef, {
          [`completedSubcategories.${categoryId}`]: [subcategoryId],
        });
      }
    } else {
      await setDoc(userDocRef, {
        completedSubcategories: {
          [categoryId]: [subcategoryId],
        },
      });
    }
  } catch (error) {
    console.log("Erro ao salvar subcategoria concluída:", error);
  }
}

export async function addUserHistory(
  history: IQuizHistory,
  userName: string
): Promise<void> {
  try {
    const userHistoryRef = doc(
      db,
      "users_history",
      history.userId,
      "history",
      history.subcategoryId
    );
    await setDoc(userHistoryRef, history);
    console.log("Histórico adicionado com sucesso!");
  } catch (error) {
    console.log("Erro ao adicionar histórico:", error);
  }
}

export async function getUserProgress(userId: string): Promise<Record<string, string[]>> {
  try {
    const result = await getUserCompletedSubcategories(userId);
    return result.completedSubcategories;
  } catch (error) {
    console.error("Erro ao buscar progresso:", error);
    return {};
  }
}

// ==================== REMOÇÃO E RECALCULO (LOGIC RETAKE) ====================

export async function updateUserScore(userId: string, userName: string): Promise<void> {
  try {
    const historyRef = collection(db, "users_history", userId, "history");
    const historySnapshot = await getDocs(historyRef);

    const histories = historySnapshot.docs.map((doc) => doc.data() as IQuizHistory);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);

    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    let totalAllTime = 0;
    let totalThisMonth = 0;
    let totalThisWeek = 0;

    histories.forEach((history) => {
      // Compatibilidade com Timestamp ou Date que vem do firestore
      let completedAt = new Date();
      if (history.completedAt instanceof Timestamp) {
        completedAt = history.completedAt.toDate();
      } else if (typeof history.completedAt === "string") {
        completedAt = new Date(history.completedAt);
      } else if (history.completedAt instanceof Date) {
        completedAt = history.completedAt;
      } else if (
        typeof history.completedAt === "object" &&
        "seconds" in (history.completedAt as any)
      ) {
        // Fallback for object with seconds
        completedAt = new Date((history.completedAt as any).seconds * 1000);
      }

      const score = history.score || 0;

      totalAllTime += score;

      if (completedAt >= startOfMonth) {
        totalThisMonth += score;
      }

      if (completedAt >= startOfWeek) {
        totalThisWeek += score;
      }
    });

    const userScoreRef = doc(db, "users_scores", userId);

    const summary = {
      userId,
      userName,
      totalAllTime,
      totalThisMonth,
      totalThisWeek,
      lastUpdated: new Date(),
    };

    await setDoc(userScoreRef, summary);
    console.log("Resumo de score atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar resumo de score do usuário:", error);
  }
}

export async function removeUserHistory(
  userId: string,
  userName: string,
  subcategoryId: string
): Promise<void> {
  try {
    const userHistoryDocRef = doc(db, "users_history", userId, "history", subcategoryId);
    await deleteDoc(userHistoryDocRef);
    await updateUserScore(userId, userName);
    console.log("Removido histórico e computado score do usuário com sucesso!");
  } catch (error) {
    console.log("Ocorreu um erro ao remover o histórico do usuário:", error);
  }
}

export async function removeUserCompletedSubcategory(
  userId: string,
  categoryId: string,
  subcategoryId: string
): Promise<void> {
  try {
    const userDocRef = doc(db, "users_completed_subcategories", userId);
    const userDoc = await getDoc(userDocRef);
    const data = userDoc.data();

    if (data?.completedSubcategories?.[categoryId]) {
      const updatedSubcategories = data.completedSubcategories[categoryId].filter(
        (id: string) => id !== subcategoryId
      );

      // No modular SDK, para atualizar um campo nested, usamos a notação "dot notation"
      // mas precisamos passar o objeto completo se quisermos substituir o array.
      // Ou criar um objeto update.

      if (updatedSubcategories.length > 0) {
        await updateDoc(userDocRef, {
          [`completedSubcategories.${categoryId}`]: updatedSubcategories,
        });
      } else {
        // Se ficar vazio, no CLI ele deletava o campo.
        // No firebase modular é similar.
        // Precisamos importar deleteField se quisermos deletar o campo.
        // Vou apenas deixar array vazio por enquanto para evitar complexidade de import,
        // ou melhor, importar deleteField também?
        // Sim, deleteField seria ideal. Mas array vazio funciona para 'includes' check.
        await updateDoc(userDocRef, {
          [`completedSubcategories.${categoryId}`]: updatedSubcategories,
        });
      }
    }
  } catch (error) {
    console.log("Ocorreu um erro ao remover a subcategoria concluída:", error);
  }
}

// ==================== DESAFIO DIÁRIO ====================

export async function getDailyChallengeQuestions(): Promise<IQuiz | null> {
  try {
    // 1. Buscar todas as categorias
    const categories = await getCategories();
    if (categories.length === 0) return null;

    // 2. Selecionar até 3 categorias aleatórias para garantir variedade
    const shuffledCategories = categories.sort(() => 0.5 - Math.random());
    const selectedCategories = shuffledCategories.slice(0, 3);

    const allQuestions: any[] = [];

    // 3. Para cada categoria selecionada, buscar uma subcategoria aleatória e seu quiz
    for (const category of selectedCategories) {
      const subcategories = await getSubcategories(category.id);
      if (subcategories.length > 0) {
        const randomSub = subcategories[Math.floor(Math.random() * subcategories.length)];
        const quiz = await getQuiz(randomSub.id);

        if (quiz && quiz.questions.length > 0) {
          const questionsWithMeta = quiz.questions.map((q) => ({
            ...q,
            originSubcategory: randomSub.name,
            originCategory: category.name,
          }));
          allQuestions.push(...questionsWithMeta);
        }
      }
    }

    if (allQuestions.length === 0) return null;

    // 4. Embaralhar todas as questões e pegar 5
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

    // 5. Retornar estrutura compatível com IQuiz
    const today = new Date().toISOString().split("T")[0];

    return {
      id: `DAILY_${today}`,
      idCategory: "DAILY",
      idSubcategory: "DAILY_CHALLENGE",
      questions: shuffledQuestions,
    };
  } catch (error) {
    console.error("Erro ao gerar desafio diário:", error);
    return null;
  }
}

// ==================== STREAK ====================

export async function getUserStreak(userId: string): Promise<number> {
  try {
    const historyRef = collection(db, "users_history", userId, "history");
    const q = query(historyRef, where("categoryId", "==", "DAILY"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return 0;

    // Extrair datas de conclusão únicas
    const completedDates = snapshot.docs
      .map((doc) => {
        const data = doc.data() as IQuizHistory;
        const date =
          data.completedAt instanceof Timestamp
            ? data.completedAt.toDate()
            : new Date(data.completedAt);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
      })
      .sort((a, b) => b.localeCompare(a)); // Decrescente

    const uniqueDates = Array.from(new Set(completedDates));

    if (uniqueDates.length === 0) return 0;

    // Calcular sequência
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Se não fez hoje nem ontem, streak quebrou
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
      return 0;
    }

    // Contar dias consecutivos
    let currentDate = new Date(uniqueDates[0]);

    // Se o último foi hoje, começamos a verificar de hoje para trás
    // Se o último foi ontem, começamos de ontem.
    // O loop verifica se current está na lista, depois subtrai um dia.

    for (let i = 0; i < uniqueDates.length; i++) {
      const dateToCheck = uniqueDates[i];
      const stringCurrent = currentDate.toISOString().split("T")[0];

      if (dateToCheck === stringCurrent) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break; // Quebrou a sequência
      }
    }

    return streak;
  } catch (error) {
    console.error("Erro ao calcular streak:", error);
    return 0;
  }
}

export async function getDailyChallengeStatus(userId: string): Promise<boolean> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const dailyId = `DAILY_${today}`;

    // 1. Verificar documento padrão novo (DAILY_YYYY-MM-DD)
    const historyRef = doc(db, "users_history", userId, "history", dailyId);
    let historyDoc = await getDoc(historyRef);

    if (historyDoc.exists()) return true;

    // 2. Fallback: Verificar documento legado/único (DAILY_CHALLENGE)
    // Se o usuário completou o desafio hoje mas antes da atualização de código
    const legacyRef = doc(db, "users_history", userId, "history", "DAILY_CHALLENGE");
    historyDoc = await getDoc(legacyRef);

    if (!historyDoc.exists()) return false;

    const data = historyDoc.data() as IQuizHistory;

    const completedAt =
      data.completedAt instanceof Timestamp
        ? data.completedAt.toDate()
        : new Date(data.completedAt);

    const todayDate = new Date();

    return (
      completedAt.getDate() === todayDate.getDate() &&
      completedAt.getMonth() === todayDate.getMonth() &&
      completedAt.getFullYear() === todayDate.getFullYear()
    );
  } catch (error) {
    console.error("Erro ao verificar status do desafio diário:", error);
    return false;
  }
}
