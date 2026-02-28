import {
  AArrowDown,
  AArrowUp,
  ArrowLeft,
  Heart,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";

interface ReadingToolbarProps {
  onBack: () => void;
  onShare: () => void;
  onNarrate: () => void;
  isNarrating: boolean;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  canIncreaseFontSize: boolean;
  canDecreaseFontSize: boolean;

  // Opcionais para Favorito
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavorite?: () => void;
}

export function ReadingToolbar({
  onBack,
  onShare,
  onNarrate,
  isNarrating,
  onIncreaseFontSize,
  onDecreaseFontSize,
  canIncreaseFontSize,
  canDecreaseFontSize,
  showFavorite = true,
  isFavorite = false,
  onFavorite,
}: ReadingToolbarProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Voltar */}
      <TouchableOpacity style={styles.actionButton} onPress={onBack} activeOpacity={0.7}>
        <ArrowLeft size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Favorito (Opcional) */}
      {showFavorite && onFavorite && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onFavorite}
          activeOpacity={0.7}
        >
          <Heart
            size={20}
            color={theme.colors.primary}
            fill={isFavorite ? theme.colors.primary : "transparent"}
          />
        </TouchableOpacity>
      )}

      {/* Narrar */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          isNarrating && { backgroundColor: theme.colors.primary },
        ]}
        onPress={onNarrate}
        activeOpacity={0.7}
      >
        {isNarrating ? (
          <VolumeX size={20} color="#FFFFFF" />
        ) : (
          <Volume2 size={20} color={theme.colors.primary} />
        )}
      </TouchableOpacity>

      {/* Compartilhar */}
      <TouchableOpacity style={styles.actionButton} onPress={onShare} activeOpacity={0.7}>
        <Share2 size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Diminuir Fonte */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onDecreaseFontSize}
        activeOpacity={0.7}
        disabled={!canDecreaseFontSize}
      >
        <AArrowDown
          size={20}
          color={!canDecreaseFontSize ? theme.colors.muted : theme.colors.primary}
        />
      </TouchableOpacity>

      {/* Aumentar Fonte */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onIncreaseFontSize}
        activeOpacity={0.7}
        disabled={!canIncreaseFontSize}
      >
        <AArrowUp
          size={20}
          color={!canIncreaseFontSize ? theme.colors.muted : theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
    },
  });
