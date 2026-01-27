import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Info } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

interface ChatLimitIndicatorProps {
  remainingToday: number;
  remainingMonth: number;
}

export function ChatLimitIndicator({
  remainingToday,
  remainingMonth,
}: ChatLimitIndicatorProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.xs,
          gap: theme.spacing.xs,
        },
      ]}
    >
      <Info size={16} color={theme.colors.textSecondary} />
      <Text
        style={{
          ...theme.text("xs", "regular", theme.colors.textSecondary),
        }}
      >
        {remainingToday} mensagens restantes hoje • {remainingMonth} este mês
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
