import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  Lock,
  ChevronRight,
  AlertTriangle, // ← NOVO: Ícone para badge de exercício pendente
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { useLessons } from "@/hooks/queries/useLessons";
import { useCourse } from "@/hooks/queries/useCourses";
import { useCourseProgress } from "@/hooks/queries/useCourseProgress";
import { useExercises } from "@/hooks/queries/useExercises";
import { ILesson } from "@/types/course";
import { ProgressSummaryCard } from "./components/ProgressSummaryCard";
import { BottomSheetMessage } from "@/components/BottomSheetMessage"; // ✅ NOVO
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types"; // ✅ NOVO
import { BottomSheetModal } from "@gorhom/bottom-sheet"; // ✅ NOVO
import { Button } from "@/components/Button"; // ✅ NOVO
import { createStyles } from "./styles";

type CourseCurriculumRouteProp = RouteProp<AppStackParamList, "CourseCurriculum">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

// Enum para facilitar a lógica de renderização
enum LessonStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  LOCKED = "LOCKED",
  AVAILABLE = "AVAILABLE",
}

export function CourseCurriculumScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<CourseCurriculumRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId } = route.params;

  // Fetch das aulas reais
  const { data: lessons = [], isLoading: loading } = useLessons(courseId);

  // ✅ Fetch do curso para exibir título
  const { data: course } = useCourse(courseId);

  // ✅ Fetch do progresso real do usuário
  const { data: progress } = useCourseProgress(courseId);

  // ✅ NOVO: Extrair exercícios pendentes
  const pendingExercises = progress?.pendingExercises || [];

  // Calcular progresso de aulas
  const totalLessons = lessons.length;
  const completedLessons = progress?.completedLessons.length || 0;
  const lessonsProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // ✅ NOVO: Calcular progresso de exercícios
  // Usar total do curso se disponível, senão fallback para resultados
  const totalExercises =
    course?.stats?.exerciseCount || progress?.exerciseResults?.length || 0;
  const completedExercises =
    progress?.exerciseResults?.filter((r) => r.passed).length || 0;
  const exercisesProgress = progress?.exercisesCompletionPercent || 0;

  // ✅ NOVO: Verificar elegibilidade para certificado
  const certificateEligible = progress?.certificateEligible || false;

  // ✅ NOVO: Estado e ref para BottomSheet de certificado
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // ✅ NOVO: Função para calcular progresso de exercícios por aula
  function getLessonExerciseProgress(lessonId: string) {
    // Buscar exercícios completados desta aula
    const completedIds =
      progress?.exerciseResults?.filter((r) => r.passed).map((r) => r.exerciseId) || [];

    // Verificar se a aula está na lista de pendentes
    const hasPendingExercises = pendingExercises.includes(lessonId);

    // Se não tem pendentes, significa que todos foram completados ou não há exercícios
    if (!hasPendingExercises) {
      return { total: 0, completed: 0, pending: 0, hasPending: false };
    }

    // Se tem pendentes, precisamos buscar quantos exercícios a aula tem
    // Por enquanto, vamos assumir que se está pendente, há pelo menos 1 exercício
    // A contagem exata será feita quando clicar na aula
    return { total: 0, completed: 0, pending: 1, hasPending: true };
  }

  function getLessonStatus(lesson: ILesson, index: number): LessonStatus {
    // Se não tiver progresso OU se completedLessons estiver vazio
    if (!progress || progress.completedLessons.length === 0) {
      // Primeira aula sempre disponível
      if (index === 0) {
        return LessonStatus.AVAILABLE;
      }
      // Demais aulas bloqueadas (desbloqueio sequencial)
      return LessonStatus.LOCKED;
    }

    // Verificar se a aula foi concluída
    if (progress.completedLessons.includes(lesson.id)) {
      return LessonStatus.COMPLETED;
    }

    // Verificar se é a próxima aula (em andamento)
    if (progress.lastLessonId === lesson.id) {
      return LessonStatus.IN_PROGRESS;
    }

    // Lógica de desbloqueio sequencial: só pode acessar se a anterior foi concluída
    if (index === 0) {
      return LessonStatus.AVAILABLE; // Primeira aula sempre disponível
    }

    const previousLesson = lessons[index - 1];
    if (previousLesson && progress.completedLessons.includes(previousLesson.id)) {
      return LessonStatus.AVAILABLE; // Aula anterior concluída, esta está disponível
    }

    return LessonStatus.LOCKED; // Bloqueada
  }

  function handleGoBack() {
    navigation.goBack();
  }

  // ✅ NOVO: Handler para botão de certificado
  function handleGetCertificate() {
    if (!certificateEligible) {
      // Mostrar BottomSheet de bloqueio
      const pendingCount = pendingExercises.length;
      const pendingList = pendingExercises
        .map((lessonId, index) => {
          const lesson = lessons.find((l) => l.id === lessonId);
          return `${index + 1}. ${lesson?.title || "Aula desconhecida"}`;
        })
        .join("\n");

      setMessageConfig({
        type: "warning",
        title: "Certificado Bloqueado",
        message: `Você ainda tem ${pendingCount} exercício(s) pendente(s):\n\n${pendingList}\n\nComplete todos os exercícios para obter seu certificado!`,
        primaryButton: {
          label: "VER EXERCÍCIOS PENDENTES",
          onPress: handleViewPendingExercises,
        },
        secondaryButton: {
          label: "Cancelar",
          onPress: () => bottomSheetRef.current?.dismiss(),
        },
      });

      bottomSheetRef.current?.present();
      return;
    }

    // TODO: Navegar para tela de certificado
    Alert.alert(
      "Parabéns!",
      "Você completou todas as aulas e exercícios! Em breve você poderá gerar seu certificado."
    );
  }

  // ✅ NOVO: Scroll para primeira aula com exercício pendente
  function handleViewPendingExercises() {
    bottomSheetRef.current?.dismiss();
    // TODO: Implementar scroll para primeira aula com badge
    // Por enquanto, apenas fecha o BottomSheet
  }

  async function handleLessonPress(lesson: ILesson, status: LessonStatus) {
    if (status === LessonStatus.LOCKED) {
      Alert.alert(
        "Aula Bloqueada",
        "Complete as aulas anteriores para desbloquear esta aula."
      );
      return;
    }

    // ✅ Se a aula tem exercício pendente, navega direto para o quiz
    const isPendingExercise = pendingExercises.includes(lesson.id);
    if (isPendingExercise) {
      try {
        // Buscar exercício vinculado à aula
        const { getExercisesByLessonId } =
          await import("@/services/firebase/exerciseService");
        const exercises = await getExercisesByLessonId(lesson.id);

        if (exercises.length > 0) {
          // Encontrar o primeiro exercício pendente
          // Precisamos verificar quais já foram completados
          const completedIds =
            progress?.exerciseResults?.filter((r) => r.passed).map((r) => r.exerciseId) ||
            [];

          const nextExercise =
            exercises.find((ex) => !completedIds.includes(ex.id)) || exercises[0];

          if (nextExercise.quizId) {
            console.log(
              "🎯 Navegando direto para exercício pendente:",
              nextExercise.quizId
            );
            navigation.navigate("CourseQuiz", {
              courseId,
              lessonId: lesson.id,
              quizId: nextExercise.quizId,
              exerciseId: nextExercise.id, // ✅ NOVO
            });
            return;
          }
        }
      } catch (error) {
        console.error("❌ Erro ao buscar exercício:", error);
      }
    }

    // Comportamento normal: abre a aula
    navigation.navigate("LessonPlayer", { courseId, lessonId: lesson.id });
  }

  const renderLessonItem = ({ item, index }: { item: ILesson; index: number }) => {
    const status = getLessonStatus(item, index);
    const isPendingExercise = pendingExercises.includes(item.id); // ← NOVO

    // Define estilos baseados no status
    const containerStyle = [
      styles.lessonCard,
      status === LessonStatus.COMPLETED && styles.cardCompleted,
      status === LessonStatus.IN_PROGRESS && styles.cardInProgress,
      status === LessonStatus.LOCKED && styles.cardLocked,
      status === LessonStatus.AVAILABLE && styles.cardAvailable,
    ];

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={() => handleLessonPress(item, status)}
        disabled={status === LessonStatus.LOCKED}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardLeftContent}>
            {/* ÍCONE / NÚMERO */}
            <View style={styles.iconContainer}>
              {status === LessonStatus.COMPLETED && (
                <CheckCircle
                  size={32}
                  color={theme.colors.success}
                  fill={theme.colors.success}
                  fillOpacity={0.1}
                />
              )}
              {status === LessonStatus.IN_PROGRESS && (
                <PlayCircle
                  size={32}
                  color={theme.colors.primary}
                  fill={theme.colors.primary}
                  fillOpacity={0.1}
                />
              )}
              {status === LessonStatus.LOCKED && (
                <View style={styles.lockedIconDetails}>
                  <Lock size={20} color={theme.colors.textSecondary} />
                </View>
              )}
              {status === LessonStatus.AVAILABLE && (
                <PlayCircle
                  size={32}
                  color={theme.colors.textSecondary}
                  fill="transparent"
                />
              )}
            </View>

            {/* TEXTOS */}
            <View style={styles.textContainer}>
              <Text style={styles.lessonTitle} numberOfLines={1}>
                {index + 1}. {item.title}
              </Text>
              <Text style={styles.lessonMeta}>
                {item.durationMinutes} min
                {status === LessonStatus.COMPLETED && " • Concluída"}
                {status === LessonStatus.IN_PROGRESS && " • Em andamento"}
                {status === LessonStatus.LOCKED && " • Bloqueada"}
                {status === LessonStatus.AVAILABLE && " • Disponível"}
              </Text>

              {/* ✅ NOVO: Badge de exercício pendente */}
              {isPendingExercise && (
                <View style={styles.pendingBadge}>
                  <AlertTriangle size={14} color={theme.colors.warning} />
                  <Text style={styles.pendingBadgeText}>Exercício pendente</Text>
                </View>
              )}
            </View>
          </View>

          {/* DIREITA (CHEVRON) */}
          <ChevronRight size={24} color={theme.colors.textSecondary} />
        </View>

        {/* BARRA DE PROGRESSO INTERNA (Só para Em Andamento) */}
        {status === LessonStatus.IN_PROGRESS && (
          <View style={styles.internalProgressBarBg}>
            <View style={[styles.internalProgressBarFill, { width: "55%" }]} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER DE NAVEGAÇÃO */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Aulas do Curso</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <ProgressSummaryCard
              courseTitle={course?.title || "Curso"}
              lessonsProgress={lessonsProgress}
              exercisesProgress={exercisesProgress}
              totalLessons={totalLessons}
              completedLessons={completedLessons}
              totalExercises={totalExercises}
              completedExercises={completedExercises}
              certificateEligible={certificateEligible}
            />
          }
          renderItem={renderLessonItem}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.textSecondary,
                marginTop: 40,
              }}
            >
              Nenhuma aula encontrada.
            </Text>
          }
        />
      )}

      {/* ✅ NOVO: Botão de Certificado (aparece quando 100% aulas) */}
      {lessonsProgress === 100 && (
        <View style={styles.certificateButtonContainer}>
          <Button
            title={certificateEligible ? "OBTER CERTIFICADO" : "COMPLETAR EXERCÍCIOS"}
            onPress={handleGetCertificate}
            variant={certificateEligible ? "primary" : "outline"}
            fullWidth
          />
        </View>
      )}

      {/* ✅ NOVO: BottomSheet para mensagens */}
      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
    </SafeAreaView>
  );
}
