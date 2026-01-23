import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  BarChart2,
  FileText,
  Award,
  AlertCircle,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { useCourse } from "@/hooks/queries/useCourses";
import { useCourseProgress } from "@/hooks/queries/useCourseProgress";
import { createStyles } from "./styles";

type CourseDetailsRouteProp = RouteProp<AppStackParamList, "CourseDetails">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function CourseDetailsScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId } = route.params;

  // React Query Fetch
  const { data: course, isLoading: loading } = useCourse(courseId);
  const { data: progress } = useCourseProgress(courseId);

  // Calcular progresso real
  const completedCount = progress?.completedLessons?.length || 0;
  const totalLessons = course?.lessonCount || 0;

  const userProgress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isEnrolled = !!progress; // Se tem objeto de progresso, está matriculado

  // Dados de certificação
  const hasCertification = course?.certification?.enabled || false;
  const exerciseCount = course?.stats?.exerciseCount || 0;

  function handleGoBack() {
    navigation.goBack();
  }

  function handleStartCourse() {
    navigation.navigate("CourseCurriculum", { courseId });
  }

  function handleViewLessons() {
    navigation.navigate("CourseCurriculum", { courseId });
  }

  if (loading) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!course) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <Text style={{ color: theme.colors.text }}>Curso não encontrado.</Text>
        <TouchableOpacity onPress={handleGoBack} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.colors.primary }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {course.title}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* PROGRESS CARD */}
          {isEnrolled && (
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>PROGRESSO DO CURSO</Text>
                <Text style={styles.progressValue}>{userProgress}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${userProgress}%` }]} />
              </View>
              <Text style={styles.progressFooter}>
                {completedCount} de {totalLessons} aulas concluídas
              </Text>
            </View>
          )}

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o Curso</Text>
            <Text style={styles.descriptionText}>
              {course.description || "Sem descrição disponível."}
            </Text>
          </View>

          {/* STATS LIST (2 COLUNAS) */}
          <View style={styles.statsList}>
            {/* Aulas */}
            <View style={styles.statItem}>
              <View style={styles.iconCircle}>
                <BookOpen size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.statText}>{course.lessonCount || 0} Aulas</Text>
            </View>

            {/* Duração */}
            <View style={styles.statItem}>
              <View style={styles.iconCircle}>
                <Clock size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.statText}>
                {course.workloadMinutes || 0} min de leitura
              </Text>
            </View>

            {/* Nível */}
            <View style={styles.statItem}>
              <View style={styles.iconCircle}>
                <BarChart2 size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.statText}>{course.difficultyLevel || "Iniciante"}</Text>
            </View>

            {/* Exercícios */}
            <View style={styles.statItem}>
              <View style={styles.iconCircle}>
                <FileText size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.statText}>{exerciseCount} Exercícios</Text>
            </View>
          </View>

          {/* REQUISITOS PARA CERTIFICADO */}
          {hasCertification && (
            <View style={styles.requirementsCard}>
              <View style={styles.requirementsHeader}>
                <Award size={20} color={theme.colors.warning} />
                <Text style={styles.requirementsTitle}>Emite Certificado</Text>
              </View>
              <View style={styles.requirementsList}>
                <View style={styles.requirementItem}>
                  <Text style={styles.requirementBullet}>•</Text>
                  <Text style={styles.requirementText}>
                    {course.certification.requiredLessonsPercent}% das aulas concluídas
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Text style={styles.requirementBullet}>•</Text>
                  <Text style={styles.requirementText}>
                    {course.certification.requiredExercisesPercent}% dos exercícios com
                    nota ≥ {course.certification.minimumGrade}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* FIXED FOOTER */}
        <View style={styles.footer}>
          {isEnrolled ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleStartCourse}>
              <Text style={styles.primaryButtonText}>
                {userProgress === 100 ? "VER CURRÍCULO" : "CONTINUAR CURSO"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={[styles.primaryButton, styles.flexButton]}
                onPress={handleStartCourse}
              >
                <Text style={styles.primaryButtonText}>INICIAR CURSO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, styles.flexButton]}
                onPress={handleViewLessons}
              >
                <Text style={styles.secondaryButtonText}>VER AULAS</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
