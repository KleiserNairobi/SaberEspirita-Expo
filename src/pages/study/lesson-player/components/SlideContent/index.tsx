import React from "react";
import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface SlideContentProps {
  title: string;
  content: string; // Markdown formatted
  imagePrompt?: string;
}

export function SlideContent({ title, content, imagePrompt }: SlideContentProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Estilos markdown (reutilizando padrão do Chat)
  const markdownStyles = {
    body: {
      ...theme.text("md", "regular"),
      color: theme.colors.text,
      lineHeight: 24,
    },
    paragraph: {
      marginBottom: theme.spacing.md,
    },
    strong: {
      ...theme.text("md", "semibold"),
      color: theme.colors.text,
    },
    em: {
      ...theme.text("md", "regular"),
      fontStyle: "italic",
      color: theme.colors.text,
    },
    bullet_list: {
      marginBottom: theme.spacing.md,
    },
    ordered_list: {
      marginBottom: theme.spacing.md,
    },
    list_item: {
      flexDirection: "row",
      marginBottom: theme.spacing.xs,
    },
    bullet_list_icon: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
      marginRight: theme.spacing.sm,
      marginTop: 8,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
      paddingLeft: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.xs,
    },
  } as any;

  return (
    <View style={styles.slideCard}>
      <Text style={styles.slideTitle}>{title}</Text>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </View>
  );
}
