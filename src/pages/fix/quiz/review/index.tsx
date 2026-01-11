import React, { useLayoutEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Star, CheckCircle2, XCircle, ArrowLeft } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { FixStackParamList } from "@/routers/types";
import { IQuizAnswer } from "@/types/quiz";
import { createStyles } from "./styles";

type QuizReviewRouteProp = RouteProp<FixStackParamList, "QuizReview">;
type QuizReviewNavigationProp = NativeStackNavigationProp<
  FixStackParamList,
  "QuizReview"
>;

export function QuizReviewScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<QuizReviewRouteProp>();
  const navigation = useNavigation<any>(); // Usando any para permitir navegação entre stacks (FIXE e APP)

  const {
    categoryId,
    categoryName,
    subcategoryName,
    subtitle,
    totalQuestions,
    percentage,
    level,
    userAnswers,
    courseId, // ← NOVO: courseId opcional para exercícios de curso
  } = route.params;

  function handleBack() {
    navigation.goBack();
  }

  // Determinar número de estrelas preenchidas
  function getFilledStarsCount(level: string) {
    switch (level) {
      case "Ótimo":
        return 4;
      case "Bom":
        return 3;
      case "Regular":
        return 2;
      default:
        return 1;
    }
  }

  const filledStars = getFilledStarsCount(level);

  function handleContinue() {
    // ✅ MODIFICADO: Se for exercício de curso, voltar para QuizResult
    // para que a lógica de próximo exercício seja executada
    if (courseId) {
      // ✅ MODIFICADO: Voltar para o currículo para manter fluxo linear
      navigation.reset({
        index: 1,
        routes: [
          { name: "Tabs" },
          {
            name: "CourseCurriculum",
            params: { courseId },
          },
        ],
      });
    } else {
      // Contexto de FIXE: Usar reset para limpar a pilha
      navigation.reset({
        index: 1,
        routes: [
          { name: "FixHome" },
          {
            name: "Subcategories",
            params: {
              categoryId,
              categoryName,
            },
          },
        ],
      });
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Revisão das respostas</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Stats */}
          <View style={styles.statsHeader}>
            <View style={styles.statsLeft}>
              <Text style={styles.subcategoryTitle}>{subcategoryName}</Text>
              {subtitle && <Text style={styles.categoryTitle}>{subtitle}</Text>}
              <Text style={styles.questionCount}>{totalQuestions} questões</Text>
            </View>

            <View style={styles.statsRight}>
              <Text style={styles.percentageData}>{percentage}%</Text>
              <Text style={styles.percentageLabel}>de acertos</Text>
              <View style={styles.starsRow}>
                {[...Array(4)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill={
                      index < filledStars ? theme.colors.warning : theme.colors.border
                    }
                    color={
                      index < filledStars ? theme.colors.warning : theme.colors.border
                    }
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Lista de Questões */}
          {userAnswers.map((answer: IQuizAnswer, index: number) => {
            const isCorrect = answer.selectedAnswerIndex === answer.correctAnswerIndex;
            const statusColor = isCorrect ? theme.colors.success : theme.colors.error;

            // Fundo do badge com opacidade
            const badgeBg = isCorrect
              ? `${theme.colors.success}20` // 20% opacity hex
              : `${theme.colors.error}20`;

            return (
              <View key={index} style={styles.questionCard}>
                {/* Faixa lateral colorida */}
                <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />

                <View style={styles.cardContent}>
                  {/* Header do Card */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.questionIndex}>Questão {index + 1}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                      {isCorrect ? (
                        <CheckCircle2 size={14} color={theme.colors.text} />
                      ) : (
                        <XCircle size={14} color={theme.colors.text} />
                      )}
                      <Text style={styles.statusText}>
                        {isCorrect ? "certo" : "errado"}
                      </Text>
                    </View>
                  </View>

                  {/* Texto da Pergunta */}
                  <Text style={styles.questionText}>{answer.question}</Text>

                  {/* Respostas */}
                  <View style={styles.answerBlock}>
                    <Text style={styles.label}>Sua resposta:</Text>
                    <Text style={styles.answerText}>
                      {answer.selectedAnswerIndex !== null &&
                      answer.selectedAnswerIndex !== -1
                        ? answer.alternatives[answer.selectedAnswerIndex]
                        : "Pulou a questão"}
                    </Text>
                  </View>

                  <View style={styles.answerBlock}>
                    <Text style={styles.label}>Resposta correta:</Text>
                    <Text style={styles.answerText}>
                      {answer.alternatives[answer.correctAnswerIndex]}
                    </Text>
                  </View>

                  {/* Explicação */}
                  {answer.explanation && (
                    <View style={styles.explanationBlock}>
                      <Text style={styles.explanationTitle}>Explicação doutrinária:</Text>
                      <Text style={styles.explanationText}>{answer.explanation}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button title="Continuar" onPress={handleContinue} fullWidth />
        </View>
      </View>
    </SafeAreaView>
  );
}
