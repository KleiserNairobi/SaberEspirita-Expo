import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { exerciseApiService } from "@/services/api/exerciseApiService";
import { ISubmitExercisePayload } from "@/types/course";

export const EXERCISES_KEYS = {
  byLesson: (lessonId: string) => ["exercises", "lesson", lessonId] as const,
  byCourse: (courseId: string) => ["exercises", "course", courseId] as const,
  details: (exerciseId: string) => ["exercises", "details", exerciseId] as const,
  attempts: (exerciseId: string) => ["exercises", "attempts", exerciseId] as const,
};

/**
 * Hook para buscar exercícios de uma aula.
 */
export function useExercises(lessonId: string) {
  return useQuery({
    queryKey: EXERCISES_KEYS.byLesson(lessonId),
    queryFn: () => exerciseApiService.getExercisesByLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

/**
 * Hook para buscar todos os exercícios de um curso.
 */
export function useCourseExercises(courseId: string) {
  return useQuery({
    queryKey: EXERCISES_KEYS.byCourse(courseId),
    queryFn: () => exerciseApiService.getExercisesByCourse(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}

/**
 * Hook para obter detalhes de um exercício específico.
 */
export function useExerciseDetails(exerciseId: string) {
  return useQuery({
    queryKey: EXERCISES_KEYS.details(exerciseId),
    queryFn: () => exerciseApiService.getExerciseDetails(exerciseId),
    enabled: !!exerciseId,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}

/**
 * Hook para consultar o histórico de tentativas de um exercício.
 */
export function useExerciseAttempts(exerciseId: string) {
  return useQuery({
    queryKey: EXERCISES_KEYS.attempts(exerciseId),
    queryFn: () => exerciseApiService.getExerciseAttempts(exerciseId),
    enabled: !!exerciseId,
  });
}

/**
 * Hook de mutação para submeter as respostas de um exercício.
 */
export function useSubmitExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      exerciseId,
      payload,
    }: {
      exerciseId: string;
      payload: ISubmitExercisePayload;
    }) => exerciseApiService.submitExercise(exerciseId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: EXERCISES_KEYS.attempts(variables.exerciseId),
      });
      queryClient.invalidateQueries({
        queryKey: ["user-activity"],
      });
    },
  });
}
