import React from "react";
import { View, Text } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface QuizProgressBarProps {
  current: number;
  total: number;
  title: string;
}

export function QuizProgressBar({ current, total, title }: QuizProgressBarProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
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
