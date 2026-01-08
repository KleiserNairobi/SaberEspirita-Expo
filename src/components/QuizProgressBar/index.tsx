import React from "react";
import { View, Text } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface QuizProgressBarProps {
  current: number;
  total: number;
  title: string;
  subtitle?: string;
}

export function QuizProgressBar({
  current,
  total,
  title,
  subtitle,
}: QuizProgressBarProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                ...theme.text("xs", "regular"),
                color: theme.colors.textSecondary,
                marginTop: 2,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          )}
        </View>
        <Text style={styles.counter}>
          {current} / {total}
        </Text>
      </View>
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}
