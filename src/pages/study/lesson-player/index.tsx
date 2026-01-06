import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, MoreVertical } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { AppStackParamList } from "@/routers/types";
import { useLesson } from "@/hooks/queries/useLessons";

import {
  useCourseProgress,
  COURSE_PROGRESS_KEYS,
} from "@/hooks/queries/useCourseProgress";
import { markLessonAsCompleted } from "@/services/firebase/progressService";

import { SlideContent } from "./components/SlideContent";
import { HighlightCard } from "./components/HighlightCard";
import { ReferenceCard } from "./components/ReferenceCard";
import { SlideIndicator } from "./components/SlideIndicator";
import { NavigationButtons } from "./components/NavigationButtons";
import { createStyles } from "./styles";

type LessonPlayerRouteProp = RouteProp<AppStackParamList, "LessonPlayer">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function LessonPlayerScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuthStore();
  const styles = createStyles(theme);
  const route = useRoute<LessonPlayerRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  const { courseId, lessonId } = route.params;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fetch da aula
  const { data: lesson, isLoading } = useLesson(courseId, lessonId);

  // Fetch do progresso (para atualizar depois)
  const { data: progress } = useCourseProgress(courseId);

  const currentSlide = lesson?.slides[currentSlideIndex];
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === (lesson?.slides.length || 0) - 1;

  function handlePrevious() {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }

  function handleNext() {
    if (currentSlideIndex < (lesson?.slides.length || 0) - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }

  async function handleFinish() {
    if (!lesson) return;

    try {
      await markLessonAsCompleted(lesson.courseId, lesson.id, user?.uid);

      // Invalidar cache de progresso para atualizar a tela anterior
      if (user?.uid) {
        queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, lesson.courseId),
        });
      }

      Alert.alert("Aula Concluída!", "Parabéns! Você concluiu esta aula com sucesso.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao marcar aula como concluída:", error);
      Alert.alert(
        "Erro",
        "Não foi possível marcar a aula como concluída. Tente novamente."
      );
    }
  }

  function handleGoBack() {
    navigation.goBack();
  }

  function handleMenu() {
    // TODO: Implementar menu de opções (Fase 2)
    Alert.alert("Menu", "Funcionalidade em desenvolvimento");
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson || !currentSlide) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Aula não encontrada</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleGoBack}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleMenu}>
          <MoreVertical size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <SlideContent
          title={currentSlide.title}
          content={currentSlide.content}
          imagePrompt={currentSlide.imagePrompt}
        />

        {currentSlide.highlights && currentSlide.highlights.length > 0 && (
          <HighlightCard highlights={currentSlide.highlights} />
        )}

        {currentSlide.references && (
          <ReferenceCard references={currentSlide.references} />
        )}

        <SlideIndicator
          currentIndex={currentSlideIndex}
          totalSlides={lesson.slides.length}
        />
      </ScrollView>

      {/* Navigation */}
      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFirstSlide={isFirstSlide}
        isLastSlide={isLastSlide}
        onFinish={handleFinish}
      />
    </SafeAreaView>
  );
}
