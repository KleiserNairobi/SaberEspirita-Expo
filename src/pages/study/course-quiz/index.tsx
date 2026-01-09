import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, X } from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";

import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { AppStackParamList } from "@/routers/types";
import { getQuizById } from "@/services/firebase/quizService";
import { markLessonAsCompleted } from "@/services/firebase/progressService"; // Reusing this for now
import { COURSE_PROGRESS_KEYS } from "@/hooks/queries/useCourseProgress";

import { QuestionCard } from "@/components/QuestionCard";
import { QuizProgressBar } from "@/components/QuizProgressBar";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";
import { IQuiz, IQuestion } from "@/types/quiz";

type CourseQuizRouteProp = RouteProp<AppStackParamList, "CourseQuiz">;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function CourseQuizScreen() {
  const { theme } = useAppTheme();
  const { user } = useAuthStore();
  const styles = createStyles(theme);
  const route = useRoute<CourseQuizRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  const { courseId, lessonId, quizId } = route.params;

  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  async function loadQuiz() {
    try {
      setLoading(true);
      const data = await getQuizById(quizId);
      setQuiz(data);
    } catch (error) {
      console.error("Erro ao carregar quiz:", error);
      Alert.alert("Erro", "Não foi possível carregar o exercício.");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerSelect(index: number) {
    if (!isAnswerConfirmed) {
      setSelectedAnswer(index);
    }
  }

  function handleConfirmAnswer() {
    if (selectedAnswer === null || !quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct; // Comparing indices

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setIsAnswerConfirmed(true);
  }

  function handleNextQuestion() {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerConfirmed(false);
    } else {
      finishQuiz();
    }
  }

  async function finishQuiz() {
    setIsFinished(true);

    // Here we could implement specific logic for course quiz results (e.g. minimum grade)
    // For now, completion of the quiz marks the lesson as completed.

    try {
      if (user?.uid) {
        await markLessonAsCompleted(courseId, lessonId, user.uid);
        // Invalidate progress to update UI
        queryClient.invalidateQueries({
          queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, courseId),
        });
      }

      Alert.alert(
        "Aula Concluída!",
        `Você acertou ${score} de ${quiz?.questions.length} questões.`,
        [
          {
            text: "Continuar",
            onPress: () => navigation.navigate("CourseCurriculum", { courseId }),
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao finalizar aula:", error);
    }
  }

  function handleGoBack() {
    Alert.alert("Sair do Exercício", "Se sair agora, seu progresso será perdido.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => navigation.goBack() },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Exercício indisponível.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercício de Fixação</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Progress Bar */}
      <View style={{ paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.md }}>
        <QuizProgressBar
          current={currentQuestionIndex + 1}
          total={quiz.questions.length}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
        <QuestionCard
          question={currentQuestion}
          selectedIndex={selectedAnswer}
          onSelectAnswer={handleAnswerSelect}
          showFeedback={isAnswerConfirmed}
        />
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {!isAnswerConfirmed ? (
          <Button
            title="Confirmar Resposta"
            onPress={handleConfirmAnswer}
            disabled={!selectedAnswer}
          />
        ) : (
          <Button
            title={
              currentQuestionIndex === quiz.questions.length - 1
                ? "Finalizar"
                : "Próxima Questão"
            }
            onPress={handleNextQuestion}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
