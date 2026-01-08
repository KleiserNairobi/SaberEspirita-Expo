import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";
import { FixStackParamList } from "@/routers/types";

type QuizResultRouteProp = RouteProp<FixStackParamList, "QuizResult">;
type QuizResultNavigationProp = NativeStackNavigationProp<
  FixStackParamList,
  "QuizResult"
>;

export function QuizResultScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<QuizResultRouteProp>();
  const navigation = useNavigation<QuizResultNavigationProp>();

  const {
    categoryName,
    subcategoryName,
    correctAnswers,
    totalQuestions,
    percentage,
    level,
  } = route.params;

  // Determinar mensagem de feedback baseada no nível
  function getFeedbackMessage(level: string) {
    const messages = {
      Ótimo: {
        title: "Parabéns, querido estudante!",
        message:
          "Seu entendimento é brilhante! Revisite as explicações para solidificar ainda mais este conhecimento.",
      },
      Bom: {
        title: "Parabéns, querido estudante!",
        message:
          "Bom trabalho! Aproveite para revisar os detalhes dos conceitos mais importantes.",
      },
      Regular: {
        title: "Parabéns, querido estudante!",
        message:
          "Ótimo exercício de aprendizado! Esta é uma oportunidade perfeita para estudar as explicações.",
      },
      Fraco: {
        title: "Parabéns, querido estudante!",
        message:
          "A jornada do conhecimento começa com um passo. Explore as explicações doutrinárias para sua evolução.",
      },
    };

    return messages[level as keyof typeof messages] || messages.Fraco;
  }

  // Determinar número de estrelas baseado no percentage
  function getStarCount(percentage: number): number {
    if (percentage >= 90) return 4;
    if (percentage >= 70) return 3;
    if (percentage >= 50) return 2;
    return 1;
  }

  const feedback = getFeedbackMessage(level);
  const starCount = getStarCount(percentage);

  function handleContinue() {
    // Voltar para a lista de subcategorias
    navigation.navigate("FixHome");
  }

  function handleReview() {
    // TODO: Implementar tela de revisão de respostas
    // navigation.navigate('QuizReview', { userAnswers });
    handleContinue(); // Por enquanto, volta para home
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ilustração de Estrelas */}
        <View style={styles.starsContainer}>
          <View style={styles.starsRow}>
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.star,
                  index < starCount ? styles.starActive : styles.starInactive,
                ]}
              >
                <Text style={styles.starText}>⭐</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.subcategoryName}>{subcategoryName}</Text>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {correctAnswers} / {totalQuestions}
            </Text>
            <Text style={styles.statLabel}>Questões corretas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{percentage}%</Text>
            <Text style={styles.statLabel}>Percentual de acertos</Text>
          </View>
        </View>

        {/* Mensagem de Desbloqueio */}
        <Text style={styles.unlockMessage}>
          Você desbloqueou {totalQuestions} explicações doutrinárias
        </Text>

        {/* Feedback */}
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>{feedback.title}</Text>
          <Text style={styles.feedbackMessage}>{feedback.message}</Text>
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.footer}>
        <Button title="Continuar" onPress={handleContinue} variant="outline" fullWidth />
        <Button title="Revisar e Aprender" onPress={handleReview} fullWidth />
      </View>
    </SafeAreaView>
  );
}
