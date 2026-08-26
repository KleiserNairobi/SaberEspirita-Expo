import { loadString, saveString, remove } from "./Storage";

export interface ILessonSlideProgress {
  slideIndex: number;
  totalSlides: number;
  updatedAt: number;
}

const PREFIX = "@lesson_slide_progress_";

/**
 * Salva o progresso do slide atual para uma aula e usuário específicos.
 */
export function saveLessonSlideProgress(
  userId: string | undefined,
  lessonId: string,
  slideIndex: number,
  totalSlides: number
): void {
  if (!lessonId) return;
  const userKey = userId || "guest";
  const key = `${PREFIX}${userKey}_${lessonId}`;

  const payload: ILessonSlideProgress = {
    slideIndex,
    totalSlides,
    updatedAt: Date.now(),
  };

  saveString(key, JSON.stringify(payload));
}

/**
 * Obtém o progresso de slide salvo de uma aula para um usuário específico.
 */
export function getLessonSlideProgress(
  userId: string | undefined,
  lessonId: string
): ILessonSlideProgress | null {
  if (!lessonId) return null;
  const userKey = userId || "guest";
  const key = `${PREFIX}${userKey}_${lessonId}`;

  const raw = loadString(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.slideIndex === "number" && typeof parsed.totalSlides === "number") {
      return parsed as ILessonSlideProgress;
    }
  } catch (error) {
    console.warn(`[lessonProgressStorage] Erro ao parsear progresso da aula ${lessonId}:`, error);
  }

  return null;
}

/**
 * Limpa o progresso de slide de uma aula quando ela é concluída.
 */
export function clearLessonSlideProgress(
  userId: string | undefined,
  lessonId: string
): void {
  if (!lessonId) return;
  const userKey = userId || "guest";
  const key = `${PREFIX}${userKey}_${lessonId}`;
  remove(key);
}
