import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useQuiz } from "@/hooks/queries/useQuiz";
import { QuizProgressBar } from "@/components/QuizProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";
import { FixStackParamList } from "@/routers/types";
import { IQuizAnswer } from "@/types/quiz";

type QuizRouteProp = RouteProp<FixStackParamList, "Quiz">;
type QuizNavigationProp = NativeStackNavigationProp<FixStackParamList, "Quiz">;

export function QuizScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<QuizRouteProp>();
  const navigation = useNavigation<QuizNavigationProp>();

  const { subcategoryId, categoryName, subcategoryName } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<IQuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const { data: quiz, isLoading } = useQuiz(subcategoryId);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions.length || 0) - 1;

  function handleSelectAnswer(index: number) {
    if (selectedAnswer !== null) return; // Já selecionou
    setSelectedAnswer(index);
  }

  function handleConfirm() {
    if (selectedAnswer === null || !currentQuestion) return;

    // Mostrar feedback visual
    setShowFeedback(true);

    // Salvar resposta
    const answer: IQuizAnswer = {
      question: currentQuestion.title,
      alternatives: currentQuestion.alternatives,
      correctAnswerIndex: currentQuestion.correct,
      selectedAnswerIndex: selectedAnswer,
      explanation: currentQuestion.explanation,
    };

    setUserAnswers([...userAnswers, answer]);
  }

  function handleNext() {
    if (isLastQuestion) {
      handleFinish();
    } else {
      // Próxima pergunta
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }

  function handleFinish() {
    if (!quiz) return;

    // Calcular resultados
    const allAnswers = [...userAnswers];
    const correctAnswers = allAnswers.filter(
      (answer) => answer.selectedAnswerIndex === answer.correctAnswerIndex
    ).length;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.floor((correctAnswers / totalQuestions) * 100);

    // Determinar nível
    let level: string;
    if (percentage >= 90) level = "Ótimo";
    else if (percentage >= 70) level = "Bom";
    else if (percentage >= 50) level = "Regular";
    else level = "Fraco";

    // Navegar para resultado
    navigation.navigate("QuizResult", {
      categoryName,
      subcategoryName,
      correctAnswers,
      totalQuestions,
      percentage,
      level,
      userAnswers: allAnswers,
    });
  }

  function handleStop() {
    Alert.alert(
      "Parar Quiz",
      "Tem certeza que deseja parar? Seu progresso será perdido.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Parar", style: "destructive", onPress: () => navigation.goBack() },
      ]
    );
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
          onPress={handleStop}
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
          showFeedback={showFeedback}
        />
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.footer}>
        {!showFeedback ? (
          <Button
            title="Confirmar"
            onPress={handleConfirm}
            disabled={selectedAnswer === null}
            fullWidth
          />
        ) : (
          <Button
            title={isLastQuestion ? "Finalizar" : "Próxima"}
            onPress={handleNext}
            fullWidth
          />
        )}
      </View>
    </SafeAreaView>
  );
}
