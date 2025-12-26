import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { useAppTheme } from "@/hooks/useAppTheme";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[theme.text("xs", "regular", theme.colors.muted), styles.title]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
