import React from "react";
import { View, Text } from "react-native";
import { Award } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface ProgressSummaryCardProps {
  courseTitle: string;
  lessonsProgress: number; // 0-100
  exercisesProgress: number; // 0-100
  totalLessons: number;
  completedLessons: number;
  totalExercises: number;
  completedExercises: number;
  certificateEligible: boolean;
}

export function ProgressSummaryCard({
  courseTitle,
  lessonsProgress,
  exercisesProgress,
  totalLessons,
  completedLessons,
  totalExercises,
  completedExercises,
  certificateEligible,
}: ProgressSummaryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Mensagem condicional baseada no progresso de exercícios
  function getProgressMessage() {
    if (certificateEligible) {
      return "🎉 Parabéns! Você está pronto para o certificado!";
    }
    if (exercisesProgress === 0) {
      return "Complete os exercícios para obter seu certificado!";
    }
    return "Continue completando os exercícios!";
  }

  return (
    <View style={styles.container}>
      {/* Título do Curso */}
      <View style={styles.header}>
        <Text style={styles.title}>{courseTitle}</Text>
        {certificateEligible && <Award size={24} color={theme.colors.success} />}
      </View>

      {/* Progresso de Aulas */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progresso de Aulas</Text>
          <Text style={styles.progressPercent}>{lessonsProgress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              styles.progressBarLessons,
              { width: `${lessonsProgress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressFooter}>
          {completedLessons} de {totalLessons} aulas concluídas
        </Text>
      </View>

      {/* Progresso de Exercícios */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progresso de Exercícios</Text>
          <Text style={styles.progressPercent}>{exercisesProgress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              styles.progressBarExercises,
              { width: `${exercisesProgress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressFooter}>
          {completedExercises} de {totalExercises} exercícios completos
        </Text>
      </View>

      {/* Mensagem de Status */}
      <View
        style={[
          styles.messageContainer,
          certificateEligible && styles.messageContainerSuccess,
        ]}
      >
        <Text
          style={[styles.messageText, certificateEligible && styles.messageTextSuccess]}
        >
          {getProgressMessage()}
        </Text>
      </View>
    </View>
  );
}
