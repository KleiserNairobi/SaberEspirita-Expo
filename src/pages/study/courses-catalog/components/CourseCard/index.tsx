import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Image } from "expo-image";
import { BarChart3, BookOpen, Clock } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ICourse } from "@/types/course";
import { getCoursePedagogicalProfile } from "@/utils/coursePedagogy";

import { createStyles } from "./styles";

interface CourseCardProps {
  course: ICourse;
  progress?: number; // 0-100
  onPress: () => void;
}

const DIFFICULTY_MAP: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
  INICIANTE: "Iniciante",
  INTERMEDIARIO: "Intermediário",
  AVANCADO: "Avançado",
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function CourseCard({ course, progress, onPress }: CourseCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const hours = Math.floor(course.workloadMinutes / 60);
  const minutes = course.workloadMinutes % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;
  const pedagogicalProfile = getCoursePedagogicalProfile(course);

  const rawLevel = String(course.difficultyLevel || "").toLowerCase();
  const displayLevel =
    DIFFICULTY_MAP[course.difficultyLevel as string] ||
    DIFFICULTY_MAP[rawLevel] ||
    "Iniciante";

  const imageSource =
    typeof course.imageUrl === "string" && course.imageUrl.trim().length > 0
      ? { uri: course.imageUrl }
      : typeof course.imageUrl === "number"
        ? course.imageUrl
        : require("@/assets/images/imgPhV.webp");

  const isComingSoon = course.status === "COMING_SOON";
  const isLegacy = course.status === "LEGACY" || course.allowNewEnrollments === false;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={isComingSoon ? undefined : onPress}
      activeOpacity={isComingSoon ? 1 : 0.7}
      disabled={isComingSoon}
    >
      {/* Coluna da Esquerda: Capa com badge apenas para a exceção (Reflexivo) */}
      <View style={styles.imagePlaceholder}>
        <Image
          source={imageSource as any}
          style={styles.courseImage}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
          priority="high"
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        />

        {/* Topo da Imagem: Em Breve ou Encerrado */}
        {isComingSoon ? (
          <View style={styles.imageTopBadge}>
            <Text style={styles.imageTopBadgeText}>Em breve</Text>
          </View>
        ) : isLegacy ? (
          <View
            style={[
              styles.imageTopBadge,
              { backgroundColor: theme.colors.muted },
            ]}
          >
            <Text
              style={[
                styles.imageTopBadgeText,
                { color: theme.colors.background },
              ]}
            >
              Encerrado
            </Text>
          </View>
        ) : null}

        {/* Base da Imagem: Destaca apenas a exceção (Reflexivo) */}
        {pedagogicalProfile.kind === "reflective" && (
          <View style={styles.imageTypeBadgeReflectiveContainer}>
            <View style={styles.imageTypeBadgeReflective}>
              <Text style={styles.imageTypeTextReflective} numberOfLines={1}>
                {pedagogicalProfile.label}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Coluna da Direita: Conteúdo Textual Despoluído */}
      <View style={styles.content}>
        <View style={styles.topContent}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>

          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {course.description}
          </Text>
        </View>

        {/* Metadados: Aulas • Duração • Nível (Linha única sem quebra) */}
        <View style={styles.metadataRow}>
          <View style={styles.metadataItem}>
            <BookOpen size={12} color={theme.colors.muted} />
            <Text style={styles.metadataText}>{course.lessonCount} aulas</Text>
          </View>

          <Text style={styles.metadataSeparator}>•</Text>

          <View style={styles.metadataItem}>
            <Clock size={12} color={theme.colors.muted} />
            <Text style={styles.metadataText}>{durationText}</Text>
          </View>

          <Text style={styles.metadataSeparator}>•</Text>

          <View style={styles.metadataItem}>
            <BarChart3 size={12} color={theme.colors.muted} />
            <Text style={styles.metadataText}>{displayLevel}</Text>
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
