import React from "react";
import { View, Text } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface AccountHeaderProps {
  displayName: string;
  email: string;
}

export function AccountHeader({ displayName, email }: AccountHeaderProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={theme.text("xxl", "semibold")}>{displayName}</Text>
      <Text style={theme.text("lg", "semibold", theme.colors.textSecondary)}>
        {email}
      </Text>
    </View>
  );
}
