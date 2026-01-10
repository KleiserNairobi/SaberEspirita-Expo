import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
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
      pendingExercises: [],
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

/**
 * Marca exercício como pendente (usuário escolheu "Fazer Depois")
 */
export async function markExerciseAsPending(
  courseId: string,
  lessonId: string,
  userId?: string
): Promise<void> {
  console.log("🔵 [markExerciseAsPending] INÍCIO", { courseId, lessonId, userId });

  const currentUserId = userId || auth.currentUser?.uid;

  if (!currentUserId) {
    console.error("❌ [markExerciseAsPending] Usuário não autenticado");
    throw new Error("Usuário não autenticado");
  }

  const progressRef = doc(db, `users/${currentUserId}/courseProgress/${courseId}`);
  const progressDoc = await getDoc(progressRef);

  if (progressDoc.exists()) {
    const currentProgress = progressDoc.data();
    const pendingExercises = currentProgress.pendingExercises || [];

    // Adicionar exercício se não estiver pendente
    if (!pendingExercises.includes(lessonId)) {
      await updateDoc(progressRef, {
        pendingExercises: arrayUnion(lessonId),
        lastAccessedAt: new Date(),
      });
      console.log("✅ [markExerciseAsPending] Exercício marcado como pendente");
    } else {
      console.log("⚠️ [markExerciseAsPending] Exercício já estava pendente");
    }
  } else {
    console.error("❌ [markExerciseAsPending] Documento de progresso não encontrado");
    throw new Error("Documento de progresso não encontrado");
  }

  console.log("🎉 [markExerciseAsPending] FIM - Sucesso!");
}

/**
 * Remove exercício da lista de pendentes (após conclusão)
 */
export async function removeExerciseFromPending(
  courseId: string,
  lessonId: string,
  userId?: string
): Promise<void> {
  console.log("🔵 [removeExerciseFromPending] INÍCIO", { courseId, lessonId, userId });

  const currentUserId = userId || auth.currentUser?.uid;

  if (!currentUserId) {
    console.error("❌ [removeExerciseFromPending] Usuário não autenticado");
    throw new Error("Usuário não autenticado");
  }

  const progressRef = doc(db, `users/${currentUserId}/courseProgress/${courseId}`);

  await updateDoc(progressRef, {
    pendingExercises: arrayRemove(lessonId),
    lastAccessedAt: new Date(),
  });

  console.log("✅ [removeExerciseFromPending] Exercício removido dos pendentes");
  console.log("🎉 [removeExerciseFromPending] FIM - Sucesso!");
}

/**
 * Salva resultado de exercício e atualiza progresso
 */
export async function saveExerciseResult(
  courseId: string,
  lessonId: string,
  exerciseId: string,
  score: number,
  passed: boolean,
  userId?: string
): Promise<void> {
  console.log("🔵 [saveExerciseResult] INÍCIO", {
    courseId,
    lessonId,
    exerciseId,
    score,
    passed,
    userId,
  });

  const currentUserId = userId || auth.currentUser?.uid;

  if (!currentUserId) {
    console.error("❌ [saveExerciseResult] Usuário não autenticado");
    throw new Error("Usuário não autenticado");
  }

  const progressRef = doc(db, `users/${currentUserId}/courseProgress/${courseId}`);
  const progressDoc = await getDoc(progressRef);

  if (!progressDoc.exists()) {
    console.error("❌ [saveExerciseResult] Documento de progresso não encontrado");
    throw new Error("Documento de progresso não encontrado");
  }

  const currentProgress = progressDoc.data();
  const exerciseResults = currentProgress.exerciseResults || [];

  // Verificar se já existe resultado para este exercício
  const existingResultIndex = exerciseResults.findIndex(
    (result: any) => result.exerciseId === exerciseId
  );

  const newAttempt = {
    attemptNumber:
      existingResultIndex >= 0
        ? exerciseResults[existingResultIndex].attempts.length + 1
        : 1,
    score,
    answers: [],
    startedAt: new Date(),
    completedAt: new Date(),
    timeSpent: 0,
  };

  let updatedResults;
  if (existingResultIndex >= 0) {
    // Atualizar resultado existente
    const existingResult = exerciseResults[existingResultIndex];
    const updatedAttempts = [...existingResult.attempts, newAttempt];
    const bestScore = Math.max(...updatedAttempts.map((a: any) => a.score));

    updatedResults = [...exerciseResults];
    updatedResults[existingResultIndex] = {
      exerciseId,
      attempts: updatedAttempts,
      bestScore,
      passed: passed || existingResult.passed,
      completedAt: passed ? new Date() : existingResult.completedAt,
    };
  } else {
    // Criar novo resultado
    updatedResults = [
      ...exerciseResults,
      {
        exerciseId,
        attempts: [newAttempt],
        bestScore: score,
        passed,
        completedAt: passed ? new Date() : undefined,
      },
    ];
  }

  // Calcular porcentagem de exercícios completos
  const completedExercises = updatedResults.filter((r: any) => r.passed).length;
  const exercisesCompletionPercent =
    exerciseResults.length > 0
      ? Math.round((completedExercises / exerciseResults.length) * 100)
      : 0;

  await updateDoc(progressRef, {
    exerciseResults: updatedResults,
    exercisesCompletionPercent,
    lastAccessedAt: new Date(),
  });

  console.log("✅ [saveExerciseResult] Resultado salvo com sucesso");
  console.log("🎉 [saveExerciseResult] FIM - Sucesso!");
}
