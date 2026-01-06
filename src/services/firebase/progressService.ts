import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "@/configs/firebase/firebase";
import { getCourseById } from "./courseService";

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

  // Buscar informações do curso para calcular porcentagem
  const course = await getCourseById(courseId);
  const totalLessons = course?.lessonCount || 0;

  const progressRef = doc(db, `users/${currentUserId}/courseProgress/${courseId}`);
  const progressDoc = await getDoc(progressRef);

  if (progressDoc.exists()) {
    // Atualizar progresso existente
    const currentProgress = progressDoc.data();
    const completedLessons = currentProgress.completedLessons || [];

    // Adicionar aula se não estiver completa
    if (!completedLessons.includes(lessonId)) {
      const newCompletedCount = completedLessons.length + 1;
      const completionPercent =
        totalLessons > 0 ? Math.round((newCompletedCount / totalLessons) * 100) : 0;

      await updateDoc(progressRef, {
        completedLessons: arrayUnion(lessonId),
        lastLessonId: lessonId,
        lessonsCompletionPercent: completionPercent, // Atualiza a porcentagem
        lastAccessedAt: new Date(),
      });
    }
  } else {
    // Criar novo documento de progresso
    const completionPercent = totalLessons > 0 ? Math.round((1 / totalLessons) * 100) : 0;

    await setDoc(progressRef, {
      userId: currentUserId,
      courseId,
      completedLessons: [lessonId],
      lastLessonId: lessonId,
      lessonsCompletionPercent: completionPercent, // Define porcentagem inicial
      exerciseResults: [],
      exercisesCompletionPercent: 0,
      certificateEligible: false,
      certificateIssued: false,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    });
  }
}
