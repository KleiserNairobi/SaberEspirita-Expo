import React from "react";
import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import { Lightbulb } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface HighlightCardProps {
  highlights: Array<{
    title: string;
    content: string;
  }>;
  fontSize?: number;
}

export function HighlightCard({ highlights, fontSize = 16 }: HighlightCardProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const markdownStyles = {
    body: {
      ...theme.text("md", "regular"),
      textAlign: "justify",
      fontSize: fontSize,
      color: theme.colors.text,
      lineHeight: fontSize * 1.5,
      width: "100%",
    },
    paragraph: {
      marginBottom: 0, // Destaques geralmente são compactos
      ...theme.text("md", "regular"),
      textAlign: "justify",
      fontSize: fontSize,
      color: theme.colors.text,
      lineHeight: fontSize * 1.5,
      width: "100%",
    },
    strong: {
      ...theme.text("md", "medium"),
      fontSize: fontSize,
      fontWeight: "normal",
      color: theme.colors.text,
    },
    em: {
      ...theme.text("md", "regular"),
      fontStyle: "italic",
      fontSize: fontSize,
      color: theme.colors.text,
    },
  } as any;

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
          <Text style={[styles.highlightTitle, { fontSize }]}>{highlight.title}</Text>
          <View style={styles.highlightContent}>
            <Markdown
              style={markdownStyles}
              rules={{
                paragraph: (node, children, parent, styles) => (
                  <Text key={node.key} style={styles.paragraph}>
                    {children}
                  </Text>
                ),
              }}
            >
              {highlight.content}
            </Markdown>
          </View>
        </View>
      ))}
    </View>
  );
}
