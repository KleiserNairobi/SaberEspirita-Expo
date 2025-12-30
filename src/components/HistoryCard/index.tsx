import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CheckCircle2, XCircle, Calendar } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";
import { DifficultyBadge } from "../DifficultyBadge";
import { TopicTag } from "../TopicTag";

interface HistoryCardProps {
  response: IUserTruthOrFalseResponse;
  questionText: string;
  questionTopic: string;
  questionDifficulty: "Fácil" | "Médio" | "Difícil";
  onPress?: () => void;
}

export function HistoryCard({
  response,
  questionText,
  questionTopic,
  questionDifficulty,
  onPress,
}: HistoryCardProps) {
  const { theme } = useAppTheme();

  const Icon = response.isCorrect ? CheckCircle2 : XCircle;
  const iconColor = response.isCorrect ? "#10B981" : "#EF4444";

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const content = (
    <>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.badges}>
            <TopicTag topic={questionTopic} />
            <DifficultyBadge level={questionDifficulty} />
          </View>
          <View style={styles.dateContainer}>
            <Calendar size={12} color={theme.colors.textSecondary} />
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {formatDate(response.date)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.question, { color: theme.colors.text }]} numberOfLines={2}>
        {questionText}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.answerLabel, { color: theme.colors.textSecondary }]}>
          Sua resposta:{" "}
          <Text style={[styles.answerValue, { color: iconColor }]}>
            {response.userAnswer ? "Verdade" : "Mentira"}
          </Text>
        </Text>
        {response.savedToLibrary && (
          <View
            style={[styles.savedBadge, { backgroundColor: theme.colors.primary + "15" }]}
          >
            <Text style={[styles.savedText, { color: theme.colors.primary }]}>Salvo</Text>
          </View>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    gap: 6,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
  },
  question: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answerLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  answerValue: {
    fontWeight: "700",
  },
  savedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savedText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
