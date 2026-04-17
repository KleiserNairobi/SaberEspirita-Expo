import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRight, HandHeart } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface AIChatCardProps {
  onPress: () => void;
}

export function AIChatCard({ onPress }: AIChatCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const containerBg = theme.colors.primary + "10";
  const containerBorder = theme.colors.primary;
  const iconBg = theme.colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: containerBg,
          borderColor: containerBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Header Row: Icon + Texts + Indicator */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <HandHeart size={20} color="#FFFFFF" />
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Ajuda para Orar
          </Text>
          <Text style={styles.subtitle}>
            Deixe a IA guiar suas palavras neste momento
          </Text>
        </View>

        <ChevronRight size={20} color={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );
}
