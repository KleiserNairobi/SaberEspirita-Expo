import React, { useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { FixStackParamList } from "@/routers/types";
import { QuizUI } from "@/components/QuizUI";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { StatsService } from "@/services/firebase/statsService";
import { getQuizById } from "@/services/firebase/quizService";
import { saveExerciseResult } from "@/services/firebase/progressService";
import { COURSE_PROGRESS_KEYS } from "@/hooks/queries/useCourseProgress";
import { IQuizAnswer } from "@/types/quiz";

type CourseQuizRouteProp = RouteProp<FixStackParamList, "CourseQuiz">;
type CourseQuizNavigationProp = NativeStackNavigationProp<FixStackParamList, "CourseQuiz">;

export function CourseQuizScreen() {
  const route = useRoute<CourseQuizRouteProp>();
  const navigation = useNavigation<CourseQuizNavigationProp>();
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();

  const {
    categoryId,
    categoryName,
    subcategoryName,
    subtitle,
    courseId,
    lessonId,
    quizId,
    exerciseId,
  } = route.params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(null);
  const guestSheetRef = useRef<BottomSheetModal>(null);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizById(quizId!, "lesson_quizzes"),
    enabled: !!quizId,
  });

  async function handleFinish(answers: IQuizAnswer[]) {
    if (!quiz || isSubmitting) return;

    if (useAuthStore.getState().isGuest) {
      StatsService.incrementQuizCount("lesson", true);
      setMessageConfig({
        type: "info",
        title: "Modo Visitante",
        message: "Seu progresso não será salvo pois você está navegando como visitante. Crie uma conta para registrar suas conquistas!",
        primaryButton: {
          label: "Criar Conta",
          onPress: () => {
            guestSheetRef.current?.dismiss();
            // @ts-ignore
            navigation.navigate("Tabs", { screen: "AccountTab" });
          },
        },
        secondaryButton: {
          label: "Sair sem salvar",
          onPress: () => {
            guestSheetRef.current?.dismiss();
            navigation.goBack();
          },
        },
      });
      setTimeout(() => guestSheetRef.current?.present(), 100);
      return;
    }

    try {
      setIsSubmitting(true);
      const correctAnswers = answers.filter((a) => a.selectedAnswerIndex === a.correctAnswerIndex).length;
      const totalQuestions = quiz.questions.length;
      const percentage = Math.floor((correctAnswers / totalQuestions) * 100);

      let level: "Ótimo" | "Bom" | "Regular" | "Fraco" = "Fraco";
      if (percentage >= 90) level = "Ótimo";
      else if (percentage >= 70) level = "Bom";
      else if (percentage >= 50) level = "Regular";

      const { user } = useAuthStore.getState();

      if (user?.uid) {
        if (courseId && lessonId) {
          if (exerciseId) {
            // Salva apenas o resultado do exercício; a conclusão da AULA é responsabilidade do LessonPlayer
            await saveExerciseResult(courseId, lessonId, exerciseId, percentage, percentage >= 70, user.uid);
          } else {
            console.warn("[CourseQuizScreen] exerciseId não fornecido. O progresso não será salvo detalhadamente.");
          }

          queryClient.invalidateQueries({
            queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, courseId),
          });
        } else {
          console.warn("[CourseQuizScreen] missing courseId or lessonId.");
        }
      }

      navigation.navigate("QuizResult", {
        categoryId,
        categoryName: categoryName || "Exercício de Fixação",
        subcategoryName: subcategoryName || "Conclusão da Aula",
        subtitle,
        correctAnswers,
        totalQuestions,
        percentage,
        level,
        userAnswers: answers,
        courseId,
        lessonId,
        exerciseId,
      });
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      navigation.navigate("QuizResult", {
        categoryId,
        categoryName: categoryName || "Erro",
        subcategoryName: subcategoryName || "Erro",
        correctAnswers: 0,
        totalQuestions: quiz.questions.length,
        percentage: 0,
        level: "Fraco",
        userAnswers: answers,
        courseId,
        lessonId,
        exerciseId,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStop() {
    navigation.goBack();
  }

  if (!isLoading && !quiz) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.error || "#FF6B6B", marginBottom: 16 }]}>
            Exercício não encontrado.
          </Text>
          <Text style={[styles.loadingText, { fontSize: 14, marginBottom: 24, color: theme.colors.textSecondary }]}>
            Não foi possível carregar as questões deste exercício.
          </Text>
          <TouchableOpacity onPress={handleStop}>
            <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>← Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !quiz) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary, marginTop: 16 }]}>
            Carregando exercício...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <QuizUI
        title={categoryName || "Exercício de Fixação"}
        barTitle={subcategoryName || "Conclusão da Aula"}
        subtitle={subtitle}
        questions={quiz.questions}
        showStopButton={false}
        isSubmitting={isSubmitting}
        onFinish={handleFinish}
        onStop={handleStop}
      />
      <BottomSheetMessage ref={guestSheetRef} config={messageConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, fontWeight: "500" },
});
