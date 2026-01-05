import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  BarChart2,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { AppStackParamList } from "@/routers/types";
import { useCourse } from "@/hooks/queries/useCourses";
import { ICourse } from "@/types/course";
import { createStyles } from "./styles";

// Placeholder image (garantido existir conforme verificado antes)
const COURSE_PLACEHOLDER = require("@/assets/images/course-placeholder.jpg");

// Imagem do instrutor (Allan Kardec placeholder)
const INSTRUCTOR_AVATAR_URI =
  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Allan_Kardec_L%27Illustration_1869.jpg";

type CourseDetailsRouteProp = RouteProp<AppStackParamList, "CourseDetails">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function CourseDetailsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId } = route.params;

  // React Query Fetch
  const { data: course, isLoading: loading } = useCourse(courseId);

  // Todo: Buscar progresso real do usuário
  const userProgress = 0; // 0% a 100%
  const isEnrolled = false;

  // Prefetch da imagem para cache agressivo
  React.useEffect(() => {
    if (course?.imageUrl && typeof course.imageUrl === "string") {
      Image.prefetch(course.imageUrl);
    }
  }, [course]);

  function handleGoBack() {
    navigation.goBack();
  }

  function handleAction() {
    // Se matriculado -> Continuar
    // Se não -> Ver Aulas (ou Matricular)
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

  // Tratamento da imagem do curso com Cache Control
  const imageSource = course.imageUrl
    ? { uri: course.imageUrl, cache: "force-cache" as "force-cache" }
    : COURSE_PLACEHOLDER;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={styles.heroContainer}>
          <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />

          <LinearGradient
            colors={["transparent", "rgba(25, 26, 31, 0.8)", "#191a1f"]}
            style={styles.heroOverlay}
          >
            <Text style={styles.courseTitle}>{course.title}</Text>
            <View style={styles.authorContainer}>
              <User size={16} color={theme.colors.primary} />
              <Text style={styles.authorText}>Por {course.author || "Allan Kardec"}</Text>
            </View>
          </LinearGradient>

          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* PROGRESS SECTION */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso do curso</Text>
            <Text style={styles.progressValue}>{userProgress}% concluído</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${userProgress}%` }]} />
          </View>
        </View>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          {/* Aulas */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <BookOpen size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{course.lessonCount || 0}</Text>
              <Text style={styles.statLabel}>Aulas</Text>
            </View>
          </View>

          {/* Duração */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Clock size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{course.workloadMinutes || 0}</Text>
              <Text style={styles.statLabel}>Minutos</Text>
            </View>
          </View>

          {/* Nível */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <BarChart2 size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                {course.difficultyLevel || "Iniciante"}
              </Text>
              <Text style={styles.statLabel}>Nível</Text>
            </View>
          </View>

          {/* Ano (Mockado por enquanto) */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Calendar size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>2024</Text>
              <Text style={styles.statLabel}>Atualizado</Text>
            </View>
          </View>
        </View>

        {/* DESCRIPTION SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sobre o Curso</Text>
          <Text style={styles.descriptionText}>
            {course.description || "Sem descrição disponível."}
          </Text>

          {/* INSTRUCTOR MINI CARD */}
          <View style={styles.instructorCard}>
            <Image
              source={{ uri: INSTRUCTOR_AVATAR_URI }}
              style={styles.instructorAvatar}
            />
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>{course.author || "Allan Kardec"}</Text>
              <Text style={styles.instructorRole}>Codificador do Espiritismo</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </View>
        </View>
      </ScrollView>

      {/* FIXED FOOTER */}
      <View style={styles.footer}>
        {isEnrolled ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleAction}>
            <Text style={styles.primaryButtonText}>CONTINUAR CURSO</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ gap: 12 }}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAction}>
              <Text style={styles.primaryButtonText}>INICIAR CURSO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleAction}>
              <Text style={styles.secondaryButtonText}>VER AULAS</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// Pequeno mock de ActivityIndicator para TS não reclamar se não importei
import { ActivityIndicator } from "react-native";
