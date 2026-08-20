import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Heart } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IPrayer } from "@/types/prayer";
import { createStyles } from "./styles";

interface PrayerListItemProps {
  prayer: IPrayer;
  categoryId?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

export function PrayerListItem({
  prayer,
  isFavorite,
  onToggleFavorite,
  onPress,
}: PrayerListItemProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

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
