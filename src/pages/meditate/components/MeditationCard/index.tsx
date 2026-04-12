import { Headphones, Lock, ChevronRight, Clock, User } from "lucide-react-native";
import { differenceInDays } from "date-fns";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IMeditation } from "@/types/meditate";
import { createStyles } from "./styles";

interface MeditationCardProps {
  meditation: IMeditation;
  onPress: () => void;
}

export function MeditationCard({ meditation, onPress }: MeditationCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Simulação de check de premium pro futuro
  const isLocked = meditation.isPremium;

  const isNew =
    meditation.createdAt &&
    differenceInDays(new Date(), meditation.createdAt) <= 15;

  return (
    <TouchableOpacity
      style={[styles.container, isLocked && styles.premiumBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Headphones size={20} color={theme.colors.primary} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {meditation.title}
          </Text>
          {isNew && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Novo</Text>
            </View>
          )}
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <User size={12} color={theme.colors.textSecondary} />
            <Text style={styles.metaTextAuthor} numberOfLines={1}>
              {meditation.author}
            </Text>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaItem}>
            <Clock size={12} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{meditation.durationMinutes} min</Text>
          </View>
        </View>
      </View>

      <ChevronRight size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
}
