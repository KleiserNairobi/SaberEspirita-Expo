import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { WifiOff } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface OfflineStatusBannerProps {
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export function OfflineStatusBanner({
  message = "Sem conexão com a internet. Exibindo conteúdo salvo.",
  style,
}: OfflineStatusBannerProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <WifiOff size={16} color={theme.colors.warning} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
