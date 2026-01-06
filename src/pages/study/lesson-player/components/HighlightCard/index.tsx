import React from "react";
import { View, Text } from "react-native";
import { Lightbulb } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface HighlightCardProps {
  highlights: Array<{
    title: string;
    content: string;
  }>;
}

export function HighlightCard({ highlights }: HighlightCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Lightbulb size={20} color={theme.colors.primary} />
        <Text style={styles.headerTitle}>Destaques</Text>
      </View>
      {highlights.map((highlight, index) => (
        <View key={index} style={styles.highlightItem}>
          <Text style={styles.highlightTitle}>{highlight.title}</Text>
          <Text style={styles.highlightContent}>{highlight.content}</Text>
        </View>
      ))}
    </View>
  );
}
