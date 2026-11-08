import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { WifiOff } from "lucide-react-native";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface OfflineStateCardProps {
  title?: string;
  description?: string;
  onRetry: () => void;
  isRetrying?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function OfflineStateCard({
  title = "Não foi possível conectar ao servidor",
  description = "Verifique sua conexão com a internet e tente novamente.",
  onRetry,
  isRetrying = false,
  style,
}: OfflineStateCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrapper}>
        <WifiOff size={26} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Button
        title="Tentar novamente"
        onPress={onRetry}
        loading={isRetrying}
        variant="primary"
        size="md"
        style={styles.button}
      />
    </View>
  );
}
