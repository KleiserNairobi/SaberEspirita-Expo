import React from "react";
import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import { Lightbulb } from "lucide-react-native";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IGlossaryTerm } from "@/types/glossary";
import { injectGlossaryLinks } from "@/utils/glossaryParser";
import { createStyles } from "./styles";
import { Linking } from "react-native";

interface HighlightCardProps {
  highlights: Array<{
    title: string;
    content: string;
  }>;
  fontSize?: number;
  glossaryTerms?: IGlossaryTerm[];
  onGlossaryTermPress?: (termId: string, matchedWord?: string) => void;
}

export function HighlightCard({
  highlights,
  fontSize = 16,
  glossaryTerms = [],
  onGlossaryTermPress,
}: HighlightCardProps) {
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
    link: {
      color: theme.colors.text,
      textDecorationLine: "underline",
      textDecorationStyle: "dotted",
      textDecorationColor: theme.colors.error,
      fontSize: fontSize,
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
              onLinkPress={(url) => {
                if (url.startsWith("glossary://")) {
                  const raw = url.replace("glossary://", "");
                  const [termId, query] = raw.split("?matched=");
                  if (onGlossaryTermPress) {
                    onGlossaryTermPress(
                      termId,
                      query ? decodeURIComponent(query) : undefined
                    );
                  }
                  return false;
                }
                Linking.openURL(url).catch(console.error);
                return false;
              }}
              rules={{
                paragraph: (node, children, parent, styles) => (
                  <Text key={node.key} style={styles.paragraph}>
                    {children}
                  </Text>
                ),
                link: (node, children, parent, styles, onLinkPress) => {
                  const href = node.attributes.href || "";
                  if (href.startsWith("glossary://")) {
                    return (
                      <Text
                        key={node.key}
                        style={{
                          color: theme.colors.text,
                          textDecorationLine: "underline",
                          textDecorationStyle: "dotted",
                          textDecorationColor: theme.colors.error,
                          fontFamily: theme.typography.weights.regular,
                          fontSize: fontSize,
                        }}
                        suppressHighlighting={true}
                        onPress={() => onLinkPress?.(href)}
                      >
                        {children}
                      </Text>
                    );
                  }
                  return (
                    <Text
                      key={node.key}
                      style={styles.link}
                      onPress={() => onLinkPress?.(href)}
                    >
                      {children}
                    </Text>
                  );
                },
              }}
            >
              {injectGlossaryLinks(highlight.content, glossaryTerms)}
            </Markdown>
          </View>
        </View>
      ))}
    </View>
  );
}
