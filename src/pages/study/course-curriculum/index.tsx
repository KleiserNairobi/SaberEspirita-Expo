import React, { useState } from "react";
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
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { useLessons } from "@/hooks/queries/useLessons";
import { useCourse } from "@/hooks/queries/useCourses"; // ✅ Corrigido
import { useCourseProgress } from "@/hooks/queries/useCourseProgress";
import { ILesson } from "@/types/course";
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

  // Calcular progresso
  const totalLessons = lessons.length;
  const completedLessons = progress?.completedLessons.length || 0;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  function getLessonStatus(lesson: ILesson, index: number): LessonStatus {
    // Se não tiver progresso, todas as aulas estão disponíveis (sem bloqueio)
    if (!progress) {
      return index === 0 ? LessonStatus.AVAILABLE : LessonStatus.AVAILABLE;
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

  function handleLessonPress(lesson: ILesson, status: LessonStatus) {
    if (status === LessonStatus.LOCKED) {
      Alert.alert(
        "Aula Bloqueada",
        "Complete as aulas anteriores para desbloquear esta aula."
      );
      return;
    }
    navigation.navigate("LessonPlayer", { courseId, lessonId: lesson.id });
  }

  const renderLessonItem = ({ item, index }: { item: ILesson; index: number }) => {
    const status = getLessonStatus(item, index);
    const hasQuiz = index === 3; // Mock para mostrar badge de Quiz

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
                {status === LessonStatus.IN_PROGRESS && " • 8 min restantes"}
                {status === LessonStatus.LOCKED && " • Bloqueada"}
              </Text>
            </View>
          </View>

          {/* DIREITA (CHEVRON OU BADGE) */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {hasQuiz && (
              <View style={styles.quizBadge}>
                <Text style={styles.quizText}>Quiz</Text>
              </View>
            )}
            <ChevronRight size={24} color={theme.colors.textSecondary} />
          </View>
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
            // HEADER DE RESUMO DE PROGRESSO
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{course?.title || "Curso"}</Text>
              <View style={styles.summaryProgressRow}>
                <Text style={styles.summaryLabel}>Progresso do curso</Text>
                <Text style={styles.summaryPercent}>{progressPercent}%</Text>
              </View>
              <View style={styles.summaryBarBg}>
                <View style={[styles.summaryBarFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.summaryFooter}>
                {completedLessons} de {totalLessons} aulas concluídas
              </Text>
            </View>
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
    </SafeAreaView>
  );
}
