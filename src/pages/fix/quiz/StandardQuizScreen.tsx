import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { QuizUI } from "@/components/QuizUI";
import { QUIZ_KEYS, useQuiz } from "@/hooks/queries/useQuiz";
import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { quizApiService } from "@/services/api/quizApiService";
import { statsApiService } from "@/services/api/statsApiService";
import { useAuthStore } from "@/stores/authStore";
import { IQuizAnswer } from "@/types/quiz";

type StandardQuizRouteProp = RouteProp<FixStackParamList, "StandardQuiz">;
type StandardQuizNavigationProp = NativeStackNavigationProp<
  FixStackParamList,
  "StandardQuiz"
>;

export function StandardQuizScreen() {
  const route = useRoute<StandardQuizRouteProp>();
  const navigation = useNavigation<StandardQuizNavigationProp>();
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();

  const { subcategoryId, categoryId, categoryName, subcategoryName, subtitle } =
    route.params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );
  const guestSheetRef = useRef<BottomSheetModal>(null);

  const { data: quiz, isLoading } = useQuiz(subcategoryId || "", true);

  async function handleFinish(answers: IQuizAnswer[]) {
    if (!quiz || isSubmitting) return;

    if (useAuthStore.getState().isGuest) {
      statsApiService.logEvent({
        eventName: "quiz_attempt",
        category: "quiz",
        label: subcategoryName || quiz.id,
      });
      setMessageConfig({
        type: "info",
        title: "Modo Visitante",
        message:
          "Seu progresso não será salvo pois você está navegando como visitante. Crie uma conta para registrar suas conquistas!",
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
      const correctAnswers = answers.filter(
        (a) => a.selectedAnswerIndex === a.correctAnswerIndex
      ).length;
      const totalQuestions = quiz.questions.length;
      const percentage = Math.floor((correctAnswers / totalQuestions) * 100);

      let level: "Ótimo" | "Bom" | "Regular" | "Fraco" = "Fraco";
      if (percentage >= 90) level = "Ótimo";
      else if (percentage >= 70) level = "Bom";
      else if (percentage >= 50) level = "Regular";

      const { user } = useAuthStore.getState();

      if (user?.uid && categoryId && subcategoryId) {
        await quizApiService.submitQuiz(quiz.id, {
          categoryId,
          subcategoryId,
          answers: answers.map((a, index) => ({
            questionIndex: index,
            selectedIndex: a.selectedAnswerIndex,
          })),
        });

        queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.userProgress(user.uid) });
        queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.detailedStats(user.uid) });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        queryClient.invalidateQueries({ queryKey: ["userScore", user.uid] });
      }

      navigation.navigate("QuizResult", {
        categoryId,
        categoryName: categoryName || "Quiz",
        subcategoryName: subcategoryName || "Geral",
        subtitle,
        correctAnswers,
        totalQuestions,
        percentage,
        level,
        userAnswers: answers,
        quizId: quiz.id, // ← NOVO
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
        quizId: quiz.id, // ← NOVO
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text
            style={[
              styles.loadingText,
              { color: theme.colors.error || "#FF6B6B", marginBottom: 16 },
            ]}
          >
            Quiz não encontrado.
          </Text>
          <Text
            style={[
              styles.loadingText,
              { fontSize: 14, marginBottom: 24, color: theme.colors.textSecondary },
            ]}
          >
            Não foi possível carregar as questões deste quiz.
          </Text>
          <TouchableOpacity onPress={handleStop}>
            <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
              ← Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !quiz) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: theme.colors.textSecondary, marginTop: 16 },
            ]}
          >
            Carregando quiz...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <QuizUI
        title={categoryName || "Quiz"}
        barTitle={subcategoryName || "Perguntas Aleatórias"}
        subtitle={subtitle}
        questions={quiz.questions}
        showStopButton={true}
        isSubmitting={isSubmitting}
        quizId={quiz.id}
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
