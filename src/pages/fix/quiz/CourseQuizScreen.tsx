import React, { useRef, useState } from "react";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { BookOpen, Leaf, ArrowLeft } from "lucide-react-native";

import { FixStackParamList } from "@/routers/types";
import { QuizUI } from "@/components/QuizUI";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { getQuizById, logQuizAttempt } from "@/services/firebase/quizService";
import { saveExerciseResult } from "@/services/firebase/progressService";
import { COURSE_PROGRESS_KEYS } from "@/hooks/queries/useCourseProgress";
import { IQuizAnswer } from "@/types/quiz";
import { Button } from "@/components/Button";
import { ITheme } from "@/configs/theme/types";

type CourseQuizRouteProp = RouteProp<FixStackParamList, "CourseQuiz">;
type CourseQuizNavigationProp = NativeStackNavigationProp<FixStackParamList, "CourseQuiz">;

export function CourseQuizScreen() {
  const route = useRoute<CourseQuizRouteProp>();
  const navigation = useNavigation<CourseQuizNavigationProp>();
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const {
    categoryId,
    categoryName,
    subcategoryName,
    subtitle,
    courseId,
    lessonId,
    lessonTitle,
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
      const correctAnswers = answers.filter(
        (a) => a.selectedAnswerIndex === a.correctAnswerIndex
      ).length;
      const totalQuestions = quiz.questions.length;
      const percentage = Math.floor((correctAnswers / totalQuestions) * 100);

      await logQuizAttempt({
        userId: "guest",
        quizType: "lesson",
        quizId: quiz.id,
        quizTitle: subcategoryName || quiz.id,
        courseId,
        lessonId,
        lessonTitle,
        score: percentage,
        passed: percentage >= 70,
      });

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
        await logQuizAttempt({
          userId: user.uid,
          quizType: "lesson",
          quizId: quiz.id,
          quizTitle: subcategoryName || quiz.id,
          courseId,
          lessonId,
          lessonTitle,
          score: percentage,
          passed: percentage >= 70,
        });

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
          queryClient.invalidateQueries({
            queryKey: ["allCoursesProgress", user.uid],
          });
          queryClient.invalidateQueries({
            queryKey: ["lastAccessedCourse", user.uid],
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
        quizId,
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
        quizId,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStop() {
    navigation.goBack();
  }

  if (!isLoading && !quiz) {
    const errorColor = theme.colors.error || "#C94B4B";
    const bgIconColor = errorColor + "15";

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.errorContainer}>
          <View style={styles.card}>
            <Leaf
              size={140}
              color={theme.colors.primary}
              style={styles.bgLeaf}
            />

            <View style={[styles.iconWrapper, { backgroundColor: bgIconColor }]}>
              <BookOpen size={36} color={errorColor} />
            </View>

            <Text style={styles.title}>
              Exercício não encontrado
            </Text>

            <Text style={styles.description}>
              Não foi possível carregar as questões deste exercício. Por favor, retorne à tela anterior e tente novamente.
            </Text>

            <Button
              title="Voltar"
              onPress={handleStop}
              variant="primary"
              fullWidth
              icon={<ArrowLeft size={18} color="white" style={{ marginRight: 8 }} />}
            />
          </View>
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
        quizId={quizId}
        onFinish={handleFinish}
        onStop={handleStop}
      />
      <BottomSheetMessage ref={guestSheetRef} config={messageConfig} />
    </>
  );
}

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      ...theme.text("md", "medium", theme.colors.textSecondary),
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    card: {
      width: "100%",
      maxWidth: 340,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      alignItems: "center",
      ...theme.shadows.md,
      position: "relative",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconWrapper: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.text("xl", "bold", theme.colors.text),
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    description: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
      textAlign: "center",
      marginBottom: theme.spacing.xl,
      lineHeight: 20,
    },
    bgLeaf: {
      position: "absolute",
      bottom: -30,
      right: -30,
      opacity: theme.isDark ? 0.03 : 0.06,
      transform: [{ rotate: "45deg" }],
    },
  });
