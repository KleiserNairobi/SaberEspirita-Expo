import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle2, XCircle, Tag, Calendar } from "lucide-react-native";
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
  const iconColor = response.isCorrect ? theme.colors.success : theme.colors.error;
  const bgColor = iconColor + "20"; // Background com opacidade

  // Formatação da data para exibição (dd/mm/yyyy às HH:mm)
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formattedDate = formatDate(response.respondedAt || response.date);

  const content = (
    <>
      {/* Header: Ícone + Pergunta */}
      <View style={styles.topSection}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.question} numberOfLines={3}>
            {questionText}
          </Text>
        </View>
      </View>

      {/* Footer: Metadados (2 Colunas) */}
      <View style={styles.footer}>
        {/* Coluna Esquerda: Tópico e Data */}
        <View style={styles.footerLeft}>
          {/* Tópico */}
          <View style={styles.metadataItem}>
            <Tag size={14} color={theme.colors.muted} />
            <Text style={styles.metadataText} numberOfLines={1}>
              {questionTopic}
            </Text>
          </View>

          {/* Data */}
          <View style={styles.metadataItem}>
            <Calendar size={14} color={theme.colors.muted} />
            <Text style={styles.metadataText}>{formattedDate}</Text>
          </View>
        </View>

        {/* Coluna Direita: Dificuldade */}
        <View style={styles.footerRight}>
          <DifficultyBadge level={questionDifficulty} />
        </View>
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
