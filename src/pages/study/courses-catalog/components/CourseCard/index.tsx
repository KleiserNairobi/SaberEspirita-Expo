import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { BookOpen, Clock, BarChart3 } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ICourse } from "@/types/course";

import { createStyles } from "./styles";

interface CourseCardProps {
  course: ICourse;
  progress?: number; // 0-100
  onPress: () => void;
}

export function CourseCard({ course, progress, onPress }: CourseCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const hours = Math.floor(course.workloadMinutes / 60);
  const minutes = course.workloadMinutes % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;

  // Truncar descrição em 2 linhas (aproximadamente 60 caracteres para layout horizontal)
  const truncatedDescription =
    course.description.length > 60
      ? `${course.description.substring(0, 60)}...`
      : course.description;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Imagem à Esquerda (Formato Retrato 3:4) */}
      <View style={styles.imagePlaceholder}>
        {course.imageUrl ? (
          <>
            <Image
              source={course.imageUrl as any}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <View style={styles.gradientOverlay} />
          </>
        ) : (
          <>
            <View style={styles.gradientOverlay} />
            <BookOpen size={32} color={theme.colors.primary} />
          </>
        )}
      </View>

      {/* Conteúdo à Direita */}
      <View style={styles.content}>
        <View style={styles.topContent}>
          {/* Título */}
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>

          {/* Descrição */}
          <Text style={styles.description} numberOfLines={2}>
            {truncatedDescription}
          </Text>
        </View>

        {/* Metadados */}
        <View style={styles.metadataRow}>
          {/* Aulas */}
          <View style={styles.metadataItem}>
            <BookOpen size={12} color={theme.colors.muted} />
            <Text style={styles.metadataText}>{course.lessonCount} aulas</Text>
          </View>

          <Text style={styles.metadataSeparator}>•</Text>

          {/* Duração */}
          <View style={styles.metadataItem}>
            <Clock size={12} color={theme.colors.muted} />
            <Text style={styles.metadataText}>{durationText}</Text>
          </View>

          <Text style={styles.metadataSeparator}>•</Text>

          {/* Nível */}
          <View style={styles.metadataItem}>
            <BarChart3 size={12} color={theme.colors.muted} />
            <Text style={styles.metadataText}>{course.difficultyLevel}</Text>
          </View>
        </View>

        {/* Barra de Progresso (se houver) */}
        {progress !== undefined && progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% concluído</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
