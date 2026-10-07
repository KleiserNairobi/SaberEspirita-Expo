import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Crown, Star } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ICourse, IUserCourseProgress } from "@/types/course";

import { createStyles } from "./styles";

interface VerticalCourseCardProps {
  course: ICourse;
  progress?: IUserCourseProgress;
  isFeatured?: boolean;
  width?: number;
  onPress: () => void;
}

const DIFFICULTY_MAP: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
  INICIANTE: "Iniciante",
  INTERMEDIARIO: "Intermediário",
  AVANCADO: "Avançado",
};

export const VerticalCourseCard = React.memo(function VerticalCourseCard({
  course,
  width,
  onPress,
}: VerticalCourseCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const isComingSoon = course.status === "COMING_SOON";
  const finalRating = course.averageRating ?? course.rating;

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
        : require("@/assets/images/placeholder.jpeg");

  return (
    <TouchableOpacity
      style={[styles.card, width ? { width } : undefined]}
      onPress={isComingSoon ? undefined : onPress}
      activeOpacity={isComingSoon ? 1 : 0.75}
      disabled={isComingSoon}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={imageSource}
          placeholder={require("@/assets/images/placeholder.jpeg")}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />

        {/* Topo Esquerdo: "Em breve" ou "Premium" */}
        {isComingSoon ? (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Em breve</Text>
          </View>
        ) : course.isPremium ? (
          <View style={styles.premiumBadge}>
            <Crown size={11} color={theme.colors.warning} />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        ) : null}

        {/* Gradiente suave na base da imagem para legibilidade do título */}
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.22)", "rgba(0, 0, 0, 0.62)"]}
          locations={[0, 0.45, 1]}
          style={styles.imageGradientOverlay}
        >
          <Text style={styles.imageTitle} numberOfLines={2} ellipsizeMode="tail">
            {course.title}
          </Text>
        </LinearGradient>
      </View>

      {/* Faixa inferior limpa: [Nível] à esquerda e [Nota] à direita */}
      <View style={styles.footerRow}>
        <Text style={styles.levelText}>{displayLevel}</Text>

        {finalRating !== undefined && finalRating !== null && finalRating > 0 && (
          <View style={styles.ratingBox}>
            <Star size={11} color={theme.colors.warning} fill={theme.colors.warning} />
            <Text style={styles.ratingText}>{finalRating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});
