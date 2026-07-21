import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "@/configs/firebase/firebase";

function getUTCYearMonth(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function logLessonCompleted(params: {
  userId: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
}): Promise<void> {
  try {
    const logsRef = collection(db, "lesson_logs");
    await addDoc(logsRef, {
      userId: params.userId,
      createdAt: serverTimestamp(),
      yearMonth: getUTCYearMonth(),
      processed: false,
      courseId: params.courseId,
      lessonId: params.lessonId,
      lessonTitle: params.lessonTitle,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn("[logLessonCompleted] Failed to log lesson completion:", error);
    }
  }
}

const lastTouchCache = new Map<string, number>();
const TOUCH_THROTTLE_MS = 15 * 60 * 1000; // 15 minutos de intervalo mínimo entre atualizações de acesso simples

export async function touchCourseAccess(
  courseId: string,
  params?: { lessonId?: string; userId?: string }
): Promise<void> {
  const currentUserId = params?.userId || auth.currentUser?.uid;
  if (!currentUserId || currentUserId === "guest") return;

  const cacheKey = `${currentUserId}_${courseId}_${params?.lessonId ?? ""}`;
  const now = Date.now();
  const lastTouch = lastTouchCache.get(cacheKey) || 0;

  // Evita chamadas repetidas de rede ao Firestore se o acesso ocorreu a menos de 15 minutos
  if (now - lastTouch < TOUCH_THROTTLE_MS) {
    return;
  }
  lastTouchCache.set(cacheKey, now);

  const progressRef = doc(db, `users/${currentUserId}/courseProgress/${courseId}`);
  const lastAccessedAt = new Date();

  try {
    await updateDoc(progressRef, {
      lastAccessedAt,
      ...(params?.lessonId ? { lastLessonId: params.lessonId } : {}),
    });
  } catch (error) {
    await setDoc(
      progressRef,
      {
        userId: currentUserId,
        courseId,
        completedLessons: [],
        ...(params?.lessonId ? { lastLessonId: params.lessonId } : {}),
        exerciseResults: [],
        certificateEligible: false,
        certificateIssued: false,
        startedAt: lastAccessedAt,
        lastAccessedAt,
      },
      { merge: true }
    );
  }
}

/**
 * Marca uma aula como concluída e atualiza o progresso do usuário no curso.
 * Usa setDoc com merge para criar ou atualizar o documento atomicamente,
 * eliminando a necessidade de leitura prévia (read-then-write).
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

  // setDoc com merge cria o documento se não existir ou atualiza se já existir.
  // arrayUnion garante que o lessonId não seja duplicado — operação atômica e idempotente.
  await setDoc(
    progressRef,
    {
      userId: currentUserId,
      courseId,
      completedLessons: arrayUnion(lessonId),
      lastLessonId: lessonId,
      lastAccessedAt: new Date(),
    },
    { merge: true }
  );
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
      ...(passed ? { completedAt: new Date() } : existingResult.completedAt ? { completedAt: existingResult.completedAt } : {}),
    };
  } else {
    // Criar novo resultado
    const newResult: any = {
      exerciseId,
      attempts: [newAttempt],
      bestScore: score,
      passed,
    };

    // ✅ Apenas adiciona completedAt se passou (Firestore não aceita undefined)
    if (passed) {
      newResult.completedAt = new Date();
    }

    updatedResults = [...exerciseResults, newResult];
  }

  console.log("🔄 [saveExerciseResult] Atualizando progresso com novos resultados...");

  await updateDoc(progressRef, {
    exerciseResults: updatedResults,
    lastAccessedAt: new Date(),
  });

  console.log("✅ [saveExerciseResult] Resultado salvo com sucesso");
  console.log("🎉 [saveExerciseResult] FIM - Sucesso!");
}
