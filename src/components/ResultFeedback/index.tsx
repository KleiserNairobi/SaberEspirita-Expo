import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle2, XCircle } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ITheme } from "@/configs/theme/types";

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
  const styles = createStyles(theme);

  const Icon = isCorrect ? CheckCircle2 : XCircle;
  const iconColor = isCorrect ? "#10B981" : "#EF4444";
  const bgColor = isCorrect ? "#10B98115" : "#EF444415";
  const borderColor = isCorrect ? "#10B98130" : "#EF444430";
  const title = isCorrect ? "Parabéns! Você acertou!" : "Ops! Você errou.";

  const getUserAnswerText = () => {
    return userAnswer ? "Verdade" : "Mentira";
  };

  const getCorrectAnswerText = () => {
    return correctAnswer ? "Verdade" : "Mentira";
  };

  return (
    <View
      style={[styles.container, { backgroundColor: bgColor, borderColor: borderColor }]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: iconColor }]}>{title}</Text>
          <View style={styles.answersContainer}>
            <View style={styles.answerRow}>
              <Text style={styles.answerLabel}>Sua resposta:</Text>
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
                <Text style={styles.answerLabel}>Resposta correta:</Text>
                <Text style={[styles.answerValue, { color: "#10B981" }]}>
                  {getCorrectAnswerText()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.radius.md,
      borderWidth: 1,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: theme.spacing.md, // Reduzido de lg para md
      gap: theme.spacing.md,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    headerTextContainer: {
      flex: 1,
    },
    title: {
      ...theme.text("lg", "semibold"),
      marginBottom: theme.spacing.xs, // Reduzido de sm para xs
    },
    answersContainer: {
      gap: 4, // Reduzido de 6 para 4
    },
    answerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    answerLabel: {
      ...theme.text("sm", "regular"),
      color: theme.colors.textSecondary,
    },
    answerValue: {
      ...theme.text("md", "regular"), // Reduzido de semibold para regular
    },
  });
