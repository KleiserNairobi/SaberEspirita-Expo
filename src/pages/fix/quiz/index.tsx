import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { Asset } from "expo-asset";
import { useAudioPlayer } from "expo-audio";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import { usePreferencesStore } from "@/stores/preferencesStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useQuiz } from "@/hooks/queries/useQuiz";
import { useDailyChallenge } from "@/hooks/queries/useDailyChallenge";
import { QuizProgressBar } from "@/components/QuizProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";
import { useAuthStore } from "@/stores/authStore";
import {
  getQuizById,
  addUserHistory,
  saveUserCompletedSubcategories,
  updateUserScore,
} from "@/services/firebase/quizService";
import {
  markLessonAsCompleted,
  saveExerciseResult,
} from "@/services/firebase/progressService";
import { COURSE_PROGRESS_KEYS } from "@/hooks/queries/useCourseProgress";
import { IQuizHistory, IQuizAnswer } from "@/types/quiz";
import { BottomSheetMessage } from "@/components/BottomSheetMessage";
import { BottomSheetMessageConfig } from "@/components/BottomSheetMessage/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FixStackParamList, AppStackParamList } from "@/routers/types";

// Combine params type to support both stacks if needed, or just use FixStackParamList which we extended
type QuizRouteProp = RouteProp<FixStackParamList, "Quiz">;
type QuizNavigationProp = NativeStackNavigationProp<FixStackParamList, "Quiz">;

export function QuizScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<QuizRouteProp>();
  const navigation = useNavigation<QuizNavigationProp>();
  const queryClient = useQueryClient();

  const {
    subcategoryId,
    categoryId,
    categoryName,
    subcategoryName,
    subtitle,
    mode,
    courseId,
    lessonId,
    quizId,
    exerciseId, // ✅ NOVO
  } = route.params;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const guestSheetRef = useRef<BottomSheetModal>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const [messageConfig, setMessageConfig] = useState<BottomSheetMessageConfig | null>(
    null
  );

  const [stop, setStop] = useState(false);
  const [next, setNext] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<IQuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const isDaily = mode === "daily";
  const isCourse = mode === "course";

  const standardQuiz = useQuiz(subcategoryId || "");
  const dailyQuiz = useDailyChallenge();

  const courseQuiz = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizById(quizId!, "lesson_quizzes"), // ✅ Busca na coleção correta
    enabled: isCourse && !!quizId,
  });

  const isLoading = isDaily
    ? dailyQuiz.isLoading
    : isCourse
      ? courseQuiz.isLoading
      : standardQuiz.isLoading;

  const quizData = isDaily
    ? dailyQuiz.data
    : isCourse
      ? courseQuiz.data
      : standardQuiz.data;

  const quiz = quizData;

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions.length || 0) - 1;

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
      // Scroll para o topo ao avançar para próxima pergunta
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
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
      // Scroll para o topo ao avançar para próxima pergunta
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleFinish(newAnswers);
    }
  }

  async function handleFinish(finalAnswers: IQuizAnswer[] = userAnswers) {
    if (!quiz || isSubmitting) return;

    // Verificar se é convidado
    if (useAuthStore.getState().isGuest) {
      setMessageConfig({
        type: "info",
        title: "Modo Visitante",
        message:
          "Seu progresso não será salvo pois você está navegando como visitante. Crie uma conta para registrar suas conquistas!",
        primaryButton: {
          label: "Criar Conta",
          onPress: () => {
            guestSheetRef.current?.dismiss();
            // Navegar para a aba de conta
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
      // Pequeno timeout para garantir que a config foi setada
      setTimeout(() => guestSheetRef.current?.present(), 100);
      return;
    }

    try {
      setIsSubmitting(true);
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
        // --- Lógica para CURSO ---
        if (isCourse && courseId && lessonId) {
          // 1. Marcar aula como concluída (mantido)
          await markLessonAsCompleted(courseId, lessonId, user.uid);

          // 2. ✅ Salvar resultado do exercício (NOVO)
          // Se exerciseId foi passado, usamos ele. Se não, tentamos usar quizId como fallback (embora idealmente devêssemos ter exerciseId)
          if (exerciseId) {
            await saveExerciseResult(
              courseId,
              lessonId,
              exerciseId,
              percentage, // score
              percentage >= 70, // passed (assumindo 70% como nota de corte por enquanto)
              user.uid
            );
          } else {
            console.warn(
              "⚠️ [QuizScreen] exerciseId não fornecido. O progresso do exercício não será salvo detalhadamente."
            );
          }

          queryClient.invalidateQueries({
            queryKey: COURSE_PROGRESS_KEYS.byUserAndCourse(user.uid, courseId),
          });
          // TODO: Salvar histórico específico de curso se necessário
        }
        // --- Lógica para FIXE (Standard/Daily) ---
        else {
          const today = new Date().toISOString().split("T")[0];
          const dailySubcategoryId = `DAILY_${today}`;

          const historySubcategoryId = isDaily ? dailySubcategoryId : subcategoryId!;

          const userHistory: IQuizHistory = {
            userId: user.uid,
            categoryId: categoryId || "DAILY",
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

          if (!isDaily && subcategoryId) {
            promises.push(
              saveUserCompletedSubcategories(user.uid, categoryId!, subcategoryId)
            );
          }

          await Promise.all(promises);
          await updateUserScore(user.uid, user.displayName || "Usuário");

          if (isDaily) {
            queryClient.invalidateQueries({ queryKey: ["dailyQuizStatus", user.uid] });
            queryClient.invalidateQueries({ queryKey: ["userStreak", user.uid] });
          } else {
            queryClient.invalidateQueries({ queryKey: ["userQuizProgress", user.uid] });
          }
          queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
          queryClient.invalidateQueries({ queryKey: ["userScore", user.uid] });
        }
      }

      // Navegação para Resultado
      navigation.navigate("QuizResult", {
        categoryId,
        categoryName:
          categoryName || (isCourse ? "Exercício de Fixação" : "Desafio Diário"),
        subcategoryName: subcategoryName || (isCourse ? "Conclusão da Aula" : "Geral"),
        subtitle,
        correctAnswers,
        totalQuestions,
        percentage,
        level,
        userAnswers: finalAnswers,
        courseId, // Params opcionais para o modo Curso
        lessonId,
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
        userAnswers: finalAnswers,
        courseId,
        lessonId,
      });
    } finally {
      setIsSubmitting(false);
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

  // Exibir tela de erro se o carregamento terminou mas o quiz não foi encontrado
  if (!isLoading && isCourse && !quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text
            style={[
              styles.loadingText,
              { color: theme.colors.error || "#FF6B6B", marginBottom: 16 },
            ]}
          >
            Exercício não encontrado.
          </Text>
          <Text style={[styles.loadingText, { fontSize: 14, marginBottom: 24 }]}>
            Não foi possível carregar as questões deste exercício.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
              ← Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || !quiz || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToBack}>
          <ArrowLeft size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isDaily && currentQuestion.originCategory
            ? currentQuestion.originCategory
            : categoryName || "Desafio Diário"}
        </Text>
      </View>

      {/* Progress Bar */}
      <QuizProgressBar
        current={currentQuestionIndex + 1}
        total={quiz.questions.length}
        title={
          isDaily && currentQuestion.originSubcategory
            ? currentQuestion.originSubcategory
            : subcategoryName || "Perguntas Aleatórias"
        }
        subtitle={subtitle}
      />

      {/* Conteúdo */}
      <ScrollView
        ref={scrollViewRef}
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
        {/* ✅ Ocultar botão "Parar" em exercícios de curso */}
        {!isCourse && (
          <View style={styles.sheetButton}>
            <Button
              title="Parar"
              variant="outline"
              onPress={handleStop}
              fullWidth
              disabled={currentQuestionIndex === 0}
            />
          </View>
        )}
        <View style={styles.sheetButton}>
          <Button
            title={isLastQuestion ? "Finalizar" : "Próxima"}
            onPress={handleConfirm}
            fullWidth
            loading={isLastQuestion && isSubmitting}
            disabled={isSubmitting}
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

      <BottomSheetMessage ref={guestSheetRef} config={messageConfig} />
    </SafeAreaView>
  );
}
