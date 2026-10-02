import { ICourse, ILesson } from "@/types/course";

/**
 * Verifica se uma determinada aula é uma aula de degustação (amostra grátis) em um curso premium.
 */
export function isLessonFreeTrial(lesson: ILesson, course?: ICourse | null): boolean {
  if (lesson.isPremium === false && course?.isPremium) {
    return true;
  }
  if (course?.isPremium && (lesson.order === 1 || (lesson as any).orderIndex === 1)) {
    return true;
  }
  return false;
}

/**
 * Valida se o usuário tem permissão para reproduzir determinada aula (Smart Gate).
 *
 * Regras:
 * 1. Se o usuário for assinante ativo (userIsSubscriber = true), tem acesso irrestrito.
 * 2. Se a aula tiver isPremium: false (ex: Aula 1 de degustação), é liberada para qualquer usuário.
 * 3. Se for a primeira aula (ordem 1) de um curso premium, é tratada como degustação gratuita.
 * 4. Se a aula for isPremium: true (ou herdar isPremium do curso), bloqueia para não-assinantes.
 * 5. Cursos e aulas da Codificação (não-premium) são 100% gratuitos e abertos.
 */
export function canAccessLesson(
  lesson: ILesson,
  course?: ICourse | null,
  userIsSubscriber: boolean = false
): boolean {
  // 1. Assinante ativo tem acesso total
  if (userIsSubscriber) {
    return true;
  }

  // 2. Aula explicitamente não-premium (ex: degustação)
  if (lesson.isPremium === false) {
    return true;
  }

  // 3. Primeira aula de curso premium funciona como degustação
  if (isLessonFreeTrial(lesson, course)) {
    return true;
  }

  // 4. Se for aula premium explícita ou pertencer a um curso premium
  const isLocked = lesson.isPremium ?? course?.isPremium ?? false;
  return !isLocked;
}
