import React from "react";
import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";

import { useAppTheme } from "@/hooks/useAppTheme";
import { createStyles } from "./styles";

interface SlideContentProps {
  title: string;
  content: string; // Markdown formatted
  imagePrompt?: string;
  fontSize?: number;
  slideType?: string; // Tipo do slide (ex: "Contexto do Capítulo", "Tese Central")
}

export function SlideContent({
  title,
  content,
  imagePrompt,
  fontSize = 16,
  slideType,
}: SlideContentProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Estilos markdown (reutilizando padrão do Chat)
  const markdownStyles = {
    body: {
      ...theme.text("md", "regular"),
      fontSize: fontSize,
      color: theme.colors.text,
      lineHeight: fontSize * 1.5,
    },
    paragraph: {
      marginBottom: theme.spacing.md,
    },
    strong: {
      ...theme.text("md", "medium"),
      fontSize: fontSize,
      fontWeight: "normal", // Override default bold
      color: theme.colors.text,
    },
    em: {
      ...theme.text("md", "regular"),
      fontStyle: "italic",
      fontSize: fontSize,
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
      marginTop: fontSize / 2 + 2, // Ajuste dinâmico
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
    // heading1: {
    //   ...theme.text("md", "medium"),
    //   fontSize: fontSize * 1.1,
    //   fontWeight: "normal",
    //   color: theme.colors.text,
    //   marginBottom: theme.spacing.sm,
    // },
    // heading2: {
    //   ...theme.text("md", "medium"),
    //   fontSize: fontSize * 1.1,
    //   fontWeight: "normal",
    //   color: theme.colors.text,
    //   marginBottom: theme.spacing.sm,
    // },
    // heading3: {
    //   ...theme.text("md", "medium"),
    //   fontSize: fontSize * 1.1,
    //   fontWeight: "normal",
    //   color: theme.colors.text,
    //   marginBottom: theme.spacing.sm,
    // },
    // heading4: {
    //   ...theme.text("md", "medium"),
    //   fontSize: fontSize * 1.0,
    //   fontWeight: "normal",
    //   color: theme.colors.text,
    //   marginBottom: theme.spacing.sm,
    // },
    // heading5: {
    //   ...theme.text("md", "medium"),
    //   fontSize: fontSize * 1.0,
    //   fontWeight: "normal",
    //   color: theme.colors.text,
    //   marginBottom: theme.spacing.sm,
    // },
    // heading6: {
    //   ...theme.text("md", "medium"),
    //   fontSize: fontSize * 1.0,
    //   fontWeight: "normal",
    //   color: theme.colors.text,
    //   marginBottom: theme.spacing.sm,
    // },
  } as any;

  return (
    <View style={styles.slideCard}>
      {/* Badge do tipo do slide */}
      {slideType && (
        <View style={styles.slideTypeBadge}>
          <Text style={styles.slideTypeText}>{slideType}</Text>
        </View>
      )}
      <Text
        style={[
          styles.slideTitle,
          {
            fontSize: fontSize * 1.2,
            lineHeight: fontSize * 1.6,
            textAlign: "left",
          },
        ]}
      >
        {title}
      </Text>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </View>
  );
}
