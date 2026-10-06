import { loadString, remove, saveString } from "./Storage";

export interface ILessonSlideProgress {
  slideIndex: number;
  totalSlides: number;
  updatedAt: number;
}

export interface ILastCourseAccess {
  courseId: string;
  lessonId?: string;
  lessonTitle?: string;
  lessonOrder?: number;
  slideIndex?: number;
  totalSlides?: number;
  updatedAt: number;
}

const PREFIX_SLIDE = "@lesson_slide_progress_";
const PREFIX_LAST_COURSE = "@last_course_access_";
const PREFIX_COURSE_ACTIVE_LESSON = "@course_active_lesson_";

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
  const key = `${PREFIX_SLIDE}${userKey}_${lessonId}`;

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
  const key = `${PREFIX_SLIDE}${userKey}_${lessonId}`;

  const raw = loadString(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.slideIndex === "number" && typeof parsed.totalSlides === "number") {
      return parsed as ILessonSlideProgress;
    }
  } catch (error) {
    console.warn(
      `[lessonProgressStorage] Erro ao parsear progresso da aula ${lessonId}:`,
      error
    );
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
  const key = `${PREFIX_SLIDE}${userKey}_${lessonId}`;
  remove(key);
}

/**
 * Salva o registro do último curso e aula acessados pelo usuário.
 */
export function saveLastCourseAccess(
  userId: string | undefined,
  access: ILastCourseAccess
): void {
  if (!access.courseId) return;
  const userKey = userId || "guest";

  const keyLast = `${PREFIX_LAST_COURSE}${userKey}`;
  saveString(keyLast, JSON.stringify(access));

  // Salva também atrelado ao curso para resgate posterior
  const keyCourse = `${PREFIX_COURSE_ACTIVE_LESSON}${userKey}_${access.courseId}`;
  saveString(keyCourse, JSON.stringify(access));
}

/**
 * Obtém o último curso acessado pelo usuário.
 */
export function getLastCourseAccess(
  userId: string | undefined
): ILastCourseAccess | null {
  const userKey = userId || "guest";
  const key = `${PREFIX_LAST_COURSE}${userKey}`;
  const raw = loadString(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ILastCourseAccess;
  } catch {
    return null;
  }
}

/**
 * Obtém a aula e slide ativos em andamento para um curso específico.
 */
export function getCourseActiveLesson(
  userId: string | undefined,
  courseId: string
): ILastCourseAccess | null {
  if (!courseId) return null;
  const userKey = userId || "guest";
  const key = `${PREFIX_COURSE_ACTIVE_LESSON}${userKey}_${courseId}`;
  const raw = loadString(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ILastCourseAccess;
  } catch {
    return null;
  }
}
