import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, ArrowRight, BookOpen, Tag } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { DifficultyBadge } from "../DifficultyBadge";
import { createStyles } from "./styles";

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
  const styles = createStyles(theme);

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
          <Text style={styles.subtitle}>
            {hasAnswered ? "Você já respondeu hoje" : "Uma nova pergunta te aguarda"}
          </Text>
        </View>
      </View>

      <View style={styles.metadata}>
        <View style={styles.metadataItem}>
          <Tag size={16} color={theme.colors.muted} />
          <Text style={styles.metadataText}>{topic}</Text>
        </View>
        <DifficultyBadge level={difficulty} />
      </View>

      <View style={styles.footer}>
        <Text
          style={[
            styles.buttonText,
            {
              color: hasAnswered ? theme.colors.text : theme.colors.primary,
            },
          ]}
        >
          {buttonText}
        </Text>
        <ArrowRight
          size={20}
          color={hasAnswered ? theme.colors.text : theme.colors.primary}
        />
      </View>
    </TouchableOpacity>
  );
}
