import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Home, BookmarkPlus } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { FixStackParamList } from "@/routers/types";
import { truthOrFalseQuestions } from "@/data/truthOrFalseQuestions";
import { ResultFeedback } from "@/components/ResultFeedback";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { TopicTag } from "@/components/TopicTag";

type NavigationProp = NativeStackNavigationProp<FixStackParamList>;
type RoutePropType = RouteProp<FixStackParamList, "TruthOrFalseResult">;

export function TruthOrFalseResultScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();

  const { userAnswer, isCorrect, questionId } = route.params;
  const question = truthOrFalseQuestions.find((q) => q.id === questionId);

  if (!question) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Pergunta não encontrada
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate("TruthOrFalseHome")}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Badges */}
        <View style={styles.badges}>
          <TopicTag topic={question.topic} />
          <DifficultyBadge level={question.difficulty} />
        </View>

        {/* Pergunta */}
        <View style={[styles.questionCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.question, { color: theme.colors.text }]}>
            {question.question}
          </Text>
        </View>

        {/* Feedback */}
        <ResultFeedback
          isCorrect={isCorrect}
          userAnswer={userAnswer}
          correctAnswer={question.correct}
        />

        {/* Explicação */}
        <View style={[styles.explanationCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.explanationTitle, { color: theme.colors.text }]}>
            Explicação
          </Text>
          <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
            {question.explanation}
          </Text>
          {question.reference && (
            <View style={styles.referenceContainer}>
              <Text
                style={[styles.referenceLabel, { color: theme.colors.textSecondary }]}
              >
                Referência:
              </Text>
              <Text style={[styles.referenceText, { color: theme.colors.primary }]}>
                {question.reference}
              </Text>
            </View>
          )}
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate("TruthOrFalseHome")}
          >
            <Home size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.card }]}
            onPress={() => {
              // TODO: Implementar salvar na biblioteca
              console.log("Salvar na biblioteca");
            }}
          >
            <BookmarkPlus size={20} color={theme.colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
              Salvar para Revisar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  questionCard: {
    padding: 20,
    borderRadius: 16,
  },
  question: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  explanationCard: {
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 22,
  },
  referenceContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  referenceLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  referenceText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
