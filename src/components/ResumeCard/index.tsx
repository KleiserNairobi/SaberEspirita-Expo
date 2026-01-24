import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play, Check, RotateCw } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ICourse, ILesson, IUserCourseProgress } from "@/types/course";
import { createStyles } from "./styles";

interface ResumeCardProps {
  course: ICourse;
  progress: IUserCourseProgress;
  nextLesson?: ILesson;
  onPress: () => void;
}

export function ResumeCard({ course, progress, nextLesson, onPress }: ResumeCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Calcular porcentagem de progresso do curso (baseado em aulas concluídas / total de aulas)
  // Fallback seguro se lessonCount for 0
  const completionPercent =
    course.lessonCount > 0
      ? (progress.completedLessons.length / course.lessonCount) * 100
      : 0;

  const displayPercent = Math.min(Math.round(completionPercent), 100);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.label}>Continue de onde parou</Text>
        <Text style={styles.label}>{displayPercent}%</Text>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <Text style={styles.courseTitle} numberOfLines={1}>
            {course.title}
          </Text>
          <Text style={styles.lessonTitle} numberOfLines={1}>
            {displayPercent === 100
              ? "Curso Concluído! Parabéns."
              : nextLesson
                ? `Aula ${nextLesson.order}: ${nextLesson.title}`
                : "Continuar Curso"}
          </Text>
        </View>

        <View
          style={[
            styles.playButton,
            displayPercent === 100 && { backgroundColor: theme.colors.success },
          ]}
        >
          {displayPercent === 100 ? (
            <Check size={20} color="#FFF" />
          ) : (
            <Play
              size={20}
              color={theme.colors.onPrimary}
              fill={theme.colors.onPrimary}
            />
          )}
        </View>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${displayPercent}%` }]} />
      </View>
    </TouchableOpacity>
  );
}
