import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebase/firebase";

export interface CourseFeedback {
  userId: string;
  courseId: string;
  rating: number; // 1 a 5
  comment?: string;
}

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
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar feedback do curso:", error);
    throw new Error(
      "Não foi possível salvar a sua avaliação. Tente novamente mais tarde."
    );
  }
}

export async function getCourseAverageRating(courseId: string): Promise<number | null> {
  try {
    const q = query(
      collection(db, "course_feedbacks"),
      where("courseId", "==", courseId)
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

    return ratings.length > 0
      ? Math.floor((totalRating / ratings.length) * 10) / 10
      : null;
  } catch (error) {
    console.error("Erro ao buscar média de avaliação:", error);
    return null;
  }
}
