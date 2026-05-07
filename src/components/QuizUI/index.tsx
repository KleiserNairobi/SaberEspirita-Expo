import React, { useCallback, useMemo, useRef, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { QuestionCard } from "@/components/QuestionCard";
import { QuizProgressBar } from "@/components/QuizProgressBar";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useQuizAudio } from "@/hooks/useQuizAudio";
import { IQuestion, IQuizAnswer } from "@/types/quiz";

import { createStyles } from "./styles";

interface QuizUIProps {
  title: string;
  subtitle?: string;
  barTitle?: string;
  questions: IQuestion[];
  showStopButton?: boolean;
  isSubmitting?: boolean;
  dynamicTitles?: boolean;
  onFinish: (answers: IQuizAnswer[]) => void;
  onStop: () => void;
}

export function QuizUI({
  title,
  subtitle,
  barTitle,
  questions,
  showStopButton = true,
  isSubmitting = false,
  dynamicTitles = false,
  onFinish,
  onStop,
}: QuizUIProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const selectionLockRef = useRef(false);

  const [stop, setStop] = useState(false);
  const [next, setNext] = useState(false);
  const [isBottomSheetMounted, setIsBottomSheetMounted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<IQuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const { playFeedback } = useQuizAudio();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  function handleSelectAnswer(index: number) {
    if (isSubmitting) return;
    if (selectionLockRef.current) return;
    if (selectedAnswer !== null) return;
    selectionLockRef.current = true;
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestionIndex].correct;
    setTimeout(() => playFeedback(isCorrect), 0);
  }

  function handleConfirm() {
    if (selectedAnswer === null) {
      return handleSkipConfirm();
    }

    const currentQ = questions[currentQuestionIndex];
    const answer: IQuizAnswer = {
      question: currentQ.title,
      alternatives: currentQ.alternatives,
      correctAnswerIndex: currentQ.correct,
      selectedAnswerIndex: selectedAnswer,
      explanation: currentQ.explanation,
    };

    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      selectionLockRef.current = false;
      setCurrentQuestionIndex((prev) => prev + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      selectionLockRef.current = true;
      onFinish(newAnswers);
    }
  }

  function handleSkipConfirm() {
    setNext(true);
    setIsBottomSheetMounted(true);
    setTimeout(() => bottomSheetRef.current?.expand(), 50);
  }

  function handleNextQuestion() {
    const currentQ = questions[currentQuestionIndex];
    const answer: IQuizAnswer = {
      question: currentQ.title,
      alternatives: currentQ.alternatives,
      correctAnswerIndex: currentQ.correct,
      selectedAnswerIndex: -1,
      explanation: currentQ.explanation,
    };

    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    setStop(false);
    setNext(false);
    setIsBottomSheetMounted(false);
    bottomSheetRef.current?.close();
    setSelectedAnswer(null);
    selectionLockRef.current = false;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      onFinish(newAnswers);
    }
  }

  const handleStop = useCallback(() => {
    setStop(true);
    setNext(false);
    setIsBottomSheetMounted(true);
    setTimeout(() => bottomSheetRef.current?.expand(), 50);
  }, []);

  function handleBottomSheetPressStop() {
    bottomSheetRef.current?.close();
    onStop();
  }

  function handleBottomSheetClose() {
    setStop(false);
    setNext(false);
    setIsBottomSheetMounted(false);
    bottomSheetRef.current?.close();
  }

  function goToBack() {
    if (currentQuestionIndex !== 0) {
      handleStop();
    } else {
      onStop();
    }
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goToBack}>
          <ArrowLeft size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {dynamicTitles && currentQuestion.originCategory
            ? currentQuestion.originCategory
            : title}
        </Text>
      </View>

      {/* Progress Bar */}
      <QuizProgressBar
        current={currentQuestionIndex + 1}
        total={questions.length}
        title={
          dynamicTitles && currentQuestion.originSubcategory
            ? currentQuestion.originSubcategory
            : barTitle || "Perguntas Aleatórias"
        }
        subtitle={dynamicTitles ? currentQuestion.originSubcategorySubtitle : subtitle}
      />

      {/* Conteúdo */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.title}</Text>
        </View>

        <QuestionCard
          question={currentQuestion}
          selectedIndex={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          showFeedback={selectedAnswer !== null}
        />
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.footer}>
        {showStopButton && (
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

      {/* BottomSheet — só montado quando necessário */}
      {isBottomSheetMounted && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0} // ← começa aberto quando montado
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
                    <Button
                      title="Parar"
                      onPress={handleBottomSheetPressStop}
                      fullWidth
                    />
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
      )}
    </SafeAreaView>
  );
}
