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
import { 
  ICategory, 
  ISubcategory, 
  IQuiz, 
  IQuizHistory, 
  IDailyChallengeStats, 
  IUserDetailedStats, 
  ICategoryProgress 
} from "@/types/quiz";
import { StatsService } from "@/services/firebase/statsService";

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
// Suporta busca em diferentes coleções para otimizar custos
export async function getQuizById(
  quizId: string,
  collection: "quizes" | "lesson_quizzes" = "quizes"
): Promise<IQuiz | null> {
  try {
    const quizDoc = await getDoc(doc(db, collection, quizId));
    if (quizDoc.exists()) {
      const quizData = quizDoc.data() as IQuiz;
      return quizData;
    } else {
      console.log(`Quiz não encontrado pelo ID: ${quizId} na coleção: ${collection}`);
      return null;
    }
  } catch (error) {
    console.log(`Erro ao obter quiz pelo ID: ${quizId} na coleção: ${collection}`, error);
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

    // Incrementa contador global de quizzes
    const isGuest = history.userId === "guest";
    StatsService.incrementQuizCount("general", isGuest);
  } catch (error) {
    console.log("Erro ao adicionar histórico:", error);
  }
}
/**
 * Busca o histórico de quizzes de um usuário específico
 * @param userId ID do usuário
 * @returns Lista de histórico de quizzes
 */
export async function getUserHistory(userId: string): Promise<IQuizHistory[]> {
  try {
    const historyRef = collection(db, "users_history", userId, "history");
    const historySnapshot = await getDocs(historyRef);
    return historySnapshot.docs.map((doc) => doc.data() as IQuizHistory);
  } catch (error) {
    console.error("[quizService] Erro ao buscar histórico:", error);
    return [];
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
            originCategory: category.name,
            originSubcategory: randomSub.name,
            originSubcategorySubtitle: randomSub.description || undefined,
          }));
          allQuestions.push(...questionsWithMeta);
        }
      }
    }

    if (allQuestions.length === 0) return null;

    // 4. Embaralhar todas as questões e pegar 5
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

    // 5. Retornar estrutura compatível com IQuiz
    const today = new Date()
      .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
      .split(" ")[0];

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
        return date
          .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
          .split(" ")[0]; // YYYY-MM-DD
      })
      .sort((a, b) => b.localeCompare(a)); // Decrescente

    const uniqueDates = Array.from(new Set(completedDates));

    if (uniqueDates.length === 0) return 0;

    // Calcular sequência
    let streak = 0;
    const now = new Date();
    const today = now
      .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
      .split(" " )[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const yesterday = yesterdayDate
      .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
      .split(" ")[0];

    // Se não fez hoje nem ontem, streak quebrou
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
      return 0;
    }

    // Contar dias consecutivos usando as strings
    // Já temos as datas únicas e ordenadas descrescentemente (uniqueDates)
    // A primeira data (uniqueDates[0]) é a âncora (hoje ou ontem)
    
    streak = 1;
    let lastDate = new Date(uniqueDates[0] + "T12:00:00"); // Perto do meio-dia para evitar problemas de fuso ao subtrair dias

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(lastDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const expectedDateStr = prevDate
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .split(" ")[0];

      if (uniqueDates[i] === expectedDateStr) {
        streak++;
        lastDate = prevDate;
      } else {
        break;
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
    const today = new Date()
      .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
      .split(" ")[0];
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

    const completedAtStr = completedAt
      .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
      .split(" ")[0];

    return completedAtStr === today;
  } catch (error) {
    console.error("Erro ao verificar status do desafio diário:", error);
    return false;
  }
}


export async function getDailyChallengeStats(userId: string): Promise<IDailyChallengeStats> {
  const defaultStats: IDailyChallengeStats = {
    currentStreak: 0,
    longestStreak: 0,
    totalChallenges: 0,
    bestAccuracy: 0,
  };

  try {
    // 1. Buscar todos os registros DAILY_* do usuário
    const historyRef = collection(db, "users_history", userId, "history");
    const q = query(historyRef, where("categoryId", "==", "DAILY"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return defaultStats;

    const dailyHistories = snapshot.docs.map((doc) => doc.data() as IQuizHistory);

    // 2. Total de desafios concluidos
    const totalChallenges = dailyHistories.length;

    // 3. Melhor resultado (maior percentual atingido)
    const bestAccuracy = Math.max(...dailyHistories.map((h) => h.percentage || 0));

    // 4. Extrair datas no formato YYYY-MM-DD e ordenar decrescente
    const completedDates = dailyHistories
      .map((h) => {
        const date =
          h.completedAt instanceof Timestamp
            ? h.completedAt.toDate()
            : new Date(h.completedAt);
        return date
          .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
          .split(" ")[0];
      })
      .sort((a, b) => b.localeCompare(a)); // decrescente

    const uniqueDates = Array.from(new Set(completedDates));

    // 5. Streak atual (reutiliza logica existente)
    const currentStreak = await getUserStreak(userId);

    // 6. Maior sequencia historica
    let longestStreak = 0;
    let currentCount = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i] + "T12:00:00");
      const next = new Date(uniqueDates[i + 1] + "T12:00:00");
      const diffDays = Math.round(
        (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentCount++;
      } else {
        longestStreak = Math.max(longestStreak, currentCount);
        currentCount = 1;
      }
    }
    longestStreak = Math.max(longestStreak, currentCount);

    return { currentStreak, longestStreak, totalChallenges, bestAccuracy };
  } catch (error) {
    console.error("Erro ao calcular estatísticas do desafio diário:", error);
    return defaultStats;
  }
}

// ==================== ESTATÍSTICAS DETALHADAS ====================

/**
 * Busca e consolida estatísticas detalhadas de desempenho do usuário.
 * Agrega dados do histórico de quizzes, progresso de subcategorias e categorias.
 * 
 * @param userId ID do usuário no Firebase
 * @returns Objeto com estatísticas consolidadas
 */
export async function getUserDetailedStats(userId: string): Promise<IUserDetailedStats> {
  const defaultStats: IUserDetailedStats = {
    totalQuestions: 0,
    accuracyRate: 0,
    activeDays: 0,
    bestScore: 0,
    categoriesProgress: [],
  };

  if (!userId || userId === "guest") return defaultStats;

  try {
    // Busca dados em paralelo para melhor performance
    const [history, progress, categories] = await Promise.all([
      getUserHistory(userId),
      getUserProgress(userId),
      getCategories(),
    ]);

    if (history.length === 0) {
      // Se não há histórico, mas há categorias, retorna progresso zerado por categoria
      return {
        ...defaultStats,
        categoriesProgress: categories.map((cat) => ({
          categoryId: cat.id,
          categoryName: cat.name,
          totalQuestionsAnswered: 0,
          completionPercentage: 0,
          icon: iconMapping[cat.id] || "HelpCircle",
        })),
      };
    }

    let totalQuestions = 0;
    let totalCorrect = 0;
    let maxPercentage = 0;
    const uniqueDates = new Set<string>();

    // 1. Processar Histórico Bruto
    history.forEach((h) => {
      totalQuestions += h.totalQuestions || 0;
      totalCorrect += h.correctAnswers || 0;
      maxPercentage = Math.max(maxPercentage, h.percentage || 0);

      if (h.completedAt) {
        const date = h.completedAt instanceof Timestamp ? h.completedAt.toDate() : new Date(h.completedAt);
        // Usar formato ISO local para garantir contagem correta por dia sem problemas de fuso
        const dateStr = date.toLocaleDateString("sv-SE"); // YYYY-MM-DD
        uniqueDates.add(dateStr);
      }
    });

    const accuracyRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // 2. Calcular Progresso por Categoria
    // O progresso é baseado na quantidade de subcategorias concluídas vs total da categoria
    const categoriesProgress: ICategoryProgress[] = categories.map((cat) => {
      const completedCount = progress[cat.id]?.length || 0;
      const totalSubcats = cat.subcategoryCount || 0;
      const completionPercentage =
        totalSubcats > 0 ? Math.min(100, Math.round((completedCount / totalSubcats) * 100)) : 0;

      // Filtra questões respondidas especificamente para esta categoria
      const catQuestions = history
        .filter((h) => h.categoryId === cat.id)
        .reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0);

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        totalQuestionsAnswered: catQuestions,
        completionPercentage,
        icon: iconMapping[cat.id] || "HelpCircle",
      };
    });

    return {
      totalQuestions,
      accuracyRate,
      activeDays: uniqueDates.size,
      bestScore: maxPercentage,
      categoriesProgress,
    };
  } catch (error) {
    console.error("[quizService] Erro ao buscar estatísticas detalhadas:", error);
    return defaultStats;
  }
}
