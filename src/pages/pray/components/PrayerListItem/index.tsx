import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import {
  Heart,
  Sunrise,
  Moon,
  HeartPulse,
  Users,
  HandHeart,
  BookOpen,
  Sparkles,
} from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IPrayer, PrayerMoment } from "@/types/prayer";
import { createStyles } from "./styles";

// Mapeamento de ícones para cada momento (mesmo do /Pray/index.tsx)
const MOMENT_ICONS = {
  "AO-ACORDAR": Sunrise,
  "AO-DORMIR": Moon,
  DIARIO: BookOpen,
  "POR-ANIMO": HeartPulse,
  "POR-ALGUEM": Users,
  "POR-CURA": Heart,
  "POR-GRATIDAO": Sparkles,
  "POR-PAZ": HandHeart,
} as const;

interface PrayerListItemProps {
  prayer: IPrayer;
  categoryId: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

export function PrayerListItem({
  prayer,
  categoryId,
  isFavorite,
  onToggleFavorite,
  onPress,
}: PrayerListItemProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Obter o ícone da categoria
  const IconComponent = MOMENT_ICONS[categoryId as PrayerMoment] || BookOpen;

  // Construir texto de metadados (author e/ou source)
  function getMetadataText() {
    if (prayer.author && prayer.source) {
      return `${prayer.author} • ${prayer.source}`;
    }
    if (prayer.author) {
      return prayer.author;
    }
    if (prayer.source) {
      return prayer.source;
    }
    return null;
  }

  const metadataText = getMetadataText();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.title}>{prayer.title}</Text>
        {metadataText && <Text style={styles.description}>{metadataText}</Text>}
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        activeOpacity={0.7}
      >
        <Heart
          size={20}
          color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
          fill={isFavorite ? theme.colors.error : "transparent"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
