import React from "react";
import { Text, View } from "react-native";
import { WifiOff } from "lucide-react-native";

import { Button } from "@/components/Button";
import { useAppTheme } from "@/hooks/useAppTheme";

import { createStyles } from "./styles";

interface OfflineCoursesCardProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export function OfflineCoursesCard({
  onRetry,
  isRetrying = false,
}: OfflineCoursesCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <WifiOff size={26} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>Não foi possível carregar as séries</Text>
      <Text style={styles.description}>
        Verifique sua conexão com a internet para carregar o catálogo de estudos
        e o seu progresso.
      </Text>
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

