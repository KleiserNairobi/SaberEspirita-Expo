import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { ChevronRight } from "lucide-react-native";

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
  const totalLessons = course.lessonCount || (course as any).lessonsCount || 0;
  const completedCount = progress?.completedLessons ? progress.completedLessons.length : 0;

  const completionPercent =
    totalLessons > 0
      ? (completedCount / totalLessons) * 100
      : (progress as any)?.progressPercentage ?? 0;

  const displayPercent = Math.min(Math.round(completionPercent), 100);
  const lessonOrder = nextLesson
    ? (nextLesson as any).order ?? (nextLesson as any).orderIndex ?? 1
    : 1;

  const lessonTitleText =
    displayPercent === 100
      ? "Curso Concluído! Parabéns."
      : nextLesson
      ? `Aula ${lessonOrder}: ${nextLesson.title}`
      : "Continuar Curso";

  const imageSource =
    typeof course.imageUrl === "string" && course.imageUrl.trim().length > 0
      ? { uri: course.imageUrl }
      : typeof course.imageUrl === "number"
        ? course.imageUrl
        : require("@/assets/images/placeholder.jpeg");

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={imageSource}
        placeholder={require("@/assets/images/placeholder.jpeg")}
        style={styles.thumbnail}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.label}>Continue de onde parou</Text>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.textContainer}>
            <Text style={styles.courseTitle} numberOfLines={1} ellipsizeMode="tail">
              {course.title}
            </Text>
            <Text style={styles.lessonTitle} numberOfLines={1} ellipsizeMode="tail">
              {lessonTitleText}
            </Text>
          </View>

          <View style={styles.actionColumn}>
            <ChevronRight size={18} color={theme.colors.textSecondary} />
            <Text style={styles.percentText}>{displayPercent}%</Text>
          </View>
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${displayPercent}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
