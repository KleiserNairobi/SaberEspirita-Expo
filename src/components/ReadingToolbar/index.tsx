import {
  ArrowLeft,
  Heart,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ITheme } from "@/configs/theme/types";
import { useAppTheme } from "@/hooks/useAppTheme";

export interface ReadingToolbarProps {
  onBack: () => void;
  onShare: () => void;
  onNarrate: () => void;
  isNarrating: boolean;

  // Botão Unificado de Preferências de Leitura (Aa)
  onPreferences?: () => void;

  // Compatibilidade legada (opcionais descontinuados)
  onIncreaseFontSize?: () => void;
  onDecreaseFontSize?: () => void;
  canIncreaseFontSize?: boolean;
  canDecreaseFontSize?: boolean;

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
  onPreferences,
  onIncreaseFontSize,
  showFavorite = true,
  isFavorite = false,
  onFavorite,
}: ReadingToolbarProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const handlePreferencesPress = onPreferences || onIncreaseFontSize;

  return (
    <View style={styles.container}>
      {/* Voltar */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityLabel="Voltar"
      >
        <ArrowLeft size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Favorito (Opcional) */}
      {showFavorite && onFavorite && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onFavorite}
          activeOpacity={0.7}
          accessibilityLabel="Favoritar"
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
        accessibilityLabel={isNarrating ? "Pausar Narração" : "Iniciar Narração"}
      >
        {isNarrating ? (
          <VolumeX size={20} color={theme.colors.onPrimary} />
        ) : (
          <Volume2 size={20} color={theme.colors.primary} />
        )}
      </TouchableOpacity>

      {/* Compartilhar */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onShare}
        activeOpacity={0.7}
        accessibilityLabel="Compartilhar"
      >
        <Share2 size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Botão Unificado Aa (Preferências de Leitura) */}
      {handlePreferencesPress && (
        <TouchableOpacity
          style={styles.preferencesButton}
          onPress={handlePreferencesPress}
          activeOpacity={0.7}
          accessibilityLabel="Preferências de Leitura (Aa)"
        >
          <Text style={styles.preferencesButtonText}>Aa</Text>
        </TouchableOpacity>
      )}
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
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
    },
    preferencesButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    preferencesButtonText: {
      ...theme.text("sm", "bold", theme.colors.onPrimary),
    },
  });
