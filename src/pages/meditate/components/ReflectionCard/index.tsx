import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, Heart, Tag } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IReflection, REFLECTION_TOPICS } from "@/types/reflection";
import { useReflectionFavoritesStore } from "@/stores/reflectionFavoritesStore";
import { createStyles } from "./styles";

interface ReflectionCardProps {
  reflection: IReflection;
  onPress: () => void;
  onPressIn?: () => void;
}

export function ReflectionCard({ reflection, onPress, onPressIn }: ReflectionCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const isFavorite = useReflectionFavoritesStore((state) =>
    state.isFavorite(reflection.id)
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onPressIn={onPressIn}
      activeOpacity={0.7}
    >
      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {reflection.title}
        </Text>
        {reflection.subtitle && (
          <Text style={styles.subtitle} numberOfLines={2}>
            {reflection.subtitle}
          </Text>
        )}

        {/* Autor e Fonte com ícone de favorito */}
        <View style={styles.metaContainer}>
          <Heart
            size={14}
            color={theme.colors.primary}
            fill={isFavorite ? theme.colors.primary : "transparent"}
            style={styles.favoriteIcon}
          />
          <Text style={styles.metaText} numberOfLines={1}>
            {reflection.author}
            {reflection.source && ` • ${reflection.source}`}
          </Text>
        </View>

        {/* Tópico */}
        <View style={styles.topicContainer}>
          <Tag size={14} color={theme.colors.primary} style={styles.topicIcon} />
          <Text style={styles.topicText} numberOfLines={1}>
            {REFLECTION_TOPICS[reflection.topic]?.label || reflection.topic}
          </Text>
        </View>
      </View>

      {/* Ícone de navegação */}
      <ChevronRight size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
}
