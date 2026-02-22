import { Headphones, Lock, Play, Clock } from "lucide-react-native";
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
        <Text style={styles.title} numberOfLines={1}>
          {meditation.title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {meditation.author}
        </Text>
        <View style={styles.metaRow}>
          <Clock size={12} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>{meditation.durationMinutes} min</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {isLocked ? (
          <Lock size={18} color={theme.colors.accent} />
        ) : (
          <Play size={18} color={theme.colors.primary} fill={theme.colors.primary} />
        )}
      </View>
    </TouchableOpacity>
  );
}
