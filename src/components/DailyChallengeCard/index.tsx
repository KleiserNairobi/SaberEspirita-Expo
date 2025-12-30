import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, ArrowRight, BookOpen } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { DifficultyBadge } from "../DifficultyBadge";
import { TopicTag } from "../TopicTag";

interface DailyChallengeCardProps {
  topic: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  hasAnswered: boolean;
  onPress: () => void;
}

export function DailyChallengeCard({
  topic,
  difficulty,
  hasAnswered,
  onPress,
}: DailyChallengeCardProps) {
  const { theme } = useAppTheme();

  const Icon = hasAnswered ? BookOpen : Calendar;
  const buttonText = hasAnswered ? "Ver Explicação" : "Responder Agora";
  const cardTitle = hasAnswered ? "Desafio Concluído!" : "Desafio de Hoje";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: hasAnswered ? theme.colors.card : theme.colors.primary + "10",
          borderColor: hasAnswered ? theme.colors.border : theme.colors.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: hasAnswered
                ? theme.colors.primary + "20"
                : theme.colors.primary,
            },
          ]}
        >
          <Icon size={24} color={hasAnswered ? theme.colors.primary : "#fff"} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{cardTitle}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {hasAnswered ? "Você já respondeu hoje" : "Uma nova pergunta te aguarda"}
          </Text>
        </View>
      </View>

      <View style={styles.badges}>
        <TopicTag topic={topic} />
        <DifficultyBadge level={difficulty} />
      </View>

      <View style={styles.footer}>
        <Text
          style={[
            styles.buttonText,
            {
              color: hasAnswered ? theme.colors.primary : theme.colors.primary,
            },
          ]}
        >
          {buttonText}
        </Text>
        <ArrowRight
          size={20}
          color={hasAnswered ? theme.colors.primary : theme.colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
