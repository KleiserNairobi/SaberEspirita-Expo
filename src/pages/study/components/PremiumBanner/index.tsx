import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { Crown } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface PremiumBannerProps {
  onPress?: () => void;
}

export function PremiumBanner({ onPress }: PremiumBannerProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Floating Cutout Badge */}
      <View style={styles.cutoutBadge}>
        <Crown size={13} color={theme.colors.warning} />
        <Text style={styles.cutoutBadgeText}>PREMIUM</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Aprofunde seus Estudos</Text>
        <Text style={styles.description}>
          Acesso ilimitado às séries completas de André Luiz, Emmanuel e estudos guiados
          exclusivos.
        </Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>Conhecer o Saber+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
