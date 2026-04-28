import React, { useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { FixStackParamList } from "@/routers/types";
import { QuizUI } from "@/components/QuizUI";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAuthStore } from "@/stores/authStore";
import { StatsService } from "@/services/firebase/statsService";
import { addUserHistory, updateUserScore } from "@/services/firebase/quizService";
import { useDailyChallenge } from "@/hooks/queries/useDailyChallenge";
import { IQuizAnswer, IQuizHistory } from "@/types/quiz";

type DailyQuizNavigationProp = NativeStackNavigationProp<FixStackParamList, "DailyQuiz">;

export function DailyQuizScreen() {
  const navigation = useNavigation<DailyQuizNavigationProp>();
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(null);
  const guestSheetRef = useRef<BottomSheetModal>(null);

  const { data: quiz, isLoading } = useDailyChallenge(true);

  async function handleFinish(answers: IQuizAnswer[]) {
    if (!quiz || isSubmitting) return;

    if (useAuthStore.getState().isGuest) {
      StatsService.incrementQuizCount("general", true);
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
        const today = new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).split(" ")[0];
        const dailySubcategoryId = `DAILY_${today}`;

        const userHistory: IQuizHistory = {
          userId: user.uid,
          categoryId: "DAILY",
          subcategoryId: dailySubcategoryId,
          quizId: quiz.id,
          title: "Desafio Diário",
          subtitle: new Date().toLocaleDateString(),
          completed: true,
          score: percentage,
          totalQuestions,
          correctAnswers,
          percentage,
          level,
          completedAt: new Date(),
        };

        await addUserHistory(userHistory, user.displayName || "Usuário");
        await updateUserScore(user.uid, user.displayName || "Usuário");

        queryClient.invalidateQueries({ queryKey: ["dailyQuizStatus", user.uid] });
        queryClient.invalidateQueries({ queryKey: ["userStreak", user.uid] });
        queryClient.invalidateQueries({ queryKey: ["dailyChallengeStats", user.uid] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
        queryClient.invalidateQueries({ queryKey: ["userScore", user.uid] });
      }

      // ✅ Usa replace para remover DailyQuiz da pilha — impede voltar ao quiz após conclusão
      navigation.replace("QuizResult", {
        categoryId: "DAILY",
        categoryName: "Desafio Diário",
        subcategoryName: new Date().toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
        }),
        subtitle: new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        correctAnswers,
        totalQuestions,
        percentage,
        level,
        userAnswers: answers,
      });
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      // ✅ Usa replace também no catch para manter consistência
      navigation.replace("QuizResult", {
        categoryId: "DAILY",
        categoryName: "Desafio Diário",
        subcategoryName: "Erro ao salvar",
        correctAnswers: 0,
        totalQuestions: quiz.questions.length,
        percentage: 0,
        level: "Fraco",
        userAnswers: answers,
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
            Quiz não encontrado.
          </Text>
          <Text style={[styles.loadingText, { fontSize: 14, marginBottom: 24, color: theme.colors.textSecondary }]}>
            Não foi possível carregar as questões deste quiz.
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
            Carregando desafio diário...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <QuizUI
        title="Desafio Diário"
        barTitle="Perguntas Aleatórias"
        questions={quiz.questions}
        showStopButton={true}
        isSubmitting={isSubmitting}
        dynamicTitles={true}
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
