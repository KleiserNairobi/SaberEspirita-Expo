import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";
import * as Storage from "@/utils/Storage";

export interface CourseFeedback {
  userId: string;
  courseId: string;
  rating: number; // 1 a 5
  comment?: string;
}

interface ICourseRatingCache {
  rating: number | null;
  timestamp: number;
}

const RATING_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora de TTL

/**
 * Salva a avaliação (estrelas + comentário) de um curso no Firestore.
 * A coleção utilizada é "course_feedbacks".
 */
export async function saveCourseFeedback(feedback: CourseFeedback): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "course_feedbacks"), {
      ...feedback,
      createdAt: serverTimestamp(),
    });

    // Invalida o cache local da nota deste curso para recarregar atualizado na próxima vez
    if (feedback.courseId) {
      Storage.remove(`@course_rating_${feedback.courseId}`);
    }

    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar feedback do curso:", error);
    throw new Error(
      "Não foi possível salvar a sua avaliação. Tente novamente mais tarde."
    );
  }
}

export async function getCourseAverageRating(courseId: string): Promise<number | null> {
  if (!courseId) return null;

  const cacheKey = `@course_rating_${courseId}`;
  const cached = Storage.load<ICourseRatingCache>(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < RATING_CACHE_TTL_MS) {
    console.log(`[CourseFeedbackService] Média do curso ${courseId} via cache MMKV:`, cached.rating);
    return cached.rating;
  }

  try {
    const q = query(
      collection(db, "course_feedbacks"),
      where("courseId", "==", courseId),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const feedbacks: { userId: string; rating: number; createdAtMillis: number }[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const userId = data.userId;
      const rating = Number(data.rating);

      if (
        userId &&
        typeof rating === "number" &&
        Number.isFinite(rating) &&
        rating >= 1 &&
        rating <= 5
      ) {
        let createdAtMillis = 0;
        if (data.createdAt) {
          if (typeof data.createdAt.toMillis === "function") {
            createdAtMillis = data.createdAt.toMillis();
          } else if (typeof data.createdAt.seconds === "number") {
            createdAtMillis = data.createdAt.seconds * 1000;
          } else if (data.createdAt instanceof Date) {
            createdAtMillis = data.createdAt.getTime();
          }
        }

        feedbacks.push({
          userId,
          rating,
          createdAtMillis,
        });
      }
    });

    // Ordenar decrescente pelo tempo de criação (do mais recente para o mais antigo)
    feedbacks.sort((a, b) => b.createdAtMillis - a.createdAtMillis);

    const uniqueRatingByUserId = new Map<string, number>();
    for (const f of feedbacks) {
      if (!uniqueRatingByUserId.has(f.userId)) {
        uniqueRatingByUserId.set(f.userId, f.rating);
      }
    }

    const ratings = Array.from(uniqueRatingByUserId.values());
    const totalRating = ratings.reduce((sum, r) => sum + r, 0);

    const calculatedRating =
      ratings.length > 0
        ? Math.floor((totalRating / ratings.length) * 10) / 10
        : null;

    // Salva a média calculada no MMKV com TTL de 1 hora
    Storage.save(cacheKey, {
      rating: calculatedRating,
      timestamp: Date.now(),
    });

    return calculatedRating;
  } catch (error) {
    console.error("Erro ao buscar média de avaliação:", error);
    return null;
  }
}
