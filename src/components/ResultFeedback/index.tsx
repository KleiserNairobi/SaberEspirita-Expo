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
  // Usando cores do tema
  const mainColor = isCorrect ? theme.colors.success : theme.colors.error;

  // Background com opacidade (simulada ou definida)
  // Como as cores do tema são hex, podemos anexar opacidade se necessário
  // Mas para consistência, vamos usar mainColor e um bg suave do próprio tema se existir,
  // ou manter a lógica de adicionar '20' se garantir que é hex.
  // Assumindo que theme.colors.success/error são HEX (como visto no arquivo de tema), o sufixo funciona.
  const bgColor = mainColor + "15";
  const borderColor = mainColor + "30";

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
          <Icon size={20} color={mainColor} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: mainColor }]}>{title}</Text>
          <View style={styles.answersContainer}>
            <View style={styles.answerRow}>
              <Text style={styles.answerLabel}>Sua resposta:</Text>
              <Text
                style={[
                  styles.answerValue,
                  {
                    color: isCorrect ? mainColor : theme.colors.error,
                  },
                ]}
              >
                {getUserAnswerText()}
              </Text>
            </View>

            {!isCorrect && (
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Resposta correta:</Text>
                <Text style={[styles.answerValue, { color: theme.colors.success }]}>
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
