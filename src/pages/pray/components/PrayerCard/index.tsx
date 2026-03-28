import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, Heart } from "lucide-react-native";
import { differenceInDays } from "date-fns";
import { useAppTheme } from "@/hooks/useAppTheme";
import { IPrayer } from "@/types/prayer";
import { usePrayerFavoritesStore } from "@/stores/prayerFavoritesStore";
import { createStyles } from "./styles";

interface PrayerCardProps {
  prayer: IPrayer;
  onPress: () => void;
}

export function PrayerCard({ prayer, onPress }: PrayerCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const isFavorite = usePrayerFavoritesStore((state) => state.isFavorite(prayer.id));

  const isNew = prayer.createdAt && differenceInDays(new Date(), prayer.createdAt) <= 15;

  // Construir texto de metadados (author e/ou source)
  const metadataText = [prayer.author, prayer.source].filter(Boolean).join(" • ");

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {isNew && <View style={styles.newBadgeDot} />}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {prayer.title}
          </Text>

          {isNew && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Novo</Text>
            </View>
          )}
        </View>

        {metadataText ? (
          <View style={styles.metadataRow}>
            <Heart
              size={14}
              color={theme.colors.primary}
              fill={isFavorite ? theme.colors.primary : "transparent"}
              style={styles.favoriteIconInline}
            />
            <Text style={styles.metadataText} numberOfLines={1}>
              {metadataText}
            </Text>
          </View>
        ) : null}
      </View>
      <ChevronRight size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
}
