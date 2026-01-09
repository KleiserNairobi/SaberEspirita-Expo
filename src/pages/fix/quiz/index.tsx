import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";

import { Asset } from "expo-asset";
import { useAudioPlayer } from "expo-audio";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useQuiz } from "@/hooks/queries/useQuiz";
import { useQueryClient } from "@tanstack/react-query";
import { useDailyChallenge } from "@/hooks/queries/useDailyChallenge";
import { QuizProgressBar } from "@/components/QuizProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";
import { useAuthStore } from "@/stores/authStore";
import {
  addUserHistory,
  saveUserCompletedSubcategories,
  updateUserScore,
} from "@/services/firebase/quizService";
import { IQuizHistory } from "@/types/quiz";
import { FixStackParamList } from "@/routers/types";
import { IQuizAnswer } from "@/types/quiz";

type QuizRouteProp = RouteProp<FixStackParamList, "Quiz">;
type QuizNavigationProp = NativeStackNavigationProp<FixStackParamList, "Quiz">;

export function QuizScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<QuizRouteProp>();
  const navigation = useNavigation<QuizNavigationProp>();
  const queryClient = useQueryClient();

  const { subcategoryId, categoryId, categoryName, subcategoryName, subtitle, mode } =
    route.params;

  /* State Replication from CLI */
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const [stop, setStop] = useState(false);
  const [next, setNext] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<IQuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const { soundEffects } = usePreferencesStore();

  // Audio Assets
  const [audioReady, setAudioReady] = useState(false);

  // Audio Assets - Memoized to prevent recreation
  const correctAsset = useMemo(
    () => Asset.fromModule(require("@/assets/sounds/correct.mp3")),
    []
  );
  const wrongAsset = useMemo(
    () => Asset.fromModule(require("@/assets/sounds/wrong.mp3")),
    []
  );

  // Carregar assets antes de inicializar players
  useEffect(() => {
    async function loadAssets() {
      try {
        await Promise.all([correctAsset.downloadAsync(), wrongAsset.downloadAsync()]);
        setAudioReady(true);
      } catch (error) {
        console.error("Erro ao carregar sons:", error);
      }
    }
    loadAssets();
  }, [correctAsset, wrongAsset]);

  // Inicializa players apenas com URIs válidas (localUri preferido após download)
  const correctPlayer = useAudioPlayer(
    audioReady ? correctAsset.localUri || correctAsset.uri : ""
  );
  const wrongPlayer = useAudioPlayer(
    audioReady ? wrongAsset.localUri || wrongAsset.uri : ""
  );

  // Conditional Data Fetching
  const isDaily = mode === "daily";

  const standardQuiz = useQuiz(subcategoryId);
  const dailyQuiz = useDailyChallenge();

  const { data: quizData, isLoading } = isDaily ? dailyQuiz : standardQuiz;

  // Use quizData instead of quiz
  const quiz = quizData;

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions.length || 0) - 1;

  // --- CLI Logic Replication ---

  function playSound(isCorrect: boolean) {
    if (!soundEffects) return;
    try {
      if (isCorrect) {
        correctPlayer.seekTo(0); // Reinicia o som
        correctPlayer.play();
      } else {
        wrongPlayer.seekTo(0);
        wrongPlayer.play();
      }
    } catch (error) {
      console.error("Erro ao tocar som:", error);
    }
  }

  function handleSelectAnswer(index: number) {
    if (selectedAnswer !== null || !quiz) return; // Prevent changing answer
    setSelectedAnswer(index);

    const isCorrect = index === quiz.questions[currentQuestionIndex].correct;
    playSound(isCorrect);
  }

  function handleConfirm() {
    if (!quiz) return;

    if (selectedAnswer === null) {
      return handleSkipConfirm();
    }

    const currentQ = quiz.questions[currentQuestionIndex];

    // 1. Create Answer Object
    const answer: IQuizAnswer = {
      question: currentQ.title,
      alternatives: currentQ.alternatives,
      correctAnswerIndex: currentQ.correct,
      selectedAnswerIndex: selectedAnswer,
      explanation: currentQ.explanation,
    };

    // 2. Update State
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);

    // 3. Next or Finish
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinish(newAnswers);
    }
  }

  function handleSkipConfirm() {
    setNext(true);
    bottomSheetRef.current?.expand();
  }

  function handleNextQuestion() {
    // 1. Create Answer (Skipped = null selected)
    const currentQ = quiz!.questions[currentQuestionIndex];
    const answer: IQuizAnswer = {
      question: currentQ.title,
      alternatives: currentQ.alternatives,
      correctAnswerIndex: currentQ.correct,
      selectedAnswerIndex: -1, // Indicates skipped/no selection
      explanation: currentQ.explanation,
    };

    // 2. Update State & Reset UI
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    setStop(false);
    setNext(false);
    bottomSheetRef.current?.close();

    // 3. Next or Finish
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinish(newAnswers);
    }
  }

  async function handleFinish(finalAnswers: IQuizAnswer[] = userAnswers) {
    if (!quiz) return;

    try {
      const correctAnswers = finalAnswers.filter(
        (a) => a.selectedAnswerIndex === a.correctAnswerIndex
      ).length;
      const totalQuestions = quiz.questions.length;
      const percentage = Math.floor((correctAnswers / totalQuestions) * 100);

      let level: "Ótimo" | "Bom" | "Regular" | "Fraco" = "Fraco";
      if (percentage >= 90) level = "Ótimo";
      else if (percentage >= 70) level = "Bom";
      else if (percentage >= 50) level = "Regular";

      const { user } = useAuthStore.getState();

      if (user?.uid) {
        // Para Daily Challenge, usamos um ID único por dia para permitir histórico e streak
        const today = new Date().toISOString().split("T")[0];
        const dailySubcategoryId = `DAILY_${today}`;

        const historySubcategoryId = isDaily ? dailySubcategoryId : subcategoryId;

        const userHistory: IQuizHistory = {
          userId: user.uid,
          categoryId: categoryId || "DAILY", // Fallback for Daily
          subcategoryId: historySubcategoryId || "DAILY_CHALLENGE",
          quizId: quiz.id,
          title: categoryName || "Desafio Diário",
          subtitle: subtitle || subcategoryName || new Date().toLocaleDateString(),
          completed: true,
          score: percentage,
          totalQuestions,
          correctAnswers,
          percentage,
          level,
          completedAt: new Date(),
        };

        const promises: Promise<any>[] = [
          addUserHistory(userHistory, user.displayName || "Usuário"),
        ];

        // Only save subcategory progress if it's NOT a daily challenge
        if (!isDaily) {
          promises.push(
            saveUserCompletedSubcategories(user.uid, categoryId, subcategoryId)
          );
        }

        // Wait for history to be added before updating score to ensure it counts
        await Promise.all(promises);

        // Update aggregated score for leaderboard
        await updateUserScore(user.uid, user.displayName || "Usuário");

        // Invalidate queries to update UI immediately
        if (isDaily) {
          queryClient.invalidateQueries({ queryKey: ["dailyQuizStatus", user.uid] });
          queryClient.invalidateQueries({ queryKey: ["userStreak", user.uid] });
        } else {
          queryClient.invalidateQueries({ queryKey: ["userQuizProgress", user.uid] });
        }
        // Invalidate leaderboard cache
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      }

      navigation.navigate("QuizResult", {
        categoryId,
        categoryName: categoryName || "Desafio Diário",
        subcategoryName: subcategoryName || "Geral",
        subtitle,
        correctAnswers,
        totalQuestions,
        percentage,
        level,
        userAnswers: finalAnswers,
      });
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      // Navega mesmo com erro para não travar o usuário
      navigation.navigate("QuizResult", {
        categoryId,
        categoryName: categoryName || "Desafio",
        subcategoryName: subcategoryName || "Erro",
        correctAnswers: 0, // Fallback visual
        totalQuestions: quiz.questions.length,
        percentage: 0,
        level: "Fraco",
        userAnswers: finalAnswers,
      });
    }
  }

  const handleStop = useCallback(() => {
    setStop(true);
    setNext(false);
    bottomSheetRef.current?.expand();
  }, []);

  function handleBottomSheetPressStop() {
    bottomSheetRef.current?.close();
    navigation.goBack();
  }

  function handleBottomSheetClose() {
    setStop(false);
    setNext(false);
    bottomSheetRef.current?.close();
  }

  function goToBack() {
    if (currentQuestionIndex !== 0) {
      handleStop();
    } else {
      navigation.goBack();
    }
  }

  if (isLoading || !quiz || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={ArrowLeft}
          onPress={goToBack}
          size={24}
          color={theme.colors.text}
        />
        <Text style={styles.headerTitle}>{categoryName || "Desafio Diário"}</Text>
      </View>

      {/* Progress Bar */}
      <QuizProgressBar
        current={currentQuestionIndex + 1}
        total={quiz.questions.length}
        title={subcategoryName || "Perguntas Aleatórias"}
        subtitle={subtitle}
      />

      {/* Conteúdo */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pergunta */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.title}</Text>
        </View>

        {/* Alternativas */}
        <QuestionCard
          question={currentQuestion}
          selectedIndex={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          showFeedback={selectedAnswer !== null}
        />
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.footer}>
        <View style={styles.sheetButton}>
          <Button
            title="Parar"
            variant="outline"
            onPress={handleStop}
            fullWidth
            disabled={currentQuestionIndex === 0}
          />
        </View>
        <View style={styles.sheetButton}>
          <Button
            title={isLastQuestion ? "Finalizar" : "Próxima"}
            onPress={handleConfirm}
            fullWidth
          />
        </View>
      </View>

      {/* Bottom Sheet for Stop/Skip Confirmation */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleBottomSheetClose}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
          />
        )}
        backgroundStyle={{ backgroundColor: theme.colors.card }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {stop && (
            <>
              <Text style={styles.sheetTitle}>Deseja parar o quiz?</Text>
              <Text style={styles.sheetSubtitle}>
                Seu progresso não será contabilizado e você poderá recomeçar quando
                quiser.
              </Text>
              <View style={styles.sheetButtons}>
                <View style={styles.sheetButton}>
                  <Button
                    title="Cancelar"
                    variant="outline"
                    onPress={handleBottomSheetClose}
                    fullWidth
                  />
                </View>
                <View style={styles.sheetButton}>
                  <Button title="Parar" onPress={handleBottomSheetPressStop} fullWidth />
                </View>
              </View>
            </>
          )}

          {next && (
            <>
              <Text style={styles.sheetTitle}>Deseja realmente pular?</Text>
              <Text style={styles.sheetSubtitle}>
                Questões não respondidas serão contabilizadas como erros.
              </Text>
              <View style={styles.sheetButtons}>
                <View style={styles.sheetButton}>
                  <Button
                    title="Cancelar"
                    variant="outline"
                    onPress={handleBottomSheetClose}
                    fullWidth
                  />
                </View>
                <View style={styles.sheetButton}>
                  <Button title="Pular" onPress={handleNextQuestion} fullWidth />
                </View>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
