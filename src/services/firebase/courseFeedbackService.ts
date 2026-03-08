import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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
