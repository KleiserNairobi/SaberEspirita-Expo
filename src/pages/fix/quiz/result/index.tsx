import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
import { createStyles } from "./styles";
import { FixStackParamList, AppStackParamList } from "@/routers/types";

type QuizResultRouteProp = RouteProp<FixStackParamList, "QuizResult">;
type QuizResultNavigationProp = NativeStackNavigationProp<
  FixStackParamList & AppStackParamList, // Union to support both stacks
  "QuizResult"
>;

export function QuizResultScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const route = useRoute<QuizResultRouteProp>();
  const navigation = useNavigation<QuizResultNavigationProp>();

  const {
    categoryId,
    categoryName,
    subcategoryName,
    subtitle,
    correctAnswers,
    totalQuestions,
    percentage,
    level,
    userAnswers,
    courseId,
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

  // Determinar imagem de resultado baseada no percentage
  function getResultImage(percentage: number) {
    if (percentage >= 90) return require("@/assets/images/stars/FourStars.png");
    if (percentage >= 70) return require("@/assets/images/stars/ThreeStars.png");
    if (percentage >= 50) return require("@/assets/images/stars/TwoStars.png");
    return require("@/assets/images/stars/OneStar.png");
  }

  const feedback = getFeedbackMessage(level);
  const resultImage = getResultImage(percentage);

  function handleContinue() {
    // Se for modo Curso, voltar para o currículo do curso
    if (courseId) {
      // Cast to any to avoid strict type checking conflict for this specific reset
      (navigation as any).reset({
        index: 1,
        routes: [
          { name: "Tabs" }, // Garante que a Tab esteja na base
          {
            name: "CourseCurriculum",
            params: { courseId },
          },
        ],
      });
      return;
    }

    // Se for desafio diário, voltar para home
    if (categoryId === "DAILY") {
      navigation.reset({
        index: 0,
        routes: [{ name: "FixHome" }],
      });
      return;
    }

    // FIX: Usar reset para limpar a pilha e garantir que o botão voltar leve à FixHome
    navigation.reset({
      index: 1,
      routes: [
        { name: "FixHome" },
        {
          name: "Subcategories",
          params: {
            categoryId: categoryId || "DAILY", // Fallbacks for safety
            categoryName: categoryName || "Desafio",
          },
        },
      ],
    });
  }

  function handleReview() {
    navigation.navigate("QuizReview", {
      categoryId: categoryId || "DAILY",
      categoryName: categoryName || "Desafio",
      subcategoryName: subcategoryName || "Geral",
      subtitle,
      totalQuestions,
      percentage,
      level,
      userAnswers: userAnswers || [],
      courseId, // ← NOVO: Passa courseId para QuizReview
    });
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
          <Image source={resultImage} style={styles.resultImage} resizeMode="contain" />
        </View>

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.subcategoryName}>{subcategoryName}</Text>
          <Text style={styles.categoryName} numberOfLines={2}>
            {subtitle || categoryName}
          </Text>
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
