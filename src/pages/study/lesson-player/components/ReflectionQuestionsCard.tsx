import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Sparkles } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { IReflectionQuestion } from "@/types/course";
import { ITheme } from "@/configs/theme/types";

interface ReflectionQuestionsCardProps {
  questions: IReflectionQuestion[];
  fontSize: number;
}

export function ReflectionQuestionsCard({
  questions,
  fontSize,
}: ReflectionQuestionsCardProps) {
  const { theme } = useAppTheme();

  // Animação de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Estilos padronizados
  const styles = createStyles(theme);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Sparkles size={20} color={theme.colors.reflection} />
        <Text style={styles.headerTitle}>Para Refletir</Text>
      </View>

      <Text style={[styles.subtitle, { fontSize: fontSize - 2 }]}>
        Perguntas para sua reflexão pessoal. Não é necessário responder, apenas medite
        sobre elas.
      </Text>

      {questions.map((item, index) => (
        <React.Fragment key={index}>
          <View style={styles.questionContainer}>
            <View style={styles.focusBadge}>
              <Text style={[styles.focusText, { fontSize: fontSize - 4 }]}>
                {item.focus}
              </Text>
            </View>
            <Text style={[styles.questionText, { fontSize, lineHeight: fontSize * 1.5 }]}>
              {item.question}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </Animated.View>
  );
}

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: `${theme.colors.reflection}15`, // Transparência de 15%
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.reflection,
      borderRadius: theme.radius.sm,
      marginTop: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    headerTitle: {
      ...theme.text("sm", "semibold", theme.colors.reflection),
    },
    subtitle: {
      ...theme.text("xs", "regular", theme.colors.textSecondary),
      textAlign: "justify",
      marginBottom: 16,
      lineHeight: 18,
    },
    questionContainer: {
      marginBottom: 8,
    },
    questionText: {
      ...theme.text("sm", "regular"),
      // textAlign removido: Esquerda é melhor para perguntas curtas
      // lineHeight removido aqui pois é controlado dinamicamente
      marginBottom: 8,
      opacity: 0.9,
    },
    focusBadge: {
      alignSelf: "flex-start",
      marginTop: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: `${theme.colors.reflection}25`,
    },
    focusText: {
      ...theme.text("xs", "medium", theme.colors.reflection),
    },
  });
