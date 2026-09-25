import React from "react";
import { View, Text } from "react-native";
import { AlertCircle } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface CommonMisunderstandingCardProps {
  misunderstanding?: string | null;
  fontSize?: number;
}

export const CommonMisunderstandingCard = React.memo(
  function CommonMisunderstandingCard({
    misunderstanding,
    fontSize = 16,
  }: CommonMisunderstandingCardProps) {
    const { theme } = useAppTheme();
    const styles = createStyles(theme, fontSize);

    if (!misunderstanding || !misunderstanding.trim()) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <AlertCircle size={14} color={theme.colors.warning} />
          <Text style={styles.headerTitle}>Equívoco Frequente a Evitar</Text>
        </View>
        <Text style={styles.content}>{misunderstanding}</Text>
      </View>
    );
  }
);
