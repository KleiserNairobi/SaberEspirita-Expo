import { differenceInDays, format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ChevronRight, Clock, Mic, User } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IPodcast } from "@/types/podcast";
import { createStyles } from "./styles";

interface PodcastCardProps {
  podcast: IPodcast;
  onPress: () => void;
}

function formatPodcastDate(dateInput?: string | Date): string | null {
  if (!dateInput) return null;
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return null;

    if (isToday(d)) return "Hoje";
    if (isYesterday(d)) return "Ontem";

    const currentYear = new Date().getFullYear();
    if (d.getFullYear() === currentYear) {
      return format(d, "d 'de' MMM", { locale: ptBR });
    }
    return format(d, "d 'de' MMM, yyyy", { locale: ptBR });
  } catch {
    return null;
  }
}

export const PodcastCard = React.memo(function PodcastCard({
  podcast,
  onPress,
}: PodcastCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const isLocked = podcast.isPremium;

  const isNew =
    podcast.createdAt &&
    differenceInDays(new Date(), new Date(podcast.createdAt)) <= 15;

  const formattedDate = formatPodcastDate(podcast.createdAt);

  return (
    <TouchableOpacity
      style={[styles.container, isLocked && styles.premiumBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Mic size={20} color={theme.colors.primary} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {podcast.title}
          </Text>
          {isNew && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Novo</Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          {podcast.author ? (
            <>
              <View style={styles.metaItem}>
                <User size={12} color={theme.colors.textSecondary} />
                <Text style={styles.metaTextAuthor} numberOfLines={1}>
                  {podcast.author}
                </Text>
              </View>
              <View style={styles.metaDivider} />
            </>
          ) : null}

          {formattedDate ? (
            <>
              <View style={styles.metaItem}>
                <Calendar size={12} color={theme.colors.textSecondary} />
                <Text style={styles.metaTextDate}>{formattedDate}</Text>
              </View>
              <View style={styles.metaDivider} />
            </>
          ) : null}

          <View style={styles.metaItem}>
            <Clock size={12} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{podcast.durationMinutes} min</Text>
          </View>
        </View>
      </View>

      <ChevronRight size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
});
