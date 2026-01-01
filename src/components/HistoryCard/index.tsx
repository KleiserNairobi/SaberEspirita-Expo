import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle2, XCircle, Tag } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { IUserTruthOrFalseResponse } from "@/types/userTruthOrFalseResponse";
import { DifficultyBadge } from "../DifficultyBadge";
import { createStyles } from "./styles";

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
  const styles = createStyles(theme);

  const Icon = response.isCorrect ? CheckCircle2 : XCircle;
  const iconColor = response.isCorrect ? "#10B981" : "#EF4444";

  const content = (
    <>
      {/* Header: Ícone + Pergunta */}
      <View style={styles.topSection}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.question} numberOfLines={3}>
            {questionText}
          </Text>
        </View>
      </View>

      {/* Footer: Badges (Tópico + Dificuldade) */}
      <View style={styles.footer}>
        {/* Tópico */}
        <View style={styles.metadataItem}>
          <Tag size={16} color={theme.colors.muted} />
          <Text style={styles.metadataText}>{questionTopic}</Text>
        </View>

        {/* Dificuldade */}
        <DifficultyBadge level={questionDifficulty} />
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{content}</View>;
}
