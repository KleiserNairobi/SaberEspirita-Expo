import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle2, XCircle } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface ResultFeedbackProps {
  isCorrect: boolean;
  userAnswer: boolean;
  correctAnswer: boolean;
}

export function ResultFeedback({
  isCorrect,
  userAnswer,
  correctAnswer,
}: ResultFeedbackProps) {
  const { theme } = useAppTheme();

  const Icon = isCorrect ? CheckCircle2 : XCircle;
  const iconColor = isCorrect ? "#10B981" : "#EF4444";
  const bgColor = isCorrect ? "#10B98115" : "#EF444415";
  const title = isCorrect ? "Parabéns! Você acertou!" : "Ops! Você errou.";

  const getUserAnswerText = () => {
    return userAnswer ? "Verdade" : "Mentira";
  };

  const getCorrectAnswerText = () => {
    return correctAnswer ? "Verdade" : "Mentira";
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Icon size={32} color={iconColor} />
        <Text style={[styles.title, { color: iconColor }]}>{title}</Text>
      </View>

      <View style={styles.answersContainer}>
        <View style={styles.answerRow}>
          <Text style={[styles.answerLabel, { color: theme.colors.textSecondary }]}>
            Sua resposta:
          </Text>
          <Text
            style={[
              styles.answerValue,
              {
                color: isCorrect ? iconColor : "#EF4444",
              },
            ]}
          >
            {getUserAnswerText()}
          </Text>
        </View>

        {!isCorrect && (
          <View style={styles.answerRow}>
            <Text style={[styles.answerLabel, { color: theme.colors.textSecondary }]}>
              Resposta correta:
            </Text>
            <Text style={[styles.answerValue, { color: "#10B981" }]}>
              {getCorrectAnswerText()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  answersContainer: {
    gap: 8,
  },
  answerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  answerValue: {
    fontSize: 16,
    fontWeight: "700",
  },
});
