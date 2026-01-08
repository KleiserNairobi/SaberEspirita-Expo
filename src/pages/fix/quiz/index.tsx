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
import { QuizProgressBar } from "@/components/QuizProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";
import { useAuthStore } from "@/stores/authStore";
import {
  addUserHistory,
  saveUserCompletedSubcategories,
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

  const { subcategoryId, categoryId, categoryName, subcategoryName, subtitle } =
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
  const correctAsset = Asset.fromModule(require("@/assets/sounds/correct.mp3"));
  const wrongAsset = Asset.fromModule(require("@/assets/sounds/wrong.mp3"));

  // Inicializa players (expo-audio)
  const correctPlayer = useAudioPlayer(correctAsset.uri || "");
  const wrongPlayer = useAudioPlayer(wrongAsset.uri || "");

  // Garante que assets estejam carregados
  useEffect(() => {
    async function loadAssets() {
      await correctAsset.downloadAsync();
      await wrongAsset.downloadAsync();
      // Atualiza players se necessário, mas o hook deve reagir a URI
    }
    loadAssets();
  }, []);

  // States not strictly in CLI but needed for QuestionCard compatibility/UX
  // CLI doesn't seem to have forced feedback step, but we keep state structure
  // clean to match CLI logic flow.

  const { data: quiz, isLoading } = useQuiz(subcategoryId);

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
        const userHistory: IQuizHistory = {
          userId: user.uid,
          categoryId: categoryId,
          subcategoryId: subcategoryId,
          quizId: quiz.id,
          title: categoryName,
          subtitle: subtitle || subcategoryName,
          completed: true,
          score: percentage,
          totalQuestions,
          correctAnswers,
          percentage,
          level,
          completedAt: new Date(),
        };

        // Salvar progresso em paralelo
        await Promise.all([
          saveUserCompletedSubcategories(user.uid, categoryId, subcategoryId),
          addUserHistory(userHistory, user.displayName || "Usuário"),
        ]);
      }

      navigation.navigate("QuizResult", {
        categoryId,
        categoryName,
        subcategoryName,
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
        categoryName,
        subcategoryName,
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
        <Text style={styles.headerTitle}>{categoryName}</Text>
      </View>

      {/* Progress Bar */}
      <QuizProgressBar
        current={currentQuestionIndex + 1}
        total={quiz.questions.length}
        title={subcategoryName}
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
