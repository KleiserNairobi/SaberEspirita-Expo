import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

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

  /* Lógica corrigida para exibir placeholder caso a URL venha vazia ou indefinida */
  const imageSource =
    typeof course.imageUrl === "string" && course.imageUrl.trim().length > 0
      ? { uri: course.imageUrl }
      : typeof course.imageUrl === "number"
        ? course.imageUrl
        : require("@/assets/images/placeholder.png");

  // Verificar se o curso está em breve
  const isComingSoon = course.status === "COMING_SOON";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={isComingSoon ? undefined : onPress}
      activeOpacity={isComingSoon ? 1 : 0.7}
      disabled={isComingSoon}
    >
      <View style={styles.imagePlaceholder}>
        <Image
          source={imageSource as any}
          style={styles.courseImage}
          contentFit="cover"
          transition={200}
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        />
        <View style={styles.gradientOverlay} />
      </View>

      {/* Conteúdo à Direita */}
      <View style={styles.content}>
        <View style={styles.topContent}>
          {/* Título */}
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>

          {/* Descrição */}
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {course.description}
          </Text>
        </View>

        {/* Se COMING_SOON: Badge laranja no lugar dos metadados */}
        {isComingSoon ? (
          <View style={styles.comingSoonBadgeLarge}>
            <Text style={styles.comingSoonTextLarge}>EM BREVE</Text>
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
