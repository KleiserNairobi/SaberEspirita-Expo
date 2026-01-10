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
  console.log("🔵 [markLessonAsCompleted] INÍCIO", { courseId, lessonId, userId });

  const currentUserId = userId || auth.currentUser?.uid;

  if (!currentUserId) {
    console.error("❌ [markLessonAsCompleted] Usuário não autenticado");
    throw new Error("Usuário não autenticado");
  }

  console.log("✅ [markLessonAsCompleted] UserId:", currentUserId);

  // Buscar informações do curso para calcular porcentagem
  const course = await getCourseById(courseId);
  const totalLessons = course?.lessonCount || 0;
  console.log("📚 [markLessonAsCompleted] Curso encontrado:", { totalLessons });

  const progressRef = doc(db, `users/${currentUserId}/courseProgress/${courseId}`);
  console.log(
    "📍 [markLessonAsCompleted] Path Firestore:",
    `users/${currentUserId}/courseProgress/${courseId}`
  );

  const progressDoc = await getDoc(progressRef);
  console.log("📄 [markLessonAsCompleted] Documento existe?", progressDoc.exists());

  if (progressDoc.exists()) {
    // Atualizar progresso existente
    const currentProgress = progressDoc.data();
    const completedLessons = currentProgress.completedLessons || [];
    console.log("📝 [markLessonAsCompleted] Progresso atual:", { completedLessons });

    // Adicionar aula se não estiver completa
    if (!completedLessons.includes(lessonId)) {
      const newCompletedCount = completedLessons.length + 1;
      const completionPercent =
        totalLessons > 0 ? Math.round((newCompletedCount / totalLessons) * 100) : 0;

      console.log("🔄 [markLessonAsCompleted] Atualizando progresso...", {
        newCompletedCount,
        completionPercent,
      });

      await updateDoc(progressRef, {
        completedLessons: arrayUnion(lessonId),
        lastLessonId: lessonId,
        lessonsCompletionPercent: completionPercent,
        lastAccessedAt: new Date(),
      });

      console.log("✅ [markLessonAsCompleted] Progresso atualizado com sucesso!");
    } else {
      console.log("⚠️ [markLessonAsCompleted] Aula já estava concluída");
    }
  } else {
    // Criar novo documento de progresso
    const completionPercent = totalLessons > 0 ? Math.round((1 / totalLessons) * 100) : 0;

    console.log("🆕 [markLessonAsCompleted] Criando novo documento de progresso...", {
      completionPercent,
    });

    await setDoc(progressRef, {
      userId: currentUserId,
      courseId,
      completedLessons: [lessonId],
      lastLessonId: lessonId,
      lessonsCompletionPercent: completionPercent,
      exerciseResults: [],
      exercisesCompletionPercent: 0,
      certificateEligible: false,
      certificateIssued: false,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
    });

    console.log("✅ [markLessonAsCompleted] Novo documento criado com sucesso!");
  }

  console.log("🎉 [markLessonAsCompleted] FIM - Sucesso!");
}
