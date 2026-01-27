import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  Lock,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  Tag,
  Clock,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { useLessons } from "@/hooks/queries/useLessons";
import { useCourse } from "@/hooks/queries/useCourses";
import { useCourseProgress } from "@/hooks/queries/useCourseProgress";
import { useExercises, useCourseExercises } from "@/hooks/queries/useExercises";
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

  // ✅ Fetch de todos os exercícios do curso para renderização e cálculo
  const { data: allExercises = [] } = useCourseExercises(courseId);

  // Calcular progresso de aulas
  const totalLessons = lessons.length;
  const completedLessons = progress?.completedLessons.length || 0;
  const lessonsProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // ✅ NOVO: Calcular progresso de exercícios
  // Usar total do curso se disponível, senão total de exercícios carregados
  const totalExercises =
    course?.stats?.exerciseCount && course.stats.exerciseCount > 0
      ? course.stats.exerciseCount
      : allExercises.length;

  const completedExercises =
    progress?.exerciseResults?.filter((r) => r.passed).length || 0;

  // ✅ CORREÇÃO: Calcular porcentagem dinamicamente para evitar dados estaleiros
  const exercisesProgress =
    totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  // ✅ NOVO: Verificar elegibilidade para certificado (Backend ou Local)
  const certificateEnabled = course?.certification?.enabled ?? false;
  const serverCertificateEligible = progress?.certificateEligible || false;

  // Apenas elegível se certificado estiver habilitado E (backend autorizou OU cumpriu requisitos locais)
  const isReadyForCertificate =
    certificateEnabled &&
    (serverCertificateEligible || (lessonsProgress === 100 && exercisesProgress === 100));

  // ✅ NOVO: Estado e ref para BottomSheet de certificado
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );
  const bottomSheetRef = useRef<BottomSheetModal>(null);

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
  // ✅ NOVO: Handler para botão de certificado
  function handleGetCertificate() {
    if (!isReadyForCertificate) {
      // Mostrar popup de aviso via BottomSheet
      const missingCount = totalExercises - completedExercises;

      setMessageConfig({
        type: "warning",
        title: "Certificado Bloqueado",
        message: `Você ainda precisa completar ${missingCount} exercícios para obter o certificado. Verifique as aulas e complete os exercícios pendentes.`,
        primaryButton: {
          label: "ENTENDI",
          onPress: () => {
            bottomSheetRef.current?.dismiss();
          },
        },
      });
      bottomSheetRef.current?.present();
      return;
    }

    // Navegar para tela de certificado
    if (course) {
      navigation.navigate("CourseCertificate", { courseId: course.id });
    }
  }

  async function handleLessonPress(lesson: ILesson, status: LessonStatus) {
    if (status === LessonStatus.LOCKED) {
      setMessageConfig({
        type: "info",
        title: "Aula Bloqueada",
        message: "Complete as aulas anteriores para desbloquear esta aula.",
        primaryButton: {
          label: "ENTENDI",
          onPress: () => {
            bottomSheetRef.current?.dismiss();
          },
        },
      });
      bottomSheetRef.current?.present();
      return;
    }

    // Comportamento normal: abre a aula
    navigation.navigate("LessonPlayer", { courseId, lessonId: lesson.id });
  }

  // ✅ Helper para renderizar item de exercício
  const renderExerciseItem = (exercise: any, lessonId: string, index: number) => {
    // 1. Verificar se completado
    const completedIds =
      progress?.exerciseResults?.filter((r) => r.passed).map((r) => r.exerciseId) || [];
    const isCompleted = completedIds.includes(exercise.id);

    // 2. Verificar se a AULA PAI foi completada
    const isLessonCompleted = progress?.completedLessons.includes(lessonId);

    // 3. Regra de Negócio: Exercício só libera se a aula foi feita
    const isLocked = !isLessonCompleted;

    return (
      <TouchableOpacity
        key={exercise.id}
        style={[styles.exerciseCard, isLocked && { opacity: 0.6 }]}
        disabled={isLocked}
        onPress={() => {
          navigation.navigate("CourseQuiz", {
            courseId,
            lessonId: lessonId,
            quizId: exercise.quizId,
            exerciseId: exercise.id,
            mode: "course",
            categoryName: "Exercício de Fixação",
            subcategoryName: exercise.title || `Exercício ${index + 1}`,
          });
        }}
      >
        <View style={styles.exerciseLeftContent}>
          {/* Linha conectora visual (opcional, pode ser feito com borda esquerda no container) */}
          <View style={styles.connectorLine} />

          <View
            style={[
              styles.exerciseIconContainer,
              isCompleted && styles.exerciseIconCompleted,
              isLocked && { borderColor: theme.colors.border },
            ]}
          >
            {/* Ícone de Haltere/Cérebro */}
            {isCompleted ? (
              <CheckCircle
                size={20}
                color={theme.colors.success}
                fill={theme.colors.success}
                fillOpacity={0.1}
              />
            ) : isLocked ? (
              <Lock size={14} color={theme.colors.textSecondary} />
            ) : (
              <View style={styles.exerciseDot} />
            )}
          </View>

          <View style={styles.exerciseTextContainer}>
            <Text
              style={[
                styles.exerciseTitle,
                isCompleted && styles.exerciseTitleCompleted,
                isLocked && { color: theme.colors.textSecondary, opacity: 0.5 },
              ]}
            >
              {exercise.title || `Exercício ${index + 1}`}
            </Text>
          </View>
        </View>

        {!isLocked && <ChevronRight size={20} color={theme.colors.textSecondary} />}
        {isLocked && <View style={{ width: 20 }} />}
      </TouchableOpacity>
    );
  };

  const renderLessonItem = ({ item, index }: { item: ILesson; index: number }) => {
    const status = getLessonStatus(item, index);

    // Obter exercícios desta aula
    const lessonExercises = allExercises
      .filter((e) => e.lessonId === item.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Define estilos baseados no status
    const containerStyle = [
      styles.lessonCard,
      status === LessonStatus.COMPLETED && styles.cardCompleted,
      status === LessonStatus.IN_PROGRESS && styles.cardInProgress,
      status === LessonStatus.LOCKED && styles.cardLocked,
      status === LessonStatus.AVAILABLE && styles.cardAvailable,
    ];

    return (
      <View style={styles.lessonWrapper}>
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
                {/* Source com ícone */}
                {item.source && (
                  <View style={styles.metaRow}>
                    <BookOpen size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.lessonMeta} numberOfLines={1}>
                      {item.source}
                    </Text>
                  </View>
                )}
                {/* Chapter com ícone */}
                {item.chapter && (
                  <View style={styles.metaRow}>
                    <Tag size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.lessonMeta} numberOfLines={1}>
                      {item.chapter}
                    </Text>
                  </View>
                )}
                {/* Duração e Status */}
                <View style={styles.metaRow}>
                  <Clock size={12} color={theme.colors.textSecondary} />
                  <Text style={styles.lessonMeta}>
                    {item.durationMinutes} min
                    {status === LessonStatus.COMPLETED && " • Concluída"}
                    {status === LessonStatus.IN_PROGRESS && " • Em andamento"}
                    {status === LessonStatus.LOCKED && " • Bloqueada"}
                    {status === LessonStatus.AVAILABLE && " • Disponível"}
                  </Text>
                </View>
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

        {/* LISTA DE EXERCÍCIOS (Renderizada abaixo do card da aula) */}
        {lessonExercises.length > 0 && (
          <View style={styles.exercisesListContainer}>
            {lessonExercises.map((ex, idx) => renderExerciseItem(ex, item.id, idx))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* HEADER DE NAVEGAÇÃO */}
        <View style={styles.navHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeft size={20} color={theme.colors.primary} />
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
                certificateEligible={isReadyForCertificate}
                hasCertificate={certificateEnabled}
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

        {/* ✅ NOVO: Botão de Certificado (aparece quando 100% aulas E certificado habilitado) */}
        {lessonsProgress === 100 && certificateEnabled && (
          <View style={styles.certificateButtonContainer}>
            <Button
              title={isReadyForCertificate ? "OBTER CERTIFICADO" : "COMPLETAR EXERCÍCIOS"}
              onPress={handleGetCertificate}
              variant={isReadyForCertificate ? "primary" : "outline"}
              fullWidth
            />
          </View>
        )}
      </View>

      {/* ✅ NOVO: BottomSheet para mensagens */}
      <BottomSheetMessage ref={bottomSheetRef} config={messageConfig} />
    </SafeAreaView>
  );
}
