import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Crown } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ICourse, IUserCourseProgress } from "@/types/course";

import { createStyles } from "./styles";

interface VerticalCourseCardProps {
  course: ICourse;
  progress?: IUserCourseProgress;
  isFeatured?: boolean;
  onPress: () => void;
}

export const VerticalCourseCard = React.memo(function VerticalCourseCard({
  course,
  progress,
  onPress,
}: VerticalCourseCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Se o curso foi concluído pelo usuário (completedAt ou certificado ou flag)
  const isCompleted =
    Boolean(progress?.completedAt) ||
    Boolean(progress?.certificateIssued) ||
    (progress as any)?.isCompleted === true;

  const totalLessons = course.lessonCount || (course as any).lessonsCount || 0;
  const completedCount = progress?.completedLessons ? progress.completedLessons.length : 0;

  let completionPercent = 0;
  if (isCompleted) {
    completionPercent = 100;
  } else if (totalLessons > 0 && completedCount > 0) {
    completionPercent = (completedCount / totalLessons) * 100;
  } else if ((progress as any)?.progressPercentage !== undefined) {
    completionPercent = (progress as any).progressPercentage;
  } else if ((progress as any)?.progress_percentage !== undefined) {
    completionPercent = (progress as any).progress_percentage;
  }

  const displayPercent = Math.min(Math.round(completionPercent), 100);
  const isComingSoon = course.status === "COMING_SOON";
  const finalRating = course.averageRating ?? course.rating;

  const imageSource =
    typeof course.imageUrl === "string" && course.imageUrl.trim().length > 0
      ? { uri: course.imageUrl }
      : typeof course.imageUrl === "number"
        ? course.imageUrl
        : require("@/assets/images/placeholder.jpeg");

  return (
    <TouchableOpacity
      style={styles.card}
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
            <Crown size={11} color="#FFD700" />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        ) : null}

        {/* Topo Direito: Avaliação por estrelas */}
        {finalRating !== undefined && finalRating !== null && finalRating > 0 && (
          <View style={styles.ratingBadge}>
            <Text style={styles.starText}>★</Text>
            <Text style={styles.ratingText}>{finalRating.toFixed(1)}</Text>
          </View>
        )}

        {!isComingSoon && (
          <View style={styles.imageProgressContainer}>
            <View style={styles.imageProgressBackground}>
              {displayPercent > 0 && (
                <View style={[styles.imageProgressFill, { width: `${displayPercent}%` }]} />
              )}
            </View>
            <Text style={styles.imageProgressText}>{displayPercent}%</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {course.title}
        </Text>
        <Text style={styles.metadata} numberOfLines={1}>
          {totalLessons > 0 ? `${totalLessons} aulas` : "Em breve"} • {course.difficultyLevel || "Geral"}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
