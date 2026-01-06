import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "@/configs/firebase/firebase";

/**
 * Marca uma aula como concluída e atualiza o progresso do usuário no curso
 */
export async function markLessonAsCompleted(
  courseId: string,
  lessonId: string,
  userId?: string
): Promise<void> {
  const currentUserId = userId || auth.currentUser?.uid;

  if (!currentUserId) {
    throw new Error("Usuário não autenticado");
  }

  const progressRef = doc(db, `users/${currentUserId}/courseProgress/${courseId}`);
  const progressDoc = await getDoc(progressRef);

  if (progressDoc.exists()) {
    // Atualizar progresso existente
    const currentProgress = progressDoc.data();
    const completedLessons = currentProgress.completedLessons || [];

    // Adicionar aula se não estiver completa
    if (!completedLessons.includes(lessonId)) {
      await updateDoc(progressRef, {
        completedLessons: arrayUnion(lessonId),
        lastLessonId: lessonId,
        lastAccessedAt: new Date(),
      });
    }
  } else {
    // Criar novo documento de progresso
    await setDoc(progressRef, {
      userId,
      courseId,
      completedLessons: [lessonId],
      lastLessonId: lessonId,
      lessonsCompletionPercent: 0,
      exerciseResults: [],
      exercisesCompletionPercent: 0,
      certificateEligible: false,
      certificateIssued: false,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    });
  }
}
