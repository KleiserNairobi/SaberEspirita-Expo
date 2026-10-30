import {
  ArrowLeft,
  Heart,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

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

  // Estilo customizado do container
  style?: ViewStyle;
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
  style,
}: ReadingToolbarProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const handlePreferencesPress = onPreferences || onIncreaseFontSize;

  return (
    <View style={[styles.container, style]}>
      {/* Botão Voltar (Esquerda) */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityLabel="Voltar"
      >
        <ArrowLeft size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Cluster de Ações (Direita) */}
      <View style={styles.actionsGroup}>
        {/* Favorito (Opcional) */}
        {showFavorite && onFavorite && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onFavorite}
            activeOpacity={0.7}
            accessibilityLabel={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
            isNarrating && styles.actionButtonActive,
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
    </View>
  );
}

const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    actionsGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs + 2,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: `${theme.colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtonActive: {
      backgroundColor: theme.colors.primary,
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
