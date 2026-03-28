import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Award, BookOpen, Pencil, Lightbulb } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/components/Button";
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
  hasCertificate?: boolean; // Prop opcional, default true para retrocompatibilidade se necessário
  onRateCourse?: () => void; // Ação de clique
  onOpenMethodology?: () => void; // Ação para abrir pop-up de metodologia
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
  hasCertificate = true,
  onRateCourse,
  onOpenMethodology,
}: ProgressSummaryCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Título da Série */}
      <View style={styles.header}>
        <Text style={styles.title}>{courseTitle}</Text>
        {certificateEligible && <Award size={24} color={theme.colors.primary} />}
      </View>

      {/* Progresso de Aulas */}
      <View style={styles.progressSection}>
        <View style={styles.progressIconContainer}>
          <BookOpen size={22} color="#6B7A5F" />
        </View>
        <View style={styles.progressContent}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Aulas Concluídas</Text>
            <Text style={styles.progressPercent}>{lessonsProgress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                styles.progressBarLessons,
                { width: `${lessonsProgress}%`, backgroundColor: "#6B7A5F" },
              ]}
            />
          </View>
          <Text style={styles.progressFooter}>
            {completedLessons} de {totalLessons} aulas concluídas
          </Text>
        </View>
      </View>

      {/* Progresso de Exercícios */}
      <View style={styles.progressSection}>
        <View style={styles.progressIconContainer}>
          <Pencil size={22} color="#6B7A5F" />
        </View>
        <View style={styles.progressContent}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Exercícios Completos</Text>
            <Text style={styles.progressPercent}>{exercisesProgress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                styles.progressBarExercises,
                { width: `${exercisesProgress}%`, backgroundColor: "#6B7A5F" },
              ]}
            />
          </View>
          <Text style={styles.progressFooter}>
            {completedExercises} de {totalExercises} exercícios completos
          </Text>
        </View>
      </View>

      {/* Botões de Ação */}
      {(onRateCourse || onOpenMethodology) && (
        <View style={styles.rateButtonContainer}>
          {onOpenMethodology && (
            <TouchableOpacity
              style={styles.methodologyButton}
              onPress={onOpenMethodology}
              activeOpacity={0.7}
            >
              <Lightbulb size={20} color="#7A8C70" />
              <Text style={styles.methodologyButtonText}>Sobre a Pedagogia</Text>
            </TouchableOpacity>
          )}
          {onRateCourse && (
            <TouchableOpacity
              style={styles.rateButton}
              onPress={onRateCourse}
              activeOpacity={0.7}
            >
              <Text style={styles.rateButtonText}>Deixar Avaliação</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
