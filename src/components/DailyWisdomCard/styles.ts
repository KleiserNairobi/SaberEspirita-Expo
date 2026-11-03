import { StyleSheet } from "react-native";

import { ITheme } from "@/configs/theme/types";

export const createStyles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      position: "relative",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md + 4,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md + 8,
      paddingBottom: theme.spacing.md,
      backgroundColor: `${theme.colors.primary}12`,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}40`,
      borderRadius: theme.radius.sm,
    },
    badge: {
      position: "absolute",
      top: -12,
      left: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.xs,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}50`,
    },
    badgeText: {
      ...theme.text("xs", "semibold", theme.colors.primary),
    },
    title: {
      ...theme.text("md", "semibold", theme.colors.text),
      marginBottom: theme.spacing.sm,
    },
    quoteContainer: {
      backgroundColor: `${theme.colors.background}80`,
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: theme.spacing.xs + 3,
      borderRadius: theme.radius.xs,
      marginBottom: theme.spacing.sm,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.primary,
    },
    quoteText: {
      ...theme.literaryText(15, theme.colors.text, 22),
    },
    contentSnippet: {
      ...theme.text("md", "regular", theme.colors.text),
      lineHeight: 22,
      marginBottom: theme.spacing.sm,
      opacity: 0.9,
    },
    continueReadingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      marginBottom: theme.spacing.md,
      alignSelf: "flex-start",
    },
    continueReadingText: {
      ...theme.text("sm", "semibold", theme.colors.primary),
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    continueReadingIcon: {
      marginTop: 1.5,
    },
    moodPromptContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm + 2,
      backgroundColor: `${theme.colors.primary}08`,
      borderRadius: theme.radius.xs,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}20`,
      marginBottom: 0,
    },
    moodPromptLabel: {
      ...theme.text("sm", "regular", theme.colors.textSecondary),
    },
    moodPromptButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    moodPromptButtonText: {
      ...theme.text("sm", "semibold", theme.colors.primary),
    },
  });
