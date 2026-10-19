import React, { useMemo } from "react";
import { View, Text, Linking } from "react-native";
import Markdown from "react-native-markdown-display";

import { useAppTheme } from "@/hooks/useAppTheme";
import { IGlossaryTerm } from "@/types/glossary";
import { injectGlossaryLinks } from "@/utils/glossaryParser";
import { useReaderPreferencesStore } from "@/stores/readerPreferencesStore";
import { createStyles } from "./styles";

interface SlideContentProps {
  title: string;
  content: string; // Markdown formatted
  imagePrompt?: string;
  fontSize?: number;
  slideType?: string; // Tipo do slide (ex: "Contexto do Capítulo", "Tese Central")
  glossaryTerms?: IGlossaryTerm[];
  onGlossaryTermPress?: (termId: string, matchedWord?: string) => void;
  slideIndex: number;
}

export function SlideContent({
  title,
  content,
  fontSize: propFontSize,
  slideType,
  glossaryTerms = [],
  onGlossaryTermPress,
  slideIndex,
}: SlideContentProps) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { getFontSize, getTitleSize, getQuoteSize, getLineHeight } =
    useReaderPreferencesStore();

  const fontSize = propFontSize ?? getFontSize();
  const calculatedLineHeight = getLineHeight();
  const titleSize = getTitleSize();
  const quoteSize = getQuoteSize();

  // Memoiza a injeção do glossário para não reprocessar à toa a cada re-render
  const parsedContent = useMemo(() => {
    return injectGlossaryLinks(content, glossaryTerms);
  }, [content, glossaryTerms]);

  // Estilos markdown com tipografia de leitura (Barlow normal)
  const markdownStyles = {
    body: {
      ...theme.readingText(fontSize, "regular", theme.colors.text, calculatedLineHeight),
      textAlign: "left",
    },
    paragraph: {
      marginBottom: theme.spacing.md,
      ...theme.readingText(fontSize, "regular", theme.colors.text, calculatedLineHeight),
      textAlign: "left",
    },
    strong: {
      ...theme.readingText(fontSize, "semibold", theme.colors.text),
      fontWeight: "normal", // Override default bold
    },
    em: {
      ...theme.readingText(fontSize, "italic", theme.colors.text),
      fontStyle: "italic",
    },
    link: {
      ...theme.readingText(fontSize, "regular", theme.colors.text),
      textDecorationLine: "underline",
      textDecorationStyle: "dotted",
      textDecorationColor: theme.colors.error,
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
      ...theme.readingText(quoteSize, "italic", theme.colors.text, Math.round(quoteSize * 1.5)),
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
            fontSize: titleSize,
            lineHeight: Math.round(titleSize * 1.35),
            textAlign: "left",
          },
        ]}
      >
        {title}
      </Text>
      <Markdown
        style={markdownStyles}
        mergeStyle={false}
        onLinkPress={(url) => {
          // eslint-disable-next-line no-console
          console.log("MARKDOWN LINK CLICK", url);
          if (url.startsWith("glossary://")) {
            const raw = url.replace("glossary://", "");
            const [termId, query] = raw.split("?matched=");

            if (onGlossaryTermPress) {
              onGlossaryTermPress(termId, query ? decodeURIComponent(query) : undefined);
            }
            return false;
          }
          Linking.openURL(url).catch(console.error);
          return false;
        }}
        rules={{
          body: (node, children, _parent, styles) => (
            <View key={`${slideIndex}_${node.key}`} style={styles.body}>
              {children}
            </View>
          ),
          paragraph: (node, children, _parent, styles) => (
            <Text key={`${slideIndex}_${node.key}`} style={styles.paragraph}>
              {children}
            </Text>
          ),
          link: (node, children, _parent, styles, onLinkPress) => {
            const href = node.attributes.href || "";
            if (href.startsWith("glossary://")) {
              return (
                <Text
                  key={`${slideIndex}_${node.key}`}
                  style={{
                    color: theme.colors.text,
                    textDecorationLine: "underline",
                    textDecorationStyle: "dotted",
                    textDecorationColor: theme.colors.error,
                    fontFamily: theme.typography.reading.regular,
                    fontSize: fontSize,
                    lineHeight: calculatedLineHeight,
                  }}
                  suppressHighlighting={true}
                  onPress={() => onLinkPress?.(href)}
                  onPressIn={() => console.log("Press In Link ios")}
                >
                  {children}
                </Text>
              );
            }
            return (
              <Text
                key={`${slideIndex}_${node.key}`}
                style={styles.link}
                onPress={() => onLinkPress?.(href)}
              >
                {children}
              </Text>
            );
          },
        }}
      >
        {parsedContent}
      </Markdown>
    </View>
  );
}
